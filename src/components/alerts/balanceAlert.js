"use client";

import { useEffect, useRef, useContext } from "react"
import { formatUnits } from "viem"
import { BaseContext } from "@/context/BaseContext"
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { toast } from 'react-toastify'
import { Iconify } from "@/components/common"

export const BalanceAlerts = () => {
  const { userAuth, updateBalance } = useContext(BaseContext)
  const didInit = useRef(false)
  const controllerRef = useRef(null)
  controllerRef.current = new AbortController();

  function unsubscribe() {
    console.log('unsub...', didInit.current)
    if (!didInit.current) return
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
    didInit.current = false
    console.log('Unsubscribed from SSE');
  }

  function initSSE(token, chainId) {
    if (didInit.current) return
    console.log('[MSSE] init...')
    const headers = { Authorization: `Bearer ${token}` };
    
    fetchEventSource(`${process.env.NEXT_PUBLIC_API_URL}/user/balances/${chainId}/live?include_token_data=true`, {
      headers,
      signal: controllerRef.current.signal,
      onopen() {
        console.log(`[MSSE: Chain(${chainId})]`, 'connected!')
        didInit.current = true
      },
      onmessage(ev) {
          if (ev?.event === 'balanceUpdated') {
            console.log(`[MSSE(${name}):MSG]`, ev);
            const data = JSON.parse(`${ev?.data}`)
            console.log(data)
            const updt = data.balance
            const amt = formatUnits(updt.balance, updt.token.decimals)

            updateBalance(updt.token.id, updt.balance)
            toast.success(<div className="flex gap-2"><img src={updt.token.logo} alt="" className="w-4 h-4" /><div className="text-xs text-nowrap">Your <span className="text-primary font-bold">{updt.token.symbol}</span> balance changed to <span className="text-primary font-bold">{amt}!</span></div></div>, { closeButton: false, progress: false, icon: false })
          }
      },
      onerror(err) {
        console.log(`[MSSE(${name}):ERR]`, err)
      }
    })

  }

  useEffect(() => {
    if (!userAuth) {
      unsubscribe()
    } else {
      initSSE(userAuth?.token, userAuth?.chainId)
    }
  }, [userAuth])

  return <></>
}