import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { BaseContext } from '@/context/BaseContext'
import convertNetworkToImage from "@/utils/convertNetworkToImage";
import Link from 'next/link'
import Iconify from '@/components/common/Iconify'
import { useRouter } from 'next/router'

export default function NetworkSelector({ className }) {
  const { network, token, networks, networksCache } = useContext(BaseContext)
  const [networkOpen, setNetworkOpen] = useState(false)
  const [tokenOpen, setTokenOpen] = useState(false)
  const [tokens, setTokens] = useState([])
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const maxLen = 30
  const router = useRouter()

  const closeALl = () => {
    setNetworkOpen(false)
    setTokenOpen(false)
  }

  const handleNetworkClick = () => {
    if (tokenOpen) setTokenOpen(false)
    setNetworkOpen(!networkOpen)
  }

  const handleTokenClick = () => {
    if (networkOpen) setNetworkOpen(false)
    setTokenOpen(!tokenOpen)
  }

  const handleClickOutside = useCallback((event) => {
    if ((ref1.current && ref1.current.contains(event.target)) || (ref2.current && ref2.current.contains(event.target))) {
      return
    }

    closeALl()
  }, [])

  const pvpPaths = [
    '/casinos/[network]/[token]/coinflip',
    '/casinos/[network]/[token]/poker',
    '/casinos/[network]/[token]/rockpaperscissors',
    '/casinos/[network]/[token]/burn',
  ]

  const getHref = (token, pathname) => {
    if (!token || !pathname) return '/casinos'

    if (pvpPaths.includes(pathname)) {
      return pathname.replace('[network]', token?.network?.name.toLowerCase())
                     .replace('[token]', token?.address)
    }

    return `/casinos/${token?.network?.name.toLowerCase()}/${token?.address}`
  }

  useEffect(() => {
    if (!network || !networksCache || !router?.pathname) return

    const tokensWithHref = networksCache[network?.name]?.map(x => {
      return {
        ...x.token,
        href: getHref(x.token, router?.pathname)
      }
    })

    setTokens(tokensWithHref)
  }, [network, networksCache, router?.pathname])

  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (networkOpen && !tokenOpen || tokenOpen && !networkOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } 

    if (!networkOpen && !tokenOpen) {
      document.removeEventListener('mousedown', handleClickOutside);
    }

  }, [networkOpen, tokenOpen])


  return (
    <div className={`flex h-full ${className}`}>
      <div className="relative h-full"  ref={ref1}>
        <div
          onClick={handleNetworkClick}
          className="flex h-full gap-2 pl-3 capitalize items-center cursor-pointer"
        >
          {
            !network ? <span>Select network...</span>
            : 
            <>
              <img src={convertNetworkToImage(network?.id)} className="w-[10px] h-auto" />
              <span className="hidden lg:block">{ network?.name }</span>
            </>
          }
          <Iconify icon="uil:angle-down" className={`${networkOpen ? 'rotate-180' : ''} inline-flex pointer-events-none opacity-30 text-lg`}/>
        </div>

        { networkOpen &&
          <div className="absolute left-0 top-[100%] w-[160px] z-10 translate-y-[-10px]" >
            <div className="bg-gray rounded-lg p-2 border border-lightgray flex flex-col gap-2 text-sm">
            {
              networks.map((x,i) => (
                <Link
                  key={i}
                  href={`/casinos/${x.name}`}
                  className={`${network?.id == x.id ? 'bg-darkgray' : 'hover:bg-white/10 bg-white/5'} rounded-sm cursor-pointer flex py-2 px-4 gap-3 capitalize items-center`}
                  onClick={closeALl}
                >
                  <img src={convertNetworkToImage(x.id)} className="w-[10px] h-auto" />
                  <span>{ x.name }</span>
                </Link>
              ))
            }
            </div>
          </div>
        }
      </div>

      { token &&
      <div className="hidden_ lg:block relative h-full"  ref={ref2}>
        <div
          onClick={handleTokenClick}
          className="flex h-full gap-2 pl-3 capitalize items-center cursor-pointer"
        >
          <img src={token?.logo} className="w-[10px] h-auto" />
          <span>{ token?.symbol }</span>
          <Iconify icon="uil:angle-down" className={`${tokenOpen ? 'rotate-180' : ''} inline-flex pointer-events-none opacity-30 text-lg`}/>
        </div>

        { tokenOpen && tokens.length > 0 &&
          <div className="absolute left-[-50%] lg:left-0 top-[100%] w-auto z-10 translate-y-[-10px]" >
            <div className={`bg-gray rounded-lg p-2 border border-lightgray text-sm ${tokens?.length > 5 ? 'columns-2' : 'columns-1'} ${tokens?.length > 6 ? 'lg:columns-3' : 'lg:columns-1'} gap-2 space-y-2`}>
            {
              tokens.slice(0, maxLen).map((x,i) => (
                <Link
                  key={i}
                  href={x?.href}

                  className={`${token?.address == x.address ? 'bg-darkgray' : 'bg-white/5 hover:bg-white/10 active:bg-white/10'} rounded-sm cursor-pointer flex py-2 px-4 gap-3 capitalize items-center w-[120px]`}
                  onClick={closeALl}
                >
                  <img src={x?.logo} className="h-[15px] w-auto" />
                  <span className="truncate ...">{ x.symbol }</span>
                </Link>
              ))
            }
            { tokens?.length > maxLen && 
                <Link className="text-sm py-1 block text-primary hover:underline" href={`/casinos/${network?.name}`}>+{tokens.length - maxLen} more...</Link>
            }
            </div>
          </div>
        }
      </div>
      }
    </div>
  )
}