import { Money, AvatarStack, Icon } from '@/components/common'
import { Button } from '@/components/form'
import { convertNetworkID } from '@/utils/convertNetworkID'
import convertNetworkToImage from "@/utils/convertNetworkToImage";
import Link from 'next/link'
import { useRouter } from 'next/router'
import { formatUnits } from 'viem'
import Avatar from "@/components/Avatar"
import { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { BaseContext } from '@/context/BaseContext'

const Table = ({ rooms, setShowModal }) => {
  const router = useRouter()
  const { user } = useContext(BaseContext)

  return (
    <>
    {rooms.length === 0 &&
      <div className="p-20 text-center">
        <div className="opacity-50 mb-4">No poker rooms open at the moment.</div>
        <Button 
          variant="secondary-outline" 
          onClick={() => user ? setShowModal(true) : null}
          disabled={!user}
          className={!user ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {user ? 'Create A Poker Room' : 'Connect Wallet to Create Room'}
        </Button>
      </div>
    }
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-50">
      {
         rooms.map((x,i) => 
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.1 * (i),
              type: "spring",
              stiffness: 260,
              damping: 20, 
            }}
            className="border border-bordergray rounded-2xl p-5 bg-dark-600 hover:bg-dark-460 "
          >
              <div className="flex mb-2 gap-2 items-center">
                <img src="/pkr.png" className="h-[60px] w-auto" alt=""/>

                <div className="uppercase">
                  <div className="mb-[2px] text-xs font-bold">Texas Holdem</div>
                  <div className={`${x.ended ? 'text-red': 'opacity-50'} text-[10px]`}>{ x.ended ? "Ended" : x.started ? "Started" : "Open"}</div>
                </div>


                <div className="uppercase text-xs ml-auto flex items-center gap-1 mt-[15px]">
                  <div>{x.players}/{x.max_players}</div>
                  <span className='text-primary text-lg'><iconify-icon icon="mage:users-fill"></iconify-icon></span>
                </div>
              </div>


            <div className="flex items-center gap-2 mb-2">
              <div className="uppercase text-xs">
                {/* <div className="opacity-50 mb-1 text-[11px]">buy in</div> */}
                <div className="text-xs flex gap-1 items-center">
                  <span className="text-primary text-lg mt-[3px]"><iconify-icon icon="ep:coin"></iconify-icon></span>
                  <span className="text-green">{ formatUnits(x.buy_in_min, x?.token?.decimals) }</span>
                  <span>{x?.token?.symbol}</span></div>
              </div>
              
              <img className="ml-auto w-6 h-6 object-contain" src={convertNetworkToImage(x?.token?.network?.name)} alt="network" />
            </div>

            <div onClick={() => {
              router.push('/casinos/' + convertNetworkID(x?.token?.network?.id) + '/' + x?.token?.address + '/poker/' + x.id)
            }} className='bg-primary font-bold !text-xs !h-8 text-gray lg:text-base rounded-full hover:opacity-75 cursor-pointer select-none transition-all px-4 items-center justify-center text-center flex'>
              Join Now
            </div>
          </motion.div>
        )
      }
    </div>
    </>
  )
}

export default Table