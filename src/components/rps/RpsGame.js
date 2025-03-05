import { motion } from 'framer-motion'
import Link from 'next/link'
import { convertNetworkID } from '../../utils/convertNetworkID'
import FlippingCoin from './FlippingCoin'
import { CoinflipContext } from "@/context/CoinflipContext"
import { useContext, useState } from 'react'
import {Units} from '../common/Money'
import PlayerInfo from '../common/'
import AvatarDarkBg from '../AvatarDarkBg';
import RockPaperScissorsAnimation from './RockPaperScissorAnimation';
const RpsGame = ({ x, user }) => {
    const [isWinnerAnimationComplete, setIsWinnerAnimationComplete] = useState(false);
    const didJoin = user && [x.creator?.wallet_address, x.opponent?.wallet_address].includes(user?.wallet_address)

    // Helper component for player info
    const PlayerInfo = ({ player, walletAddress, outcome }) => (
        <div className="flex flex-col items-center w-20">
            {player ? (
                <>
                    <AvatarDarkBg playername={player?.wallet_address} />
                    <div className="text-center w-full">
                        {player.wallet_address === walletAddress ? (
                            <span className="text-green text-xs mt-1">You</span>
                        ) : (
                            <span className="text-xs mt-1 truncate">{player?.wallet_address.slice(0, 6)}...</span>
                        )}
                    </div>
                    {/* <span className="text-xs mt-1 text-center">{player.bet}</span> */}
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

    return (
        // <AnimatedComp key={x.id}>
        <Link key={x.id} title={x.id} href={`/casinos/${x?.casino?.token?.network?.name.toLowerCase()}/${x.casino?.token?.address}/rockpaperscissors/${x.id}`}>
            <div className="border shadow-xl relative border-bordergray rounded-lg p-4 hover:bg-opacity-10 hover:bg-darkgray transition-all">
                <div className='absolute left-0 top-0 rounded-md w-full h-full flex justify-center items-center'>
                    <div className={`w-full h-full flex items-center justify-center rounded-md p-2`}>
                        {/* <FlippingCoin isFlipping={['starting', 'ending'].includes(x.state)} /> */}
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2 border-b border-bordergray pb-2">
                    <div className='border bg-green/10 border-green/50 rounded-md text-xs py-1 px-2 gap-1 flex'>
                        <Units value={x.amount} decimals={x?.casino?.token.decimals} name="" className="mt-2" /> {x?.casino?.token?.symbol}
                    </div>
                    <span className={`${x?.ended ? 'bg-red text-white' : 'bg-primary text-dark border border-bordergray'} text-xs py-1 px-2 font-semibold rounded-md flex gap-2`}>{ (didJoin && !x?.ended) ? 'You joined' : x?.ended ? 'Ended' : 'Join' }</span>
                    {/* <div className="text-xs p-1 bg-darkgray border border-bordergray rounded-md flex gap-2">ID: {x.id.slice(0, 3)}...</div> */}
                </div>
                <div className="flex justify-between items-center">
                    <PlayerInfo player={x.creator} walletAddress={user?.wallet_address} outcome={x.outcome} />

                    {/* Coin and Game Info */}
                    <div className="flex flex-col items-center">
                        {/* {x.state} */}
                        {['ending', 'ended'].includes(x.state) && <RockPaperScissorsAnimation state={x.state} player1Bet={x.players[0].bet} player2Bet={x.players[1].bet} mainClass='absolute gap-2 top-6 left-0 w-full h-full' isWinnerAnimationComplete={isWinnerAnimationComplete} setIsWinnerAnimationComplete={setIsWinnerAnimationComplete} imageClasses={`w-20 h-20 bg-dark p-4 border border-bordergray rounded-full`} />}
                        {['starting'].includes(x.state) && <img src='/placeholder.png' alt="" className='w-20 h-20 border border-bordergray rounded-full' />}
                        {['waiting'].includes(x.state) && <img src='/placeholder.png' alt="" className='w-20 h-20 border border-bordergray rounded-full' />}
                    </div>

                    {/* Player Two */}
                    <PlayerInfo player={x.opponent} walletAddress={user?.wallet_address} outcome={x.outcome} />
                </div>
            </div>
        </Link>
        // </AnimatedComp>
    );
}

export default RpsGame;