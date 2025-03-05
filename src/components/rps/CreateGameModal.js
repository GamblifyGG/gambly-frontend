import { useEffect, useState, useContext } from "react";
import { Icon, Modal } from "../common";
import { AnimButton, Tbox, Select } from "../form";
import axios from "axios";
import authTokens from "@/utils/authTokens"
import { RockPaperScissorsContext } from "@/context/RockPaperScissorsContext"
import RpsHead from './RpsHead'
import { motion } from 'framer-motion'
import { createRpsGame } from '@/api'
import { parseUnits } from 'viem'
import { BaseContext } from "@/context/BaseContext";
import io from 'socket.io-client';
import { getApiError } from "@/utils/api"
import InsufBalanceNotice from "@/components/InsufBalanceNotice";


const CreateGameModal = ({ showModal, setShowModal, token, onNewGame = () => {} }) => {
    const { addGame } = useContext(RockPaperScissorsContext)
    const { userAuth } = useContext(BaseContext);
    const [lowBal, setLowBal] = useState(false)

    const privacyOpts = [
      { text: 'Private Game', value: 'private' },
      { text: 'Public', value: 'public' },
    ]

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
    const [amount, setAmount] = useState(0)
    const [bet, setBet] = useState('rock')
    const [password, setPassword] = useState('')

    const autoJoin = async (roomid, bet, password) => {
      console.log('[Auto Join]', 'connecting...')
      const sock = io('wss://staging.gambly.io', {
          path: '/rps-api',
          transports: ['websocket'],
          query: { room: roomid },
          auth: { token: userAuth?.token },
      });

      sock.on('connect', () => {
          const args = password ? { bet, password } : { bet }
          console.log('[Auto Join]', 'connected!');
          console.log('[Auto Join]', 'joining', args)

          sock.emit('rps:enter', args, (err, result) => {
            if (err) console.log('[Auto Join Error]', err)
            if (result) console.log('[Auto Join]', result)
          }) 

          sock.close();
          sock.disconnect();
      });
    }

    const createGame = async () => {
      setSending(true)
      setSent(false)
      setSuccess(false)
      setError(null)
  
      console.log('parseUnits', amount.toString(), token?.decimals)
      const _amount = parseUnits(amount.toString(), token?.decimals).toString()
  
      const [er, data] = await createRpsGame({
        chain_id: token?.network?.id,
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

        setTimeout(() => {
          setShowModal(false)
        }, 3000)
      }
    }

    useEffect(() => {
      setSending(false)
      setSent(false)
      setSuccess(false)
      setError('')
      setMsg('')
      setBet('rock')
      setPassword('')
      setAmount(0)
    }, [showModal])
  
    return (
      <Modal
        size="sm"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        header={<>
            <Icon name="rps" className="text-primary" size={30}/>
            <span>Create New Rock, Paper, Scissors Game</span>
        </>}
      > 
        <InsufBalanceNotice setLowBal={setLowBal} />
        {error && <motion.div initial= {{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="p-4 border text-xs mb-3 rounded-md bg-red/10 border-red text-red">{error}</motion.div>}

        <div className={`${lowBal ? 'opacity-50 pointer-events-none' : ''}`}>
        <motion.div
          initial = {{ opacity: 1, height: 'auto'}}
          animate={ sending || success ? { opacity: 0, height: 0 } : { opacity: 1, height: 'auto'}}
          transition={{ duration: 0.3 }}
          className={ sending || success ? 'overflow-hidden' : '' }
        >

          <Tbox label="Stake" value={amount} onChange={setAmount} type="number"/>

          <div className="flex justify-center gap-4 mb-4">
            <div onClick={() => setBet('rock')} className={`${bet == 'rock' ? 'border-green border' : ''} text-center rounded-md bg-white bg-opacity-10 cursor-pointer hover:bg-opacity-20 py-3 px-4`}>
              {/* <RpsHead side="rock" size="xl"/> */}
              <img src="/rps/rock-player-1.svg" className="h-12" alt=""/>
              <span className="uppercase text-xs">rock</span>
            </div>

            <div onClick={() => setBet('paper')} className={`${bet == 'paper' ? 'border-green border' : ''} text-center rounded-md bg-white bg-opacity-10 cursor-pointer hover:bg-opacity-20 py-3 px-4`}>
              <img src="/rps/paper-player-1.svg" className="h-12" alt=""/>
              <span className="uppercase text-xs">paper</span>
            </div>

            <div onClick={() => setBet('scissors')} className={`${bet == 'scissors' ? 'border-green border' : ''} text-center rounded-md bg-white bg-opacity-10 cursor-pointer hover:bg-opacity-20 py-3 px-4`}>
              <img alt="" src="/rps/scissor-player-1.svg" className="h-12" />
              <span className="uppercase text-xs">scissors</span>
            </div>
          </div>

          <Tbox label="Game Password" type="password" value={password} onChange={setPassword}/>
        </motion.div>

        <AnimButton text="Launch Game" onClick={createGame} success={success} error={error} start={sending} done={sent}/>
        { success && (
          <motion.div 
            initial= {{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-green font-bold text-center my-4">Game created!</div>
            <div className="p-4 border text-xs mb-4 rounded-md border-green text-green">{msg}</div>
          </motion.div>
        )}
        </div>
      </Modal >
    );
}

export default CreateGameModal;