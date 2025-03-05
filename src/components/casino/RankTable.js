import { Money } from '@/components/common'
import { Button } from '@/components/form'
import Link from 'next/link'
import { useEffect } from 'react'
import Jazzicon from 'react-jazzicon'
import { formatUnits } from 'viem'
import Avatar from '../Avatar'


const Table = ({ users, token }) => {
  // const users = Array(12).fill('').map((x, i) => {
  //   return {
  //     pic: `https://i.pravatar.cc/36?img=${i + 1}`,
  //     id: Math.ceil(Math.random() * 1e25).toString(16),
  //     place: i + 1,
  //     amount: 0.6,
  //     coin: { name: 'eth', decimals: 8 }
  //   }
  // })

  useEffect(() => {
    console.log('users', users)
  }, [users])

  if (!users?.length) {
    return (
      <div className="w-full">
        <div className="border-bordergray border rounded-lg">
          <div className="flex flex-col w-full">
            <div className='grid w-full grid-cols-[0.5fr_0.25fr_0.25fr] p-2 border-b border-bordergray'>
              <div className="w-full">User</div>
              <div className='text-center'>Place</div>
              <div className='text-end'>Amount</div>
            </div>
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg font-medium">No rankings available yet</p>
              <p className="text-sm">Be the first to play and appear on the leaderboard!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full ">
      <div className="border-bordergray border rounded-lg">
        <div className="flex flex-col w-full">
          <div className='grid w-full grid-cols-[0.5fr_0.25fr_0.25fr] p-2 border-b border-bordergray'>
            <div className="w-full">User</div>
            <div className='text-center'>Place</div>
            <div className='text-end'>Amount</div>
          </div>
          {/* <div className='w-full'> */}
          {
            users.map((x, index) => (
              x.user?.wallet_address !== null && x?.user?.wallet_address !== '' &&
              <div key={index} className='flex  border-bordergray odd:bg-darkgray p-2'>
                <div className="flex items-center gap-2 flex-grow w-[50%]">
                  <Avatar playername={x.user?.wallet_address} size={50} />
                  <div className="truncate" style={{ flex: '0 0 160px', maxWidth: '160px' }}>
                    <span className='text-xs'>{x.user?.wallet_address}</span>
                  </div>
                </div>
                <div className='w-[25%] flex items-center justify-center text-xs'>{index + 1}</div>
                <div className='w-[25%] flex items-center justify-end'>
                  <span className='truncate ... text-xs'>
                    {formatUnits(x.amount, token?.decimals).length > 10 ? formatUnits(x.amount, token?.decimals).slice(0, 10) + ' ' + token?.symbol : formatUnits(x.amount, token?.decimals) + " " + token?.symbol}
                    {/* {formatUnits(x.total, casino.TokenDecimals)} {casino.TokenSymbol} */}
                  </span>
                </div>
              </div>

            ))
          }
          {/* </div> */}
        </div>
      </div>

      {/* <div className="flex items-center gap-5">
        <Button variant="clear"><iconify-icon icon="bx:caret-left"></iconify-icon>previous</Button>
        <Button variant="clear" disabled>next<iconify-icon icon="bx:caret-right"></iconify-icon></Button>
      </div> */}
    </div>
  )
}
export default Table