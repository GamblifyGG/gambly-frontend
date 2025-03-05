import Icon from './Icon'
import AvatarStack from './AvatarStack'

const GameList = () => {
  const pics = [
    'https://i.pravatar.cc/40?img=29',
    'https://i.pravatar.cc/40?img=2',
    'https://i.pravatar.cc/40?img=20',
    'https://i.pravatar.cc/40?img=11',
  ]
  return (
    <div className="rounded-2xl overflow-hidden grad-dark">
      <div className="grad-dark-300 flex justify-between items-center px-2 gap-2 h-14">
        {/* <Icon name="kongz2" size="2.68rem" /> */}
        <img src="/logo-letter.png" className="h-10 w-10" />
        <img src='/icons/cards.svg' className="h-10 w-10" />
      </div>
      <div className="px-4 py-2 flex flex-col gap-2 ">

        <div className='grid grid-cols-2 grid-rows-2 gap-2'>
          <div className='h-10 flex-col flex gap-1 col-start-1 col-end-3'>
            <span className='text-xs text-ce'>Table Volume</span>
            <div className='border-darkgray border text-[10px] flex items-center justify-center flex-grow bg-bordergray'>
                10 WETH
            </div>
          </div>
          {/* <div className='h-10 flex-col flex gap-1'>
            <span className='text-xs'>Volume</span>
            <div className='border-darkgray text-[10px] flex items-center justify-center flex-grow bg-bordergray'>
                10 WETH
            </div>
          </div> */}
          <div className='h-10 flex-col flex gap-1'>
            <span className='text-xs text-center'>Buy In</span>
            <div className='border-darkgray border text-[10px] flex items-center justify-center flex-grow bg-bordergray'>
                10
            </div>
          </div>
          <div className='h-10 flex-col flex gap-1'>
            <span className='text-xs text-center'>Big Blind</span>
            <div className='border-darkgray border text-[10px] flex items-center justify-center flex-grow bg-bordergray'>
                10
            </div>
          </div>


          <div className='col-start-1 col-end-3 bg-secondary text-dark rounded-md items-center justify-center text-center hover:opacity-75 cursor-pointer'>
            Join
          </div>
        </div>




        {/* <div className='font-normal bg-darkgray p-2 items-center justify-center flex gap-2 rounded-md w-full'>
          <span className='underline'>Current Players</span>
          <span className='text-secondary font-extrabold'>5/9</span>
        </div>
        <div className='font-normal bg-darkgray p-2 items-center justify-center flex gap-2 rounded-md w-full'>
          <span className='underline'>Min Bets</span>
          <span className='text-secondary font-extrabold'>0.00005</span>
        </div>

        <div className='font-normal bg-darkgray p-2 items-center justify-center flex gap-2 rounded-md w-full'>
          <span className='underline'>Min Bets</span>
          <span className='text-secondary font-extrabold'>0.00005</span>
        </div>
         */}


        {/* <div className=' w-full'>
          Bet Volume: <span className='text-secondary'>53.6 ETH</span>
        </div> */}
        {/* <AvatarStack pics={pics} /> */}
        {/* <div className="flex gap-1">
          <span style={{color: '#BEC2D1'}}>5</span>
          <span style={{color: '#5C6070'}}>Players</span>
        </div> */}
        {/* <div className="ml-auto text-secondary">Poker</div> */}
      </div>
      <div className="p-2 flex items-center">
        {/* <div className="flex gap-2 items-center">
          <span style={{color: '#BEC2D1'}}>53.6 ETH</span>
          <span style={{color: '#5C6070'}}>Bet Volume</span>
        </div>

        <div className="flex gap-1 ml-auto">
          <span style={{color: '#BEC2D1'}}>12</span>
          <span style={{color: '#5C6070'}}>Games</span>
        </div> */}
      </div>
    </div>
  );
};

export default GameList
