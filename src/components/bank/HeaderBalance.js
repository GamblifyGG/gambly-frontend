import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { BaseContext } from '@/context/BaseContext'
import Link from 'next/link'
import Iconify from '@/components/common/Iconify'
import useStateRef from 'react-usestateref'
import { useRouter } from 'next/router';
import { formatUnits } from 'viem';
import { Button } from "@/components/form"

export default function HeaderBalance() {
  const { user, token, balances, balancesLoading, findTokenBalance, setShowDepositModal, setDepositToken } = useContext(BaseContext)
  const [windowOpen, setWindowOpen] = useState(false)
  const [tokenBalance, setTokenBalance, tokenBalanceRef] = useStateRef(null)
  const ref = useRef(null);
  const maxLen = 6
  const router = useRouter()

  const handleClickOutside = useCallback((event) => {
    if ((ref.current && ref.current.contains(event.target))) {
      return
    }

    setWindowOpen(false)
  }, [])


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user || balancesLoading) return

    if (!tokenBalanceRef.current && !router.query.token && balances.length) {
      setTokenBalance(balances[0])
    }
  }, [user, router.query.token, balancesLoading, balances])

  useEffect(() => {
    if (!token || balancesLoading) return

    const v = findTokenBalance(token?.address)

    if (v) {
      setTokenBalance(v)
    } else {
      // Just set 0 balance so it shows in header
      setTokenBalance({ balance: '0', token })
    }
  }, [token, balancesLoading, balances])

  if (!user) return null

  return (
    <div className="relative flex gap-2 items-center" ref={ref}>
      { user && balancesLoading && <Iconify className="animate-spin inline-flex opacity-50" icon="tdesign:refresh" /> }

      { user && !balancesLoading && token &&
        <Button
          onClick={() => {
            setDepositToken(token)
            setShowDepositModal(true)
          }} 
          variant="secondary-outline"
          className="rounded-full hidden lg:inline-flex"
        ><Iconify icon="majesticons:data-plus" className="text-lg"/>Deposit {token?.symbol}</Button>
      }

      { !balancesLoading && user &&
        <div
          onClick={() => setWindowOpen(true)}
          className="header-user relative hover:border-secondary p-2 ml-auto justify-self-end flex items-center bg-dark-500 rounded-3xl border border-dark-250"
        >
          <Iconify icon="solar:wallet-bold" className="cursor-pointer mx-[2px] lg:hidden"/>
          <div className='hidden lg:flex gap-2 items-center'>
            <img alt="" className='h-4 lg:h-6 rounded-full' src={tokenBalance?.token?.logo || token?.logo}></img>
            <div className='w-[60px] lg:w-[110px] text-xs text-right'>
              <div className="truncate">{tokenBalance ? formatUnits(tokenBalance?.balance, tokenBalance?.token?.decimals) : '0.000'}</div>
            </div>
          </div>
        </div>
      }

      { windowOpen &&
      <div className='absolute top-[35px] lg:top-[50px] w-[200px] right-0 z-50 bg-gray border border-bordergray rounded-md p-2 flex flex-col'>
        <div className='text-xs flex items-center justify-between pb-3 pt-1'>
            <span>My Tokens</span>
            <Iconify onClick={() => setWindowOpen(false)} icon="ep:close-bold" className="text-primary hover:text-red cursor-pointer"/>
        </div>
        <div className={`${balancesLoading ? 'opacity-10' : ''} w-full overflow-y-auto flex flex-col gap-1`}>
            { 
                balances.slice(0,maxLen).map((token, index) => 
                    <Link
                        key={index}
                        onClick={() => setWindowOpen(false)}
                        href={`/casinos/${token.token.network.name.toLowerCase()}/${token.token.address}`}
                        className="cursor-pointer text-xs p-1 pr-2 flex gap-2 w-full border-b bg-darkgray rounded-md border hover:bg-secondary hover:text-dark border-bordergray items-center"
                    >
                        <img src={token?.token?.logo} className='w-6 h-auto rounded-full border border-bordergray' />
                        <div>{token.token.symbol}</div>
                        <div className='ml-auto text-end truncate ...'>{formatUnits(token.balance, token.token.decimals)}</div>
                    </Link>
                )
            }
            { balances?.length > maxLen && 
                <Link onClick={() => setWindowOpen(false)} className="text-sm text-right py-1 block text-primary hover:underline" href="/bank?page=balances">+{balances?.length - maxLen} more...</Link>
            }
            <div className="text-center">
                <Link onClick={() => setWindowOpen(false)} className="rounded-3xl cursor-pointer text-xs p-1 block text-center border hover:text-white hover:bg-secondary border-secondary text-secondary" href="/bank?page=transactions&type=deposit">+ Deposit Tokens</Link>
            </div>
        </div>
            
      </div>
}
    </div>
  )
}