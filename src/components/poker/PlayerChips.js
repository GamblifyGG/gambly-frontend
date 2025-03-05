import { formatUnits } from "viem";
import { Iconify } from "@/components/common"

const PlayerChips = ({ user, isMe, playerChips, tokenDecimals, tokenSymbol, logo, bigBlind, smallBlind }) => {
    return (
        <div className="-bottom-10 group lg:-bottom-12 flex items-center gap-1 leading-none bg-secondary rounded-full px-3 py-1 text-dark absolute z-[9999999999999999]">
            <Iconify icon="majesticons:coins" />
            <span className='text-[7px] lg:text-[10px] text-center font-extrabold'>{formatUnits(playerChips, tokenDecimals)}</span>
            {/* <small className="text-[10px]">{tokenSymbol}</small> */}

            {smallBlind && 
            <div className="absolute bottom-[100%] left-[50%] -translate-x-[50%] translate-y-[-2px] text-[7px] font-bold lg:text-[10px] flex items-center gap-1 leading-none bg-[#06b6d4] rounded-full p-[2px] text-dark">
                <small className="bg-white rounded-full flex items-center justify-center h-[12px] w-[12px]">S</small>
                <span className="pr-1">{formatUnits(smallBlind, tokenDecimals)}</span>
            </div>
            }
            {bigBlind && 
            <div className="absolute bottom-[100%] left-[50%] -translate-x-[50%] translate-y-[-2px] text-[7px] font-bold lg:text-[10px] flex items-center gap-1 leading-none bg-[#06b6d4] rounded-full p-[2px] text-dark">
                <small className="bg-white rounded-full flex items-center justify-center h-[12px] w-[12px]">B</small>
                <span className="pr-1">{formatUnits(bigBlind, tokenDecimals)}</span>
            </div>
            }

            <span className="bg-white/10 hidden group-hover:inline-flex rounded-full p-1 text-xs text-white absolute top-[100%] left-[50%] -translate-x-[50%] translate-y-[5px]">{ isMe? 'You!' : user?.ens_name || user?.wallet_address}</span>
        </div>);
}

export default PlayerChips;