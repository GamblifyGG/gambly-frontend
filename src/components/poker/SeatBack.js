import { useEffect, useContext } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Avatar from "../Avatar";
import { Iconify } from "@/components/common"

const SeatBackground = ({ setPlayerCountdownRem, canJoin, isPlayer, amIWinner, playerCountdown, currentPlayer, playername, setSitWindow, seat, playerSat, folded }) => {

    const sitFunction = () => {
        if (!canJoin || isPlayer) return
        if (playerSat === false) {
            setSitWindow(seat);
        }
    }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            


    useEffect(() => {
        if (amIWinner) {
            console.log('amIWinner', amIWinner);
        }
    }, [amIWinner])




    return (
        <div className="z-[100] absolute flex items-center justify-center w-full ">
            {/* <span className="absolute z-10 text-white/50 font-normal bottom-[-26px] text-xs">Player {seat + 1}</span> */}

            {amIWinner === true &&
                <div className='flex winner-bg rounded-full w-[65px] h-[65px] absolute animate-pulse  text-white items-center botton-0 justify-center z-20 lg:h-[80px] lg:w-[80px]'>.</div>
            }
            <div onClick={() => sitFunction() } className={`hover:opacity-75 ${canJoin ? 'cursor-pointer' : 'cursor-not-allowed'} bg-darkgray  transition-all rounded-full w-[65px] h-[65px] lg:h-[80px] lg:w-[80px]  border-3 border-bordergray`}>
                <div className='flex items-center justify-center h-full w-full relative'>
                    {!playerSat ?
                        <div className='text-whitegrey text-center'>
                            <Iconify icon="icon-park-solid:avatar" className="text-lg lg:text-5xl" />
                        </div>
                        :
                        folded === true &&
                        <div className='text-whitegrey text-center'>
                            Folded <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                        </div>
                    }
                    {/* { canJoin && <span className="absolute bg-dark font-semibold text-xs py-[2px] leading-none bottom-[-3px] px-3 rounded-xl text-nowrap capitalize">sit here</span>} */}
                </div>
            </div>

            {playerSat &&
                <>
                    <div className="absolute z-[999999999] lg:flex hidden">
                        <Avatar playername={playername} size="60" />
                    </div>
                    <div className="absolute z-[999999999] lg:hidden flex">
                        <Avatar playername={playername} size="30" />
                    </div>
                </>
            }

            {playerSat && String(currentPlayer).toLowerCase() === String(playername).toLowerCase() && playerCountdown > 0 &&
                <>
                    <div className="absolute z-[9999999999] opacity-75 lg:flex hidden">
                        <CountdownCircleTimer
                            strokeWidth={2}
                            trailColor="#20212d"
                            size={80}
                            isPlaying
                            strokeLinecap="butt"
                            duration={playerCountdown}
                            colors={['#FFA843', '#FFA843', '#CC3E3E', '#CC3E3E']}
                            colorsTime={[7, 5, 2, 0]}
                            onUpdate={(remainingTime) => setPlayerCountdownRem(remainingTime) }
                        >
                            {/* {({ remainingTime }) => remainingTime} */}
                        </CountdownCircleTimer>
                    </div>
                    <div className="absolute z-[9999999999] opacity-75 lg:hidden flexƒ">
                        <CountdownCircleTimer
                            strokeWidth={2}
                            trailColor="#20212d"
                            size={65}
                            isPlaying
                            // strokeLinecap="butt"
                            duration={playerCountdown}
                            colors={['#FFA843', '#FFA843', '#CC3E3E', '#CC3E3E']}
                            colorsTime={[7, 5, 2, 0]}
                        >
                            {/* {({ remainingTime }) => remainingTime} */}
                        </CountdownCircleTimer>
                    </div>
                </>
            }
        </div >
    );
}

export default SeatBackground;