import AvatarDarkBg from "../AvatarDarkBg"
import { Circle, Modal } from "../common"
import RockPaperScissorsAnimation from "./RockPaperScissorAnimation"
import RpsHead from "./RpsHead"
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'


const GameResult = ({ game, showModal, setShowModal }) => {
  const [isWinnerAnimationComplete, setIsWinnerAnimationComplete] = useState(false);
  if (!game) return (<></>)

  return (
    <Modal
      size="sm"
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      header={<>
        <Circle icon="coinflip" variant="secondary" />
        <span>Rock Paper Scissors Ended!</span>
      </>}
    >
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{
          duration: 0.3,
        }}
        className="overflow-hidden relative"
      >
        {!isWinnerAnimationComplete && (
          <RockPaperScissorsAnimation isWinnerAnimationComplete={isWinnerAnimationComplete} setIsWinnerAnimationComplete={setIsWinnerAnimationComplete} />
        )}

        {isWinnerAnimationComplete && (
          <>
            <div className={`p-4 border rounded-xl ${game.players[0].won ? 'border-green bg-green bg-opacity-10' : 'border-red bg-red bg-opacity-10'}`}>
              <div className="flex gap-2 items-center">
                <AvatarDarkBg playername={game.players[0].user.address} />
                <div>
                  <div>Player 1</div>
                  <div className="italic text-xs">{game.players[0].won ? 'WON' : 'LOST'}</div>
                </div>
                <div className="ml-auto flex flex-col items-center">
                  <RpsHead side={game.players[0].bet} />
                  <span className="uppercase text-xs mt-1 text-white">{game.players[0].bet}</span>
                </div>
              </div>
            </div>
            <div className="text-center opacity-50 py-4">vs</div>

            <div className={`p-4 border rounded-xl ${game.players[1].won ? 'border-green bg-green bg-opacity-10' : 'border-red bg-red bg-opacity-10'}`}>
              <div className="flex gap-2 items-center">
                <AvatarDarkBg playername={game.players[1].user.address} />
                <div>
                  <div>Player 2</div>
                  <div className="italic text-xs">{game.players[1].won ? 'WON' : 'LOST'}</div>
                </div>
                <div className="ml-auto flex flex-col items-center">
                  <RpsHead side={game.players[1].bet} />
                  <span className="uppercase text-xs mt-1 text-white">{game.players[1].bet}</span>
                </div>
              </div>
            </div>
            <div className="text-center py-6 opacity-50">{game.id}</div>
          </>
        )}
      </motion.div>
    </Modal >
  );
}

export default GameResult;