import { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { BaseContext } from "@/context/BaseContext";
import { Button } from '@/components/form';
import CoinHead from '@/components/coinflip/CoinHead';
import Link from 'next/link';
import JoinGameModal from '@/components/coinflip/JoinGameModal';
import io from 'socket.io-client';
import useStateRef from 'react-usestateref';
import CoinResult from '@/components/coinflip/CoinResult'
import AvatarDarkBg from '@/components/AvatarDarkBg';
import ConfettiExplosion from 'react-confetti-explosion'
import { getCoinflipGame } from '@/api/coinflip'
import { formatUnits } from 'viem'
import Head from "next/head";
import LoadingSmall from '@/components/LoadingSmall'
import { toWebsiteUrl } from "@/utils/toWebsiteUrl"
import CasinoLoader from "@/components/CasinoLoader"
import { Iconify, CopyLinkButton } from "@/components/common"

const CoinFlipRoom = () => {
    const router = useRouter();
    const { roomid } = router.query;
    const { user, userAuth, token, network, casinoError, casinoLoading } = useContext(BaseContext);
    const [game, setGame, gameRef] = useStateRef(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchedGame, setFetchedGame] = useState(false)
    const [showJoinModal, setShowJoinModal] = useState(false);
    const sock = useRef(null)

    const roomLink = () => toWebsiteUrl(`casinos/${router.query?.network}/${router.query?.token}/coinflip/${router.query?.roomid}`)

    const fetchGameById = async (chain_id, token_address, id) => {
        setLoading(true)
        const [er, data] = await getCoinflipGame({ chain_id, token_address, id })
        setLoading(false)

        if (er) {
            let msg = er?.error || er?.details || er?.message || 'Error fetching game'
            if (er?.error === "VALIDATION_ERROR") {
                msg = "Invalid game link!"
            }
            setError(msg)
        }

        if (data) {
            console.log('[GAME]', data)
            setFetchedGame(true)

            setGame(prev => {
                return prev ? {
                    ...prev,
                    ...data,
                    oppBet: data?.bet === 'heads' ? 'tails' : 'heads',
                    state: data?.ended ? 'ended' : 'waiting',
                    didJoin: [data?.creator?.wallet_address, data?.opponent?.wallet_address].includes(user?.wallet_address)
                } : {
                    ...data,
                    state: data?.ended ? 'ended' : 'waiting',
                    oppBet: data?.bet === 'heads' ? 'tails' : 'heads',
                    didJoin: [data?.creator?.wallet_address, data?.opponent?.wallet_address].includes(user?.wallet_address)
                }
            })
        }
    };

    useEffect(()=> {
        console.log('[Game Changed]', game)
    }, [game])

    useEffect(() => {
        if (!fetchedGame) return

        sock.current = io(process.env.NEXT_PUBLIC_WSS_URL, {
            path: '/coinflip-api',
            transports: ['websocket'],
            query: { room: roomid },
            ...userAuth? { auth: { token: userAuth?.token } } : {}
        });

        sock.current.on('connect', () => {
            console.log('connected!');
        });

        sock.current.on('connect_error', (err) => {
            if (err?.message === 'INVALID_ROOM') {
                console.log('GAME ENDED')
            } else {
                console.error(err);
            }
        });

        sock.current.onAny((event, data) => {
            console.log(event, data);
        });

        sock.current.on('game:auth', ({ user }) => {
            console.log(`authed as ${user.id}`);
        });

        sock.current.on('coinflip:state', ({ game }) => {
            setGame(prev => {
                return prev ? {
                    ...prev,
                    ...game,
                    didJoin: [game?.creator?.wallet_address, game?.opponent?.wallet_address].includes(user?.wallet_address)
                } : {
                    ...game,
                    oppBet: game?.bet === 'heads' ? 'tails' : 'heads',
                    didJoin: [game?.creator?.wallet_address, game?.opponent?.wallet_address].includes(user?.wallet_address)
                }
            })
        });

        return () => {
            sock.current.close();
            sock.current.disconnect();
        }

    }, [fetchedGame])

    useEffect(() => {
        if (!roomid || !network || !token) return
        if (fetchedGame) return

        console.log("Fetching game by id", roomid);
        fetchGameById(network?.id, token?.address, roomid);
    }, [roomid, network, token]);

    const joinGame = (betSide) => {
        setShowJoinModal(true);
    };

    function statusColor(v) {
        if (v === 'ended') return 'bg-red'
        if (v === 'ending') return 'bg-gold'
        if (v === 'waiting') return 'bg-green'
        return ''
    }

    if (casinoLoading || casinoError) {
        return <CasinoLoader casinoLoading={casinoLoading} casinoError={casinoError}/>
    }

    if (loading) {
        return <div className="flex items-center flex-col justify-center w-full h-full absolute">
            <div className="flex items-center flex-col justify-center">
                <LoadingSmall />
            </div>
        </div>
    }

    if (error) {
        return (
        <div className="text-center p-10">
            <Iconify icon="mynaui:sad-ghost" className="text-3xl text-primary"/>
            <h1 className="text-2xl font-bold text-red">Game Error!</h1>
            <p className="">{error}</p>
        </div>
        )
    }

    if (!gameRef.current) {
        return <div className="flex items-center flex-col justify-center w-full">
            <div className="flex items-center justify-center">
                <img src="/logo-letter.png" alt="Gambly" className="w-16 h-16" />
                <span className="text-xl font-bold">Game not found</span>
            </div>
        </div>
    }

    const isWinner = (playerIndex) => {
        if (!gameRef.current?.state || gameRef.current?.state !== "ended") return false
        const bet = playerIndex === 0 ? gameRef.current?.bet : gameRef.current?.oppBet
        return gameRef.current?.outcome === bet
    };

    const isLoser = (playerIndex) => {
        if (!gameRef.current?.state || gameRef.current?.state !== "ended") return false
        const bet = playerIndex === 0 ? gameRef.current?.bet : gameRef.current?.oppBet
        return gameRef.current?.outcome !== bet
    };

    const didJoin = () => {
        return gameRef.current?.didJoin
    }

    const canJoin = () => {
        return !gameRef.current?.didJoin && !gameRef.current?.opponent
    }

    const result = () => {
        return gameRef.current?.outcome
    }

    return (
        <div className="flex flex-col w-full bg-dark mx-auto max-w-[1300px]">
            <Head>
                <title>Play Coinflip {token ? `using ${token?.name}` : ''}- Gambly</title>
            </Head>
            <header className="bg-darker p-4">
                <div className="w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Link href={`/casinos/${network?.name}/${token?.address}/coinflip`} className="flex h-10 items-center text-white shadow border border-bordergray bg-gray hover:bg-secondary hover:opacity-100 hover:text-dark opacity-60 transition-all px-3 py-2 rounded-md text-sm">
                                <Iconify icon="line-md:arrow-left" className="mr-2" />
                   
                                    <div className="flex items-center">
                                        <img
                                            src={token?.logo}
                                            alt=""
                                            className="w-4 h-4 mr-1"
                                        />
                                        <span className="text-xs font-semibold">{token?.symbol}</span>
                                    </div>
                 
                            </Link>
                            <div className="flex items-center text-white shadow border h-10 border-bordergray bg-gray opacity-60 px-3 py-2 rounded-md text-sm">
             
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-semibold">Stake: {formatUnits(gameRef.current?.amount, token?.decimals)}</span>
                                        <img
                                            src={token?.logo}
                                            alt=""
                                            className="w-4 h-4"
                                        />
                                    </div>
              
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* <div className="flex items-center text-white shadow h-10 bg-white/5 px-3 py-2 rounded-md text-sm">
                                <span className="text-xs">{gameRef.current?.id.slice(0, 8)}...</span>
                            </div> */}
                            <CopyLinkButton link={roomLink()} className="rounded-md active:bg-green/50" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="h-full px-4 pb-4">
                <div className="bg-darker  h-full border border-bordergray rounded-xl p-6 md:py-16 mb-8 shadow-lg flex flex-col md:flex-row relative">
                    <div className={`z-10 ${gameRef.current?.state == 'waiting' ? 'animate-pulse' : ''} absolute left-[10px] top-[10px] md:top-[30px] table md:left-0 md:right-0 md:mx-auto uppercase font-bold text-xs py-1 px-3 rounded-3xl text-white ${statusColor(gameRef.current?.state)}`}>{gameRef.current?.state}</div>
                    
                    {/* Player 1 (Always present in a new game!) */}
                    <div className={`flex-1 flex flex-col justify-center items-center md:h-full`}>
                        { isWinner(0) && <ConfettiExplosion />}
                        <h2 className={`text-xl font-semibold ${isLoser(0) ? 'text-red' : ''} ${isWinner(0) ? 'text-green' : ''}`}>Player 1 {isWinner(0) && <span className="text-green-400">(Winner)</span>}</h2>
                        <div className="relative my-5">
                            <div className={`p-[4px] transition rounded-full duration-700 ${isLoser(0) ? 'bg-red' : ''} ${isWinner(0) ? 'bg-green' : ''}`}>
                                <AvatarDarkBg customClass={`border bg-dark ${isWinner(0) ? 'border-[transparent]' : 'border-bordergray'} rounded-full p-[15px]`} size={60} playername={gameRef.current?.creator?.wallet_address} />
                            </div>
                            
                            <CoinHead side={gameRef.current?.bet} title={gameRef.current?.bet} size={null} className="text-[50px] absolute inset-y-0 my-auto -right-[40px]" />
                        </div>
                        {
                            user && gameRef.current?.creator?.wallet_address == user?.wallet_address ?
                            <p className="font-medium text-sm mb-4 text-center text-primary">You</p>
                            :
                            <p className="font-medium text-sm mb-4 text-center truncate max-w-[200px] opacity-50">
                            {gameRef.current?.creator?.wallet_address}
                            </p>
                        }
     
                        <div className="flex items-center gap-3">
                            { (gameRef.current?.state !== "ended" || isLoser(0)) &&
                            <>
                                <Iconify icon="majesticons:coins" className={`${isLoser(0) ? 'text-red' : 'text-green'}`} />
                                <span className={`${isLoser(0) ? 'text-red' : ''}`}>-{`${formatUnits(gameRef.current?.amount, token?.decimals)} ${token?.symbol || 'TOKEN'}`}</span>
                            </>
                            }

                            { (isWinner(0) && gameRef.current?.state == "ended") && 
                            <>
                                <Iconify icon="fa6-solid:trophy" className="text-gold animate-pulse"/>
                                <span className="text-green font-bold animate-pulse">+{`${gameRef.current?.reward ? formatUnits(gameRef.current?.reward, token?.decimals) : ""} ${token?.symbol}`}</span>
                            </>
                            }
                        </div>
                    </div>

                    {/* Vertical Divider and VS or Join Game */}
                    <div className="md:absolute md:w-[30%] md:h-full md:py-6 md:m-auto md:top-0 md:bottom-0 md:left-0 md:right-0 flex flex-col items-center justify-center">
                        <div className="hidden md:block w-px bg-bordergray h-[90%] top-[5%] absolute mx-auto inset-0"></div>
                        <div className="md:hidden w-full h-px bg-bordergray absolute inset-0 m-auto"></div>
                        <div className="relative z-1 md:h-[192px]">
                            <div className="my-10 md:mb-0  md:h-[100px] md:mt-[30px] flex items-center">
                                { canJoin() && gameRef.current?.state == "waiting" &&
                                <Button
                                    size="lg"
                                    variant="primary"
                                    className="px-8 py-4 text-xl mb-4"
                                    onClick={() => joinGame(gameRef.current?.oppBet)}
                                >
                                    Join Game
                                    <CoinHead side={gameRef.current?.oppBet} size="md" className="ml-3"/>
                                </Button>
                                }
                                { (gameRef.current?.state == "ending" || gameRef.current?.state == "ended") &&
                                <div className={`transition duration-500 ${gameRef.current?.state == "ending" ? 'scale-50 opacity-50' : ''}`}><CoinResult value={result()} /></div>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Player 2 */}
                    <div className="flex-1 flex flex-col items-center justify-center md:h-full}">
                        { isWinner(1) && <ConfettiExplosion />}
                        <h2 className={`text-xl font-semibold ${isLoser(1) ? 'text-red' : ''} ${isWinner(1) ? 'text-green' : ''}`}>Player 2 {isWinner(1) && <span className="text-green-400">(Winner)</span>}</h2>
                        
                        <div className="relative my-5">
                            { gameRef.current?.opponent ? 
                            (
                                <>
                                <div className={`p-[4px] transition rounded-full duration-700 ${isLoser(1) ? 'bg-red' : ''} ${isWinner(1) ? 'bg-green' : ''}`}>
                                <AvatarDarkBg customClass={`border bg-dark ${isWinner(1) ? 'border-[transparent]' : 'border-bordergray'} rounded-full p-[15px]`} size={60} playername={gameRef.current?.opponent?.wallet_address} />
                            </div>
                            <CoinHead side={gameRef.current?.oppBet} title={gameRef.current?.oppBet} size={null} className="text-[50px] absolute inset-y-0 my-auto -left-[40px]" />
                            </>) : (
                                <>

                            <div className="p-[4px]">
                             <div className="w-[91px] h-[91px] border animate-pulse border-bordergray bg-dark rounded-full flex items-center justify-center">
                                <span className="text-6xl">?</span>
                            </div>
                            </div>
                                </>
                            )
                            }
                        </div>

                        {
                            user && gameRef.current?.opponent?.wallet_address == user?.wallet_address ?
                            <p className="font-medium text-sm mb-4 text-center text-primary">You</p>
                            :
                            <p className="font-medium text-sm mb-4 text-center truncate max-w-[200px] opacity-50">
                            {gameRef.current?.opponent ? gameRef.current?.opponent?.wallet_address : "Waiting for player..."}
                            </p>
                        }
     
                        <div className="flex items-center gap-3">
                            { (gameRef.current?.state != "ended" || isLoser(1)) &&
                            <>
                                <Iconify icon="majesticons:coins" className={`${isLoser(1) ? 'text-red' : 'text-green'}`} />
                                <span className={`${isLoser(1) ? 'text-red' : ''}`}>-{`${formatUnits(gameRef.current?.amount, token?.decimals)} ${token?.symbol || 'TOKEN'}`}</span>
                            </>
                            }

                            { (isWinner(1) && gameRef.current?.state == "ended") && 
                            <>
                                <Iconify icon="fa6-solid:trophy" className="text-gold"/>
                                <span className="text-green font-bold">+{`${gameRef.current?.reward ? formatUnits(gameRef.current?.reward, token?.decimals) : ""} ${token?.symbol}`}</span>
                            </>
                            }
                        </div>
                    </div>
                     
                </div>

                {/* Coinflip Modal */}
                {/* {currentGameRef.current.state === "ended" && (
                    <GameResult game={currentGameRef.current} showModal={showResultModal} setShowModal={setShowResultModal} />
                )} */}
            </div>

            {/* Join Game Modal */}
            <JoinGameModal
                showModal={showJoinModal}
                setShowModal={setShowJoinModal}
                game={gameRef.current}
                socket={sock.current}
                token={token}
            />
        </div>
    );
}

export default CoinFlipRoom;