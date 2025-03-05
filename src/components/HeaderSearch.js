import React, { useState, useEffect, useContext } from 'react'
import { BaseContext } from '@/context/BaseContext'
import convertNetworkToImage from '@/utils/convertNetworkToImage';
import { Iconify } from "@/components/common"
import { useRouter } from "next/router";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const HeaderSearch = ({ reportIsFocused, className }) => {
  const { searchTokens } = useContext(BaseContext)
  const [inputValue, setInputValue] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [busy, setBusy] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [isFocused, setIsFocused] = useState(false);
  const [tokens, setTokens] = useState([]);
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(inputValue, 500); // API rate limit is 500ms

  useEffect(() => {
    const term = debouncedSearchTerm.trim()

    if (!term) {
      setSearchVisible(false)
      setTokens([])
      return
    }

    setBusy(true)
    setNotFound(false)
    setSearchVisible(false)

    searchTokens(debouncedSearchTerm, null, false)
      .then(r => {
        console.log('[Results]', r)
        setNotFound(r.length === 0)
        setTokens(r);
      })
      .catch((er) => {
        console.error(er)
      })
      .finally(()=> {
        setBusy(false)
        setSearchVisible(true);
      })

  }, [debouncedSearchTerm]);

  const search = (e) => {
    setInputValue(e.target.value);
  }

  useEffect(() => {
    reportIsFocused(isFocused)
  }, [isFocused])

  return (
    <div className={`relative flex gap-2 h-[40px] ${isFocused ? 'w-full lg:w-auto' : 'w-[38px] lg:w-auto'} ${className}`}>
    { busy ?
      <Iconify icon="tdesign:refresh" className="animate-spin opacity-50 pointer-events-none absolute text-[16px] inline-flex left-[13px] top-[11px]" /> : 
      <Iconify icon="basil:search-outline" className="opacity-50 pointer-events-none absolute text-[16px] inline-flex left-[13px] top-[11px]" />
    }
    <input
      value={inputValue}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={(e) => {
        search(e)
      }}
      type="search"
      placeholder="Search Casinos..."
      className="w-full text-sm bg-dark-500 outline-none h-full pr-0 pl-[40px] lg:pr-4 lg:pl-[33px] rounded-full border border-dark-250"
    />

    { searchVisible &&
      <div className=' overflow-auto p-2 top-[100%] absolute w-[300px] max-h-[200px] z-[99999] rounded-md bg-gray border border-lightgray'>
        {
          tokens.length > 0 ?
            tokens.map((token, index) => (
              <a
                href={`/casinos/${token.network.name.toLowerCase()}/${token.address}`}
                key={index}
                onClick={(ev) => {
                  ev.preventDefault()
                router.push(`/casinos/${token.network.name.toLowerCase()}/${token.address}`)
                setSearchVisible(false)
                setInputValue('')
              }} className='items-center flex border-lightgray justify-between  cursor-pointer hover:ring-1 ring-inset ring-secondary/30  even:bg-gray p-2 rounded-md overflow-auto odd:bg-darkgray'>

                <div className='grid grid-cols-2'>
                  <div className='text-xs lg:text-sm truncate'>{token.name}</div>
                  <div className='text-xs lg:text-sm truncate'>${token.symbol}</div>
                  <div className='col-start-1 col-end-3 text-[8px]'>{token.address}</div>
                </div>

                <div className='text-sm flex justify-end relative'>
                  {token?.logo ?
                    <img src={token?.logo} className='h-8 rounded-full object-cover w-8' alt=""></img> :
                    <div className='h-8 w-8 rounded-full bg-darkgray border border-lightgray flex items-center justify-center'>?</div>
                  }
                  <img src={convertNetworkToImage(token?.network?.id)} className='h-5 -right-1 bg-darkgray border-lightgray border p-1 -top-1 rounded-full absolute object-contain w-5' alt=""></img>
                </div>
              </a>
            ))
            :
            <div className='flex items-center justify-center flex-col'>
              <span className='text-whitegrey'>No Tokens Found</span>
              <span className='text-primary text-center text-xs'>If your token does not show up by name, try entering the full contract address.</span>
            </div>
        }
      </div>
    }
  </div>
  )
}

export default HeaderSearch
