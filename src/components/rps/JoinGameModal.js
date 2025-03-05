import { useEffect, useState, useContext } from "react";
import { Circle, Modal } from "../common";
import { AnimButton, Tbox } from "../form";
import axios from "axios";
import authTokens from "@/utils/authTokens"
import RpsHead from './RpsHead'
import { Units } from '@/components/common/Money'

const JoinGameModal = ({ showModal, setShowModal, game, token, socket }) => {

    const betOpts = [
      { text: 'Rock', value: 'rock' },
      { text: 'Paper', value: 'paper' },
      { text: 'Scissors', value: 'scissors' },
    ]

    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [success, setSuccess] = useState(false)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState(null)
    const [bet, setBet] = useState('rock')
    const [password, setPassword] = useState('')

    useEffect(() => {
      setSending(false)
      setSent(false)
      setSuccess(false)
      setError('')
      setMsg('')
      setPassword('')
    }, [showModal])

    const join = () => {
      setSending(true)
      setSuccess(false)
      setError(null)

      if (!socket) {
          console.error("Socket not initialized");
          return;
      } else {
          console.log("Socket initialized");
      }

      const args = password ? { bet, password } : { bet }

      console.log('rps:enter', args)

      socket.emit('rps:enter', args, (err, res) => {
          setSending(false)

          if (err) {
              console.error('[JOIN:ERROR]', err)
              setError(err?.error || 'Error while joining!')
          } else {
            setSuccess(true)
            setShowModal(false)
          }
      });
  };

    return (
      <>
        { game &&
          <Modal
            size="sm"
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            header={<>
                <Circle icon="coinflip" variant="secondary" />
                <span>Join RPS</span>
            </>}
          > 
            { error && <div className="p-4 border text-xs mb-3 rounded-md border-red text-red">{error}</div> }
            
            <div className="text-center mb-3">
              <div className="text-sm">Stake ({token?.symbol})</div>
              <div className="text-weight bold text-white text-lg"><Units value={game.amount} decimals={token?.decimals} /></div>
            </div>
            
            <div className="flex justify-center gap-4 mb-4">
              <div onClick={() => setBet('rock')} className={`${bet == 'rock' ? 'border-green border' : ''} text-center rounded-md bg-white bg-opacity-10 cursor-pointer hover:bg-opacity-20 py-3 px-4`}>
                <RpsHead side="rock" size="xl"/>
                <span className="uppercase text-xs">rock</span>
              </div>

              <div onClick={() => setBet('paper')} className={`${bet == 'paper' ? 'border-green border' : ''} text-center rounded-md bg-white bg-opacity-10 cursor-pointer hover:bg-opacity-20 py-3 px-4`}>
                <RpsHead side="paper" size="xl"/>
                <span className="uppercase text-xs">paper</span>
              </div>

              <div onClick={() => setBet('scissors')} className={`${bet == 'scissors' ? 'border-green border' : ''} text-center rounded-md bg-white bg-opacity-10 cursor-pointer hover:bg-opacity-20 py-3 px-4`}>
                <RpsHead side="scissors" size="xl"/>
                <span className="uppercase text-xs">scissors</span>
              </div>
            </div>
            { game.private && <Tbox label="Game Password" type="password" value={password} onChange={setPassword}/> }
            
            <AnimButton text="Place Your Bet" className="w-full" start={sending} done={sent} success={success} error={error} onClick={join} /> 
            <div className="text-center py-4 text-sm">{game.id}</div>
          </Modal >
        }
      </>
    );
}

export default JoinGameModal;