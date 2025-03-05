import { useEffect, useState } from "react";
import { Circle, Iconify, Modal, Icon } from "../common";
import { useRouter } from "next/router";
import { parseUnits } from "viem";
import { createPokerTable } from '@/api'
import { AnimButton } from "../form";
import { motion } from 'framer-motion'
import { getApiError } from "@/utils/api"
import InsufBalanceNotice from "@/components/InsufBalanceNotice";

const CreateTableModal = ({ token, showModal, setShowModal }) => {
    const [gameType, setGameType] = useState('Texas Holdem');
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [buyIn, setBuyIn] = useState(0);
    const [handTimeLimit, setHandTimeLimit] = useState(15);
    const [privateRoom, setPrivateRoom] = useState(false);
    const [smallBlind, setSmallBlind] = useState(0.05 / 20);
    const [bigBlind, setBigBlind] = useState(0.05 / 10);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [created, setCreated] = useState(false);

    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const [msg, setMsg] = useState('')
    const [lowBal, setLowBal] = useState(false)

    const insertPokerRoom = async () => {
        setSending(true)
        setSent(false)
        setSuccess(false)
        setError(null)

        let buy_in = parseUnits(buyIn.toString(), token?.decimals).toString();

        const [er, data] = await createPokerTable({
            chain_id: token.network.id,
            token_address: token.address,
            move_time_limit: handTimeLimit,
            buy_in,
            max_players: maxPlayers,
            _private: privateRoom
        })

        setSending(false)
        setSent(true)

        if (data) {
            setSuccess(true)
            setMsg(`Table created!`)
        }

        if (er) {
            console.error(er)
            setError(getApiError(er))
        }

        console.log('[ER]', er)
        console.log('[S]', data)
        setLoading(false);
    }

    useEffect(() => {
        setSending(false)
        setSent(false)
        setSuccess(false)
        setError(null)
        setBuyIn(0)
    }, [showModal])

    return (<Modal
        size="sm"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        header={<>
            <Icon name="cards" className="text-primary" size={30}/>
            <span>Create Poker Room</span>
        </>}
    >
        <InsufBalanceNotice setLowBal={setLowBal} />
        {error && 
        <motion.div
            initial= {{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 border text-xs mb-3 rounded-md border-red text-red bg-red/10">{error}
        </motion.div>
        }

        <div className={`${lowBal ? 'opacity-50 pointer-events-none' : ''}`}>

        <motion.div
            initial = {{ opacity: 1, height: 'auto'}}
            animate={ sending || success ? { opacity: 0, height: 0 } : { opacity: 1, height: 'auto'}}
            transition={{ duration: 0.3 }}
            className={ sending || success ? 'overflow-hidden' : '' }
        >
            <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                    <label className="text-sm font-bold mb-2 block">Game Type</label>
                    <select className="w-full bg-dark p-2 outline-none rounded-md border border-gray" >
                        <option>Texas Holdem</option>
                    </select>
                </div>

                <div>
                <label className="text-sm font-bold mb-2 block">Max Players</label>
                    {/* <span className="text-[10px] text-primary">This is the maximum number of players that can join the game</span> */}
                    <select onChange={(e) => {
                        if (e.target.value >= 2) {
                            setMaxPlayers(e.target.value);
                        }
                    }} className="w-full bg-dark p-2 outline-none rounded-md border border-gray" >
                        <option>2</option>
                        <option>4</option>
                        <option>6</option>
                        <option>8</option>
                        <option>10</option>
                    </select>
                </div>
            </div>



                <div className='mb-2'>
                    <label className="text-sm font-bold mb-1">Buy In</label>
                    <span className="text-xs text-primary block mb-2">This is the amount of tokens each player will need to enter the game</span>
                    <input
                        onChange={(e) => {
                        if (e.target.value >= 0) {
                            setBuyIn(e.target.value);
                        }
                    }} value={buyIn} placeholder='0.05' type="number" className="w-full bg-dark p-2 outline-none rounded-md border border-gray" />
                </div>

                <div className='mb-2'>
                    {/* time */}
                    <label className="text-sm font-bold block mb-1">Time Limit</label>
                    <span className="text-xs text-primary block mb-2">This is the amount of time each player has to make a move</span>
                    <select onChange={(e) => {
                        setHandTimeLimit(e.target.value);
                    }} className="w-full bg-dark p-2 outline-none rounded-xl border border-gray" >
                        <option value={15}>Fastest - 15 seconds</option>
                        <option value={30}>Fast - 30 seconds</option>
                        <option value={45}>Medium - 45 seconds</option>
                        <option value={60}>Long - 60 seconds</option>
                    </select>
                </div>

                <div className='flex flex-col pb-5'>
                    {/* private */}
                    <div className='flex items-center gap-2'>
                        <input onChange={() => {
                            let newPrivacy = !privateRoom;
                            console.log(newPrivacy)
                            if (newPrivacy === true) {
                                setPrivateRoom(1);
                            } else {
                                setPrivateRoom(0);
                            }
                        }} type="checkbox" id="privacy" name="privacy" value="private" />
                        <label htmlFor="privacy" className="text-sm font-bold">Private Room</label>
                    </div>
                    <span className="text-[10px] text-primary">This will make the room private, and only players with the link can join the room.</span>

                </div>

     
        </motion.div>

        <AnimButton text="Create Room" onClick={insertPokerRoom} success={success} error={error} start={sending} done={sent}/>
        
        </div>
        {success && (
            <motion.div 
            initial= {{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            >
            <div className="text-green font-bold text-center my-4">Room created!</div>
            <div className="p-4 border text-xs my-5 rounded-md border-green text-green">{msg}</div>
            </motion.div>
        )}
    </Modal >);
}

export default CreateTableModal;