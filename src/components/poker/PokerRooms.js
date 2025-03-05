import { Money, AvatarStack, Icon } from '@/components/common'
import { Button } from '@/components/form'
import { convertNetworkID } from '@/utils/convertNetworkID'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { formatUnits } from 'viem'
import { AnimatePresence } from 'framer-motion';


const Table = ({ rooms, showModal, setShowModal }) => {


  const router = useRouter()


  const pics = [
    'https://i.pravatar.cc/40?img=29',
    'https://i.pravatar.cc/40?img=2',
    'https://i.pravatar.cc/40?img=20',
    'https://i.pravatar.cc/40?img=11',
  ]

  return (
    <div className="lg:h-[calc(100%-100px)] h-[calc(100%-70px)] relative z-50 bg-dark">


      <div className="data-table-wrap h-full">
        <div className="data-table h-full relative">
          <div className='grid lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr_1fr_1fr] border-b h-16 border-b-gray'>
            <div className=' h-full flex items-center justify-center lg:px-2 text-xs lg:text-base'>Table ID</div>
            <div className=' h-full flex items-center justify-center text-xs lg:text-base'>Status</div>
            <div className=' h-full items-center justify-center flex text-xs lg:text-base text-center'>Current Players</div>
            {/* <div className=' h-full items-center justify-center lg:flex hidden'>Privacy</div> */}
            <div className=' h-full flex items-center justify-center text-xs lg:text-base'>Buy In</div>
            {/* <div className=' h-full flex items-center justify-center text-xs lg:text-base'>Max Players</div> */}
            <div className=' h-full flex items-center justify-center text-xs lg:text-base'>SB/BB</div>
          </div>
          <div className='absolute w-[calc(100%-2px)] h-[calc(100%)] lg:h-[calc(100%)] overflow-y-auto '>
            {rooms.length === 0 &&
              <div className='flex items-center justify-center h-full'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>No Poker Rooms Found</div>
                  <div onClick={() => {
                    setShowModal(true)
                  }} className='text-dark border-full bg-secondary rounded-full hover:opacity-70 cursor-pointer'>Create a room to get started</div>
                </div>
              </div>
            }
            {
              rooms.map(x => (
                <div key={x.ID} className='w-full items-center h-16 lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr_1fr_1fr] grid odd:bg-dark-700 even:bg-gray border-b border-gray'>
                  <div className='truncate ... px-2 justify-center text-center lg:px-2 text-xs lg:text-base'>#{x.TableID}</div>
                  <div className='items-center flex justify-center'>
                    <div onClick={() => {
                      router.push('/casinos/' + convertNetworkID(x.NetworkID) + '/' + x.TokenAddress + '/poker/' + x.TableID)
                    }} className='bg-primary !text-xs !h-8 text-gray lg:text-base rounded-full hover:opacity-75 cursor-pointer select-none transition-all px-4 items-center justify-center text-center flex'>
                      Join Now
                    </div>
                  </div>
                  <div className='flex'>
                    <div className="gap-2 items-center justify-center flex w-full">
                      <span>{x.CurrentPlayers}/{x.MaxPlayers}</span>
                    </div>
                  </div>
                  <div className='flex justify-center text-xs lg:text-base truncate ...'><Money /></div>
                  <div className='justify-center flex text-xs lg:text-base truncate ...'>{formatUnits(x.SmallBlinds, x.Decimals)}/{formatUnits(x.BigBlinds, x.Decimals)}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table