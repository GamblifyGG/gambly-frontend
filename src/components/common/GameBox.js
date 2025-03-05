import Icon from './Icon'
import AvatarStack from './AvatarStack'

const GameBox = () => {
  const pics = [
    'https://i.pravatar.cc/40?img=29',
    'https://i.pravatar.cc/40?img=2',
    'https://i.pravatar.cc/40?img=20',
    'https://i.pravatar.cc/40?img=11',
  ]
  return (
    <div className="rounded-2xl overflow-hidden grad-dark">
      <div className="grad-dark-300 flex items-center px-2 gap-2 h-14">
        {/* <Icon name="kongz2" size="2.68rem" /> */}
        <img src="/logo-letter.png" className="h-10 w-10" alt="" />
        <span className="text-white">Test Casino</span>
      </div>
      <div className="p-2 hidden lg:flex items-center gap-2">
        <AvatarStack pics={pics} />
        <div className="flex gap-1">
          <span style={{color: '#BEC2D1'}}>384</span>
          <span style={{color: '#5C6070'}}>Members</span>
        </div>
        <div className="ml-auto text-secondary">Casino Open</div>
      </div>
      <div className="p-2 flex items-center">
        <div className="flex gap-2 items-center">
          <Icon name="eth"/>
          <span style={{color: '#BEC2D1'}}>53.6 ETH</span>
          <span style={{color: '#5C6070'}}>Bet Volume</span>
        </div>

        <div className="flex gap-1 ml-auto">
          <span style={{color: '#BEC2D1'}}>12</span>
          <span style={{color: '#5C6070'}}>Games</span>
        </div>
      </div>
    </div>
  );
};

export default GameBox
