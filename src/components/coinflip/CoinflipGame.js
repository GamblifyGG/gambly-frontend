import { motion } from 'framer-motion'
import Link from 'next/link'
// import FlippingCoin from './FlippingCoin'
import { BaseContext } from "@/context/BaseContext";
import { useContext } from 'react'
import { Units } from '../common/Money'
import CoinHead from '@/components/coinflip/CoinHead';
import AvatarDarkBg from '@/components/AvatarDarkBg';

const CoinflipGame = ({ x }) => {
    const { user } = useContext(BaseContext);
    const didJoin = user && [x.creator?.wallet_address, x.opponent?.wallet_address].includes(user?.wallet_address)

    // Helper component for player info
    const PlayerInfo = ({ bet, player, walletAddress, outcome, isOpp }) => (
        <div className="flex flex-col items-center w-20 relative">
            {player ? (
                <>
                    <AvatarDarkBg playername={player.wallet_address} size={48} customClass={`${outcome === bet ? 'ring-1 ring-green/50' : ''}`}/>
                    <div className="text-center w-full">
                        {player.wallet_address === walletAddress ? (
                            <span className="text-green text-xs mt-1">You</span>
                        ) : (
                            <span className="text-xs mt-1 truncate">{player.wallet_address.slice(0, 6)}...</span>
                        )}
                    </div>
                    {/* <span className="text-xs mt-1 text-center">{player.bet}</span> */}
                    { bet && <CoinHead side={bet} size={null} className={`text-[25px] absolute top-[50%] translate-y-[-50%] ${isOpp ? 'left-[-5px]' : 'right-[-5px]'}`} /> }
                </>
            ) : (
                <>
                    <img
                        className={`rounded-full w-12 h-12`}
                        src={'/placeholder.png'}
                        alt=""
                    />
                    <div className="text-center w-full">
                        <span className="text-xs mt-1 text-primary truncate">Waiting...</span>
                    </div>
                </>
            )}
        </div>
    );

    // Helper component for game status
    // const GameStatus = ({ state, walletAddress, playerAddress, onJoin }) => {
    //     switch (state) {
    //         case 'starting':
    //             return <Button variant="secondary" size="sm">Starting...</Button>
    //         case 'ended':
    //             return <></>
    //         // return <Button className="w-20 lg:w-auto" variant="secondary" size="sm">Ended</Button>
    //         case 'waiting':
    //             return playerAddress !== walletAddress
    //                 ? <Button size="sm" onClick={onJoin}>Join</Button>
    //                 : <Button size="sm" variant="dark">You Joined</Button>
    //         case 'ending':
    //             return <Button size="sm" variant="dark">Ending...</Button>
    //         default:
    //             return null
    //     }
    // }

    const AnimatedComp = ({ children }) => {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
        )
    }

    return (
        // <AnimatedComp key={x.id}>
        <Link key={x.id} title={x.id} href={`/casinos/${x?.casino.token.network.name.toLowerCase()}/${x?.casino.token.address}/coinflip/${x.id}`}>
            <div className="border shadow-xl relative border-bordergray rounded-lg p-4 hover:bg-opacity-10 hover:bg-gray/10 transition-all">
                <div className='absolute left-0 top-0 rounded-md w-full h-full flex justify-center items-center'>
                    <div className={`w-full h-full flex items-center justify-center rounded-md p-2`}>
                        {/* <FlippingCoin isFlipping={true} /> */}

                    </div>
                </div>
                <div className="flex justify-between items-center mb-2 border-b border-bordergray pb-2">
                    <div className='bg-green/10 border border-green/50 rounded-md text-xs p-1 px-2 gap-1 flex'>
                        <Units value={x.amount} decimals={x?.casino.token.decimals} symbol={x?.casino.token.symbol} className="mt-2" />
                    </div>
                    <span className={`${x?.ended ? 'bg-red text-white' : 'bg-primary text-dark border border-bordergray'} text-xs py-1 px-2 font-semibold rounded-md flex gap-2`}>{ (didJoin && !x?.ended) ? 'You Joined' : x?.ended ? 'Ended' : 'Join' }</span>
                    {/* <div className="text-xs p-1 bg-darkgray border border-bordergray rounded-md flex gap-2">ID: {x.id.slice(0, 3)}...</div> */}
                </div>
                <div className="flex justify-between items-center">
                    <PlayerInfo isOpp={false} bet={x?.bet} player={x.creator} walletAddress={user?.wallet_address} outcome={x.outcome} />

                    {/* Coin and Game Info */}
                    <div className="flex flex-col items-center">
                        { x?.outcome && 
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CoinHead side={x?.outcome} size={null} className="text-[50px]" />
                            </motion.div>
                        }
                        { !x?.outcome && <img alt="" src='/placeholder.png' className='w-20 h-20 border border-bordergray rounded-full' /> }
                    </div>

                    {/* Player Two */}
                    <PlayerInfo isOpp={true} bet={x?.bet ? x?.bet == 'heads'? 'tails' : 'heads' : null} player={x.opponent} walletAddress={user?.wallet_address} outcome={x.outcome} />
                </div>
            </div>
        </Link>
        // </AnimatedComp>
    );
}

export default CoinflipGame;