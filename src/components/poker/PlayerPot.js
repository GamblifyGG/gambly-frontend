import { motion, useAnimation } from 'framer-motion';
import { formatUnits } from 'viem';
import { Iconify } from "@/components/common"

const PlayerPot = ({ moveToTarget, thisPotRef, playername, thisSeatsPot, tokenDecimals, tokenLogo, player }) => {




    
    return (
        <>
            {playername !== undefined && playername !== null && playername !== '' && thisSeatsPot !== null && thisSeatsPot > 0 &&
                <div
                    className='flex items-center justify-center px-1 rounded-md w-full h-full absolute'
                >
                    <motion.div onClick={() => {
                        moveToTarget(player);
                    }} ref={thisPotRef} className={`absolute -top-8 lg:-top-12 text-dark font-extrabold border-bordergray  items-center flex flex-col gap-1 z-[99999999999] justify-center w-auto rounded-md`}>
                        <div className='flex flex-row items-center justify-center gap-1 bg-primary rounded-full px-1'>
                            <Iconify icon="majesticons:coins" />
                            <div className='text-[7px] lg:text-[10px] font-extrabold text-center'>{formatUnits(thisSeatsPot, tokenDecimals)}</div>
                            {/* <img alt="" src={tokenLogo} className="h-auto rounded-full border border-lightgray w-3"></img> */}
                        </div>
                    </motion.div>
                </div>
            }
        </>
    );
}

export default PlayerPot;