import { useEffect, useState, useContext } from "react";
import { Circle, Modal } from "../common";
import { Units } from '@/components/common/Money'
import { Button, Tbox } from "../form";
import axios from "axios";
import authTokens from "@/utils/authTokens"
import CoinHead from './CoinHead'

const JoinGameModal = ({ showModal, setShowModal, game, token, socket }) => {
    const [busy, setBusy] = useState(false);

    const privacyOpts = [
      { text: 'Private Game', value: 'private' },
      { text: 'Public', value: 'public' },
    ]

    const betOpts = [
      { text: 'Heads', value: 'heads' },
      { text: 'Tails', value: 'tails' },
    ]

    const [success, setSuccess] = useState(false)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState(null)
    const [bet, setBet] = useState('heads')
    const [password, setPassword] = useState(null)

    useEffect(() => {
      setBusy(false)
      setSuccess(false)
      setError('')
      setMsg('')
      setPassword('')

      if (game) {
        const userBet = game.bet === 'heads' ? 'tails' : 'heads'
        setBet(userBet)
      }
    }, [showModal, game])

    const join = () => {
        setBusy(true)
        setSuccess(false)
        setError(null)

        if (!socket) {
            console.error("Socket not initialized");
            return;
        } else {
            console.log("Socket initialized");
        }

        const args = password ? { bet, password } : { bet }

        console.log('coinflip:enter', args)

        socket.emit('coinflip:enter', args, (err, res) => {
            setBusy(false)

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
                <span>Join Coinflip</span>
            </>}
          > 
            { success && <div className="p-4 border text-xs mb-3 rounded-md border-green text-green">{msg}</div> }
            { error && <div className="p-4 border text-xs mb-3 rounded-md border-red text-red">{error}</div> }
            <div className="p-4 mb-5 border rounded-xl border-green bg-green bg-opacity-10">
              <div className="flex gap-2 items-center">
                <div>
                  <div className="text-sm">Stake ({token?.symbol})</div>
                  <div className="text-weight bold text-white text-lg"><Units value={game.amount} decimals={token?.decimals} /></div>
                </div>
                <div className="ml-auto flex flex-col items-center">
                  <CoinHead side={bet} />
                  <span className="uppercase text-xs mt-1 text-white">{bet}</span>
                </div>
              </div>
            </div>
            { game.private && <Tbox label="Game Password" type="password" value={password} onChange={setPassword}/> }
            <Button variant="secondary" className="w-full" busy={busy} onClick={join}>Place Your Bet</Button>
            <div className="text-center py-4 text-sm">{game.id}</div>
          </Modal >
        }
      </>
    );
}

export default JoinGameModal;