import { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { BaseContext } from "@/context/BaseContext";
import { Money, Icon } from '@/components/common';
import { Button } from '@/components/form';
import { motion } from 'framer-motion';
// import CoinHead from '@/components/coinflip/CoinHead';
import RPSHead from '@/components/rps/RpsHead';
import Link from 'next/link';
import { faArrowLeft, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertNetworkNameToId } from '@/utils/convertNetworkID';
import JoinGameModal from '@/components/rps/JoinGameModal';
import io from 'socket.io-client';
import authTokens from "@/utils/authTokens";
import useStateRef from 'react-usestateref';
import GameResult from "@/components/rps/GameResult"
import AvatarDarkBg from '@/components/AvatarDarkBg';
import ConfettiExplosion from 'react-confetti-explosion'
import RpsResult from '@/components/rps/RpsResult';
import { getRpsGame } from '@/api'
import { formatUnits } from 'viem'
import LoadingSmall from '@/components/LoadingSmall'
import Head from "next/head";
import { copyToClipboard } from "@/utils/common"
import { toWebsiteUrl } from "@/utils/toWebsiteUrl"
import CasinoLoader from "@/components/CasinoLoader"
import { Iconify, CopyLinkButton } from "@/components/common"

const CoinFlipRoom = () => {
    const router = useRouter();
    const { roomid } = router.query;
    const { user, userAuth, token, network, casinoError, casinoLoading } = useContext(BaseContext);
    const [currentGame, setCurrentGame, currentGameRef] = useStateRef(null);
    const [game, setGame, gameRef] = useStateRef(null);
    const [animDone, setAnimDone] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [socket, setSocket] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [fetchedGame, setFetchedGame] = useState(false)
    const sock = useRef(null)

    useEffect(()=> {
        console.log('[Game Changed]', game)
    }, [game])

    useEffect(() => {
        if (!roomid || !token) return
        if (fetchedGame) return

        console.log("Fetching game by id", roomid);
        fetchGameById(token?.network?.id, token?.address, roomid);
    }, [roomid, token]);

    const fetchGameById = async (chain_id, token_address, id) => {
        setLoading(true)
        const [er, data] = await getRpsGame({ chain_id, token_address, id })
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
            setGame(data)
        }
    };

    useEffect(() => {
        if (!fetchedGame) return
        if (game?.ended != null) return

        sock.current = io('wss://staging.gambly.io', {
            path: '/rps-api',
            transports: ['websocket'],
            query: { room: roomid },
            ...userAuth? { auth: { token: userAuth?.token } } : {}
        });

        sock.current.on('connect', () => {
            console.log('connected!');
        });

        sock.current.on('connect_error', (err) => {
            console.log(`connect error: ${err.message}`);
            console.error(err);
        });

        sock.current.onAny((event, data) => {
            console.log(event, data);
        });

        sock.current.on('game:auth', ({ user }) => {
            console.log(`authed as ${user.id}`);
        });

        sock.current.on('rps:state', ({ game }) => {
            console.log('[game state]', game)
            setGame(prev => {
                return {
                    ...prev,
                    ...game,
                    update: game
                }
            })
        });

        return () => {
            sock.current.close();
            sock.current.disconnect();
        }

    }, [fetchedGame])


    const joinGame = () => {
        setShowJoinModal(true);
    };

    const roomLink = () => toWebsiteUrl(`casinos/${router.query?.network}/${router.query?.token}/rockpaperscissors/${router.query?.roomid}`)

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

    if (!game) {
        return <div className="flex items-center flex-col justify-center w-full">
            <div className="flex items-center justify-center">
                <img src="/logo-letter.png" alt="Gambly" className="w-16 h-16" />
                <span className="text-xl font-bold">Game not found</span>
            </div>
        </div>
    }

    const checkWinner = (player1Bet, player2Bet) => {
        if (player1Bet === player2Bet) {
            return 'tie';
        }

        return (
            (player1Bet === 'rock' && player2Bet === 'scissors') ||
            (player1Bet === 'paper' && player2Bet === 'rock') ||
            (player1Bet === 'scissors' && player2Bet === 'paper')
            ) ? 'player1' : 'player2';
    }

    const isTie = () => {
        if (game?.creator?.bet === null || game?.opponent?.bet === null) return false
        return game?.creator?.bet === game?.opponent?.bet
    };

    const isWinner = (playerIndex) => {
        if (game?.state !== "ended") return false
        const winner = checkWinner(game?.creator?.bet, game?.opponent?.bet)
        return playerIndex === 0 ? winner === 'player1' : winner === 'player2'
    };

    const isLoser = (playerIndex) => {
        if (game?.state !== "ended") return false
        if (isTie()) return false
        return !isWinner(playerIndex)
    };

    const result = () => {
        if (!game?.state === "ended") return null
        return game?.outcome
    }

    const isRematch = () => {
        return ["waiting","starting"].includes(game?.state) && game?.opponent?.user && game?.creator?.user
    }

    const isCreator = () => {
        return user?.wallet_address === game?.creator?.user?.wallet_address
    }

    const isOpponent = () => {
        return user?.wallet_address === game?.opponent?.user?.wallet_address
    }

    const canJoin = () => {
        if (!user || !game || !game?.state) return false
        if (isCreator()) return game?.creator?.bet === null
        if (isOpponent()) return game?.opponent?.bet === null
        return true
    }

    function statusColor(v) {
        if (v === 'ended') return 'bg-red'
        if (v === 'ending') return 'bg-gold'
        if (v === 'waiting') return 'bg-green'
        if (v === 'starting') return 'bg-blue'
        if (v === 'rematch') return 'bg-green'
        return ''
    }

    return (
        <div className="flex flex-col w-full bg-dark mx-auto max-w-[1300px]">
        <Head>
            <title>Play Rock Paper Scissors {token ? `using ${token?.name}` : ''}- Gambly</title>
        </Head>
            <header className="bg-darker p-4">
                <div className="w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Link href={`/casinos/${network?.name}/${token?.address}/rockpaperscissors`} className="flex h-10 items-center text-white shadow border border-bordergray bg-gray hover:bg-secondary hover:opacity-100 hover:text-dark opacity-60 transition-all px-3 py-2 rounded-md text-sm">
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                
                                    <div className="flex items-center">
                                        <img
                                            src={token?.logo}
                                            alt={`${token?.symbol} logo`}
                                            className="w-4 h-4 mr-1"
                                        />
                                        <span className="text-xs font-semibold">{token?.symbol}</span>
                                    </div>
      
                            </Link>
                            <div className="flex items-center text-white shadow border h-10 border-bordergray bg-gray opacity-60 px-3 py-2 rounded-md text-sm">
               
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-semibold">Stake: {formatUnits(game?.amount, token?.decimals)}</span>
                                        <img
                                            src={token?.logo}
                                            alt={`${token?.symbol}} logo`}
                                            className="w-4 h-4"
                                        />
                                    </div>
                
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* <div className="flex items-center text-white shadow border h-10 border-bordergray bg-gray opacity-60 px-3 py-2 rounded-md text-sm">
                                <span className="text-xs">{game?.id.slice(0, 8)}...</span>
                            </div> */}
                            <CopyLinkButton link={roomLink()} className="rounded-md active:bg-green/50" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-grow h-full px-4 pb-4 relative">
                <div className="bg-darker relative h-full border border-bordergray rounded-xl p-6 mb-8 shadow-lg flex flex-col md:flex-row">
                    <div className={`z-10 ${game?.state == 'waiting' ? 'animate-pulse' : ''} absolute left-[10px] top-[10px] md:top-[30px] table md:left-0 md:right-0 md:mx-auto uppercase font-bold text-xs py-1 px-3 rounded-3xl text-white ${statusColor(game?.state)}`}>{game?.ended ? 'Ended' : isRematch() ? 'Rematch' : game?.state}</div>
                    
                    {/* Player 1 */}
                    { animDone && isWinner(0) && <ConfettiExplosion /> }
                    <div className={`flex-1 justify-between mt-6 md:mt-0 flex flex-col items-center ${isWinner(0) ? 'bg-green-900 bg-opacity-20 rounded-xl' : ''}`}>
                        <h2 className={`text-xl mb-4 font-semibold ${animDone && isLoser(0) ? 'text-red' : ''} ${animDone && isWinner(0) ? 'text-green' : ''}`}>Player 1 {animDone && isWinner(0) && <span className="text-green-400">(Winner)</span>}</h2>
                        {/* <img
                            className={`rounded-full w-32 h-32 mb-4 ${isWinner(0) ? 'border-4 border-green' : ''}`}
                            src={game?.creator ? `https://i.pravatar.cc/128?img=${game?.creator.user.id}` : "/placeholder.png"}
                            alt="Player 1"
                        /> */}

                        {game?.creator ? (
                            <AvatarDarkBg customClass={`border border-bordergray rounded-full p-4  ${animDone && isLoser(0) ? 'border-red' : ''} ${animDone && isWinner(0) ? 'border-green' : ''}`} size={60} playername={game?.creator?.wallet_address || game?.creator?.user?.wallet_address} />
                        ) : (
                            <div className="w-24 h-24 border border-bordergray bg-dark rounded-full flex items-center justify-center">
                                <span className="text-7xl">?</span>
                            </div>
                        )}
                        {
                            user && game?.creator?.user?.wallet_address == user?.wallet_address ?
                            <p className="mt-2 font-medium text-sm mb-2 text-center text-primary">You</p>
                            :
                            <p className="mt-2 font-medium text-sm mb-2 text-center truncate max-w-[200px]">
                            {game?.creator?.user?.wallet_address || game?.creator?.wallet_address}
                            </p>
                        }
          
                        {
                            game?.creator?.bet &&
                            <motion.div
                                animate={{ opacity: 1 }}
                                initial={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <RPSHead side={game?.creator?.bet} player={1} title={game?.creator?.bet} className="w-16 h-16 mb-4" />
                            </motion.div>
                        }

                        { isWinner(0) && 
                            <div className="flex gap-1 items-center pt-1">

                            <Iconify icon="fa6-solid:trophy" className="text-gold animate-pulse"/>
                            <span className="text-green font-bold animate-pulse">+{`${game?.reward ? formatUnits(game?.reward, token?.decimals) : ""} ${token?.symbol}`}</span>
                            </div>
                        }

                        { (game?.state !== "ended" || isLoser(0)) &&
                            <div className="flex gap-1 items-center pt-1">
                                <Iconify icon="majesticons:coins" className={`${isLoser(0) ? 'text-red' : 'text-green'}`} />
                                <span className={`${isLoser(0) ? 'text-red' : ''}`}>-{`${formatUnits(game?.amount, token?.decimals)} ${token?.symbol}`}</span>
                            </div>
                        }
                    </div>

                    {/* Vertical Divider and VS or Join Game */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center my-4 md:my-0 md:mx-6">
                        <div className="hidden md:block w-px bg-bordergray h-full"></div>
                        { (game?.state == "ending" || game?.state == "ended") && <RpsResult game={game} setAnimDone={setAnimDone} className="md:absolute" /> }
                        <div className="md:absolute bg-darker px-4">
                            {game?.state == 'ended' ? (
                                animDone && isTie() ? (
                                    <div className="text-4xl font-bold">TIE</div>
                                ) : (
                                    <div className="text-4xl font-bold">VS</div>
                                )
                            ) : (
                                canJoin() && (
                                    <div className="flex flex-col items-center">
                                        <Button
                                            size="lg"
                                            variant="primary"
                                            className="mb-4"
                                            onClick={joinGame}
                                        >
                                            Join Game
                                        </Button>
                                        {/* <p className="text-sm text-gray-400">You'll bet on {game?.creator.bet === 'heads' ? 'tails' : 'heads'}</p> */}
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Player 2 */}
                    <div className={`flex-1 justify-between mt-6 md:mt-0 flex flex-col items-center ${isWinner(1) ? 'bg-green-900 bg-opacity-20 rounded-xl' : ''}`}>
                        { animDone && isWinner(1) && <ConfettiExplosion /> }
                        <h2 className={`text-xl mb-4 font-semibold ${isLoser(1) ? 'text-red' : ''} ${animDone && isWinner(1) ? 'text-green' : ''}`}>Player 2 {animDone && isWinner(1) && <span className="text-green-400">(Winner)</span>}</h2>
                        {game?.opponent ? (
                            <AvatarDarkBg customClass={`border border-bordergray rounded-full p-4 ${animDone && isLoser(1) ? 'border-red' : ''} ${animDone && isWinner(1) ? 'border-green' : ''}`} size={60} playername={game?.opponent?.wallet_address || game?.opponent?.user?.wallet_address} />
                        ) : (
                            <div className="w-[88px] h-[88px] border border-bordergray bg-dark rounded-full flex items-center justify-center">
                                <span className="text-7xl">?</span>
                            </div>
                        )}

                        {
                            user && game?.opponent?.user?.wallet_address == user?.wallet_address ?
                            <p className="mt-2 font-medium text-sm mb-2 text-center text-primary">You</p>
                            :
                            <p className="mt-2 font-medium text-sm mb-2 text-center truncate max-w-[200px]">
                            {game?.opponent ? game?.opponent?.user?.wallet_address || game?.opponent?.wallet_address : "Waiting for player..."}
                            </p>
                        }
                        {
                            game?.opponent?.bet &&
                            <motion.div
                                animate={{ opacity: 1 }}
                                initial={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <RPSHead side={game?.opponent?.bet} player={2} title={game?.opponent?.bet} className="w-16 h-16 mb-4" />
                            </motion.div>
                        }

                        { isWinner(1) && 
                            <div className="flex gap-1 items-center pt-1">

                            <Iconify icon="fa6-solid:trophy" className="text-gold animate-pulse"/>
                            <span className="text-green font-bold animate-pulse">+{`${game?.reward ? formatUnits(game?.reward, token?.decimals) : ""} ${token?.symbol}`}</span>
                            </div>
                        }

                        { (game?.state !== "ended" || isLoser(1)) &&
                            <div className="flex gap-1 items-center pt-1">
                                <Iconify icon="majesticons:coins" className={`${isLoser(1) ? 'text-red' : 'text-green'}`} />
                                <span className={`${isLoser(1) ? 'text-red' : ''}`}>-{`${formatUnits(game?.amount, token?.decimals)} ${token?.symbol}`}</span>
                            </div>
                        }
                    </div>
                </div>

                {/* Coinflip Modal */}
                {/* {currentGameRef.current.state === "ending" || currentGameRef.current.state === "ended" && (
                    // <RockPaperScissorsAnimation />
                    <GameResult game={currentGameRef.current} showModal={showResultModal} setShowModal={setShowResultModal} />
                )} */}
            </div>


            {/* Join Game Modal */}
            <JoinGameModal
                showModal={showJoinModal}
                setShowModal={setShowJoinModal}
                game={game}
                onJoin={() => {}}
                token={token}
                socket={sock.current}
            />
        </div>
    );
}

export default CoinFlipRoom;