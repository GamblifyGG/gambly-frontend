import { useEffect, useState, useContext } from "react";
import { Icon, Modal } from "../common";
import { AnimButton, Tbox } from "../form";
import { parseUnits } from 'viem'
import { motion } from 'framer-motion'
import CoinHead from './CoinHead'
import { createCoinflipGame } from '@/api'
import { toast } from 'react-toastify'
import { getApiError } from "@/utils/api"
import InsufBalanceNotice from "@/components/InsufBalanceNotice";

const CreateGameModal = ({ showModal, setShowModal, chainId, token, onNewGame = () => {} }) => {

  const privacyOpts = [
    { text: 'Private Game', value: 'private' },
    { text: 'Public', value: 'public' },
  ]

  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState('')

  const [amount, setAmount] = useState(0)
  const [bet, setBet] = useState('heads')
  const [password, setPassword] = useState('')
  const [lowBal, setLowBal] = useState(false)

  const createGame = async () => {
    setSending(true)
    setSent(false)
    setSuccess(false)
    setError(null)

    console.log('parseUnits', amount.toString(), token?.decimals)
    const _amount = parseUnits(amount.toString(), token?.decimals).toString()

    const [er, data] = await createCoinflipGame({
      chain_id: chainId,
      token_address: token?.address,
      amount: _amount,
      bet,
      password
    })

    setSending(false)
    setSent(true)

    if (er) {
      console.error(er);
      setError(getApiError(er))
    }

    if (data) {
      setSuccess(true)
      onNewGame(data)
      setMsg(`Game ${data.id} created!`)
      setTimeout(() => setShowModal(false), 3000)
    }
  }

  useEffect(() => {
    setSending(false)
    setSent(false)
    setSuccess(false)
    setError('')
    setMsg('')
    setBet('heads')
    setPassword('')
    setAmount(0)
  }, [showModal])

  return (
    <Modal
      size="sm"
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      header={<>
        <Icon name="coin" className="text-primary" size={30}/>
        <span>Create New Coinflip Room</span>
      </>}
    >
      <InsufBalanceNotice setLowBal={setLowBal} />
      {error && 
      <motion.div
        initial= {{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 border text-xs mb-3 rounded-md border-red text-red bg-red/10">
        {error}
      </motion.div>}

      <div className={`${lowBal ? 'opacity-50 pointer-events-none' : ''}`}>

      <motion.div
        initial = {{ opacity: 1, height: 'auto'}}
        animate={ sending || success ? { opacity: 0, height: 0 } : { opacity: 1, height: 'auto'}}
        transition={{ duration: 0.3 }}
        className={ sending || success ? 'overflow-hidden' : '' }
      >
        <Tbox label="Stake" value={amount} onChange={setAmount} type="number" />
        <div className="flex gap-4 mb-4">
            <div onClick={() => setBet('heads')} className={`${bet == 'heads' ? 'border-green border' : ''} flex-1 flex flex-col items-center text-center rounded-md bg-white bg-opacity-10 cursor-pointer hover:bg-opacity-20 py-3 px-4`}>
              <CoinHead side="heads" size="md" className="my-3"/>
              <span className="uppercase text-xs">heads</span>
            </div>

            <div onClick={() => setBet('tails')} className={`${bet == 'tails' ? 'border-green border' : ''} flex-1 flex flex-col items-center text-center rounded-md bg-white bg-opacity-10 cursor-pointer hover:bg-opacity-20 py-3 px-4`}>
              <CoinHead side="tails" size="md" className="my-3"/>
              <span className="uppercase text-xs">tails</span>
            </div>
          </div>
        <Tbox label="Game Password" type="password" value={password} onChange={setPassword} />
      </motion.div>

      <AnimButton text="Launch Game" onClick={createGame} success={success} error={error} start={sending} done={sent} />
      </div>
      {success && (
        <motion.div 
          initial= {{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-green font-bold text-center my-4">Game created!</div>
          <div className="p-4 border text-xs my-5 rounded-md border-green text-green">{msg}</div>
        </motion.div>
      )}
    </Modal >
  );
}

export default CreateGameModal;