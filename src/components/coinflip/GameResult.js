import { useEffect } from "react"
import { Circle, Modal } from "../common"
import CoinHead from "./CoinHead"
import CoinResult from './CoinResult'
import { motion } from 'framer-motion'

const CreateGameModal = ({ game, showModal, setShowModal }) => {
  const winSide = game.players[0].won ? game.players[0].bet : game.players[1].bet

  useEffect(() => {
    if (game.state === "ended" || game.state === "ending") {
      setShowModal(true)
    }
  }, [game.state, setShowModal])

  if (!game) return (<></>)
    
  return (
    <Modal
      size="sm"
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      header={<>
        <Circle icon="coinflip" variant="secondary" />
        <span className="capitalize">{winSide} Won!</span>
      </>}
    >
      <div className="p-4">
        <CoinResult value={winSide} />
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{
          duration: 0.3,
          delay: 1
        }}
        className="overflow-hidden"
      >
        <div className={`p-4 border rounded-xl ${game.players[0].won ? 'border-green bg-green bg-opacity-10' : 'border-red bg-red bg-opacity-10'}`}>
          <div className="flex gap-2 items-center">
            <img className="rounded-full" src={`https://i.pravatar.cc/36?img=${game.players[0].user.id}`} alt="" />
            <div>
              <div>Player 1</div>
              <div className="italic text-xs">{game.players[0].won ? 'WON' : 'LOST'}</div>
            </div>
            <div className="ml-auto flex flex-col items-center">
              <CoinHead side={game.players[0].bet} />
              <span className="uppercase text-xs mt-1 text-white">{game.players[0].bet}</span>
            </div>
          </div>
        </div>
        <div className="text-center opacity-50 py-4">vs</div>

        <div className={`p-4 border rounded-xl ${game.players[1].won ? 'border-green bg-green bg-opacity-10' : 'border-red bg-red bg-opacity-10'}`}>
          <div className="flex gap-2 items-center">
            <img className="rounded-full" src={`https://i.pravatar.cc/36?img=${game.players[1].user.id}`} alt="" />
            <div>
              <div>Player 2</div>
              <div className="italic text-xs">{game.players[1].won ? 'WON' : 'LOST'}</div>
            </div>
            <div className="ml-auto flex flex-col items-center">
              <CoinHead side={game.players[1].bet} />
              <span className="uppercase text-xs mt-1 text-white">{game.players[1].bet}</span>
            </div>
          </div>
        </div>
        <div className="text-center py-6 opacity-50">{game.id}</div>
      </motion.div>
    </Modal >
  );
}

export default CreateGameModal;