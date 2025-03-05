import { useEffect, useRef, useContext, useState } from "react"
import { motion } from "framer-motion"
import { formatUnits } from "viem"
import { getUserTransactions } from "@/api"
import { BaseContext } from "@/context/BaseContext"

function formatData(data, tokens) {
  return data.map(r => {
      return {
          ...r,
          token: tokens.find(x => x.id === r.token.id) 
      }
  })
}

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }

  emit(event, ...args) {
    if (!this.events[event]) return;

    this.events[event].forEach((listener) => {
      listener(...args);
    });
  }
}

class TransactionsWatcher extends EventEmitter {
  constructor(intervalSec = 15) {
    super()
    this.transactions = []
    this.newEntries = []
    this.intervalSec = intervalSec
    this.timerId = null
    this.isRunning = false;
  }

  get intervalMs() {
    return this.intervalSec * 1000
  }

  async fetchData() {
    try {
      const [er, data] = await getUserTransactions({ limit: 10 })
      if (er) throw er

      const formatted = formatData(data?.transactions, data?.tokens)
      this.newEntries = formatted.filter(latest => !this.transactions.some(old => old.id === latest.id))

      if (this.transactions.length && this.newEntries.length) this.emit('new', this.newEntries)

      this.transactions = formatted
      this.emit('latest', this.transactions)
    } catch (error) {
      console.error(error)
      this.emit('error', error);
      this.stop()
    }
  }

  async run() {
    await this.fetchData()

    this.timerId = setTimeout(() => {
      if (this.isRunning) this.run()
    }, this.intervalMs)
  }

  async start() {
    if (this.isRunning) return
    console.log('[TxAlerts]', `Started polling (${this.intervalSec}s)...`)
    this.isRunning = true
    this.run()
  }

  stop() {
    if (!this.isRunning) return

    clearTimeout(this.timerId)
    this.timerId = null
    this.isRunning = false
    console.log('[TxAlerts]', 'Stopped')
  }
}

const Notification = ({ tx, duration = 3000, onClose = () => {} }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); 
  }, [duration, onClose]);

  if (!tx) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`bg-green fixed z-10 top-[100px] font-semibold right-4 text-xs text-white px-4 py-2 shadow-lg rounded-lg`}
    >
      { 
        tx?.amount[0] === '-' ? 
        (
          <p>Your Withdrawal of {formatUnits(tx?.amount, tx?.token?.decimals)} ${tx?.token?.symbol} is being pocessed!</p>

        ) : (
          <p>Your Deposit of {formatUnits(tx?.amount, tx?.token?.decimals)} ${tx?.token?.symbol} has been received!</p>
        )

      }
    </motion.div>
  );
}

export const TxAlerts = ({ interval = 10 }) => {
  const { user } = useContext(BaseContext)
  const [item, setItem] = useState(null)
  const watcherRef = useRef(null)

  useEffect(() => {
    watcherRef.current = new TransactionsWatcher(interval)

    watcherRef.current.on('latest', (v) => {
      // console.log('[TxAlerts:LATEST]', v)
    })

    watcherRef.current.on('new', (v) => {
      console.log('[TxAlerts:NEW]', v)
      setItem(p => v[0])
    })

    return () => {
      watcherRef.current.stop()
      watcherRef.current.removeAllListeners()
    }
  }, [])

  useEffect(() => {
    if (user) {
      watcherRef.current.start()
    } else {
      watcherRef.current.stop()
    }
  }, [user])

  return <Notification tx={item} onClose={() => setItem(null)}/>
}