import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Avatar from "@/components/Avatar";
import { Iconify } from "@/components/common"
import { formatUnits } from "viem"

import Cards from "./Cards"

const Seat = ({ seatRef, hand, isMe, seat, user, tableIndex, token, bet, action, promptTime, card1Dealt, card2Dealt }) => {
  const state = ['folded', 'empty', 'seated']

  const actionColors = {
    check: "bg-primary",
    call: "bg-blue",
    bet: "bg-green",
    fold: "bg-red"
  }

  const actionColor = action ? actionColors[action] : ""

  return (
    <div
      ref={seatRef}
      style={{gridArea: `seat-${tableIndex}`}}
      className={`${isMe ? 'scale-125' : ''} relative flex justify-center items-center`}
    >
      <div className="z-20 rounded-full w-[65px] h-[65px] bg-dark relative flex justify-center items-center">
        <div className="absolute z-0 top-0 left-0 w-full h-full">
          { promptTime > 0 &&
          <CountdownCircleTimer
            strokeWidth={2}
            trailColor="#20212d"
            size={65}
            isPlaying
            strokeLinecap="butt"
            duration={promptTime}
            colors={['#FFA843', '#FFA843', '#CC3E3E', '#CC3E3E']}
            colorsTime={[7, 5, 2, 0]}
          />
          }
        </div>

        { user && <Avatar playername={user?.wallet_address} size="50" /> }

        { !user && <Iconify icon="icon-park-solid:avatar" className="text-lg lg:text-2xl opacity-10" />}
      </div>

      { action && 
        <div className={`${actionColor} absolute top-0 text-xs rounded-full h-5 px-2 z-30 text-white`}>{action}</div>
      }

      { bet && <div
        className="z-30 absolute bottom-0 bg-green flex items-center gap-1 text-xs text-dark h-5 rounded-full px-2"
      >
        <span className="font-bold">{formatUnits(bet?.totalChips, token?.decimals)}</span>
        <span className="text-[0.8em]">{token?.symbol}</span>
      </div> }

      { hand && <Cards user={user} hand={hand} className="absolute" card1Dealt={card1Dealt} card2Dealt={card2Dealt} /> }
    </div>
  )
}

export default Seat;