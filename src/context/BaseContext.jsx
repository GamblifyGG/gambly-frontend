"use client";

import React, { createContext, useState, useEffect, useRef } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useSignMessage, useDisconnect, useSwitchChain } from "wagmi";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import useStateRef from 'react-usestateref'

import { getUser, getUserBalance, getCasinos, searchCasinos, getCasino } from '@/api'
import { devLog } from '@/utils/common'
import { getChainAuth, saveChainAuth, getCurrentChainAuth, removeChainAuth, removeEvmAuth, isEvm, isSolana, getAuth } from "@/utils/auth"
import { convertNetworkID } from '@/utils/convertNetworkID'
import { getApiError } from "@/utils/api"

function createSiweMessage(chainId, address, statement, nonce) {
  devLog("[createSiweMessage]", chainId)
  const message = new SiweMessage({
    scheme: 'https',
    domain: process.env.NEXT_PUBLIC_WEBSITE_NAME,
    address,
    statement,
    uri: process.env.NEXT_PUBLIC_WEBSITE_LINK,
    version: '1',
    chainId,
    nonce
  });

  return message.prepareMessage();
}

const createSiweMessageSolana = (
  domain,
  address,
  statement,
  uri,
  version,
  nonce
) => {
  let message = `${domain} wants you to sign in with your Solana account:\n`;
  message += `${address}`;

  if (statement) {
    message += `\n\n${statement}`;
  }

  const fields = [];
  if (uri) {
    fields.push(`URI: ${uri}`);
  }

  // fields.push(`Domain: ${domain}`);
  // fields.push(`Address: ${address}`);
  // if (statement) {
  //   fields.push(`Statement: ${statement}`);
  // }
  if (version) {
    fields.push(`Version: ${version}`);
  }
  if (nonce) {
    fields.push(`Nonce: ${nonce}`);
  }
  if (fields.length) {
    message += `\n\n${fields.join("\n")}`;
  }

  return message;
}

export const BaseContext = createContext({
  balances: [],
  balancesLoading: false,
  casino: null,
  casinoLoading: false,
  casinoError: '',
  casinosCache: [],
  networksCache: {},
  casinosLoading: true,
  isConnected: false,
  isConnectedEVM: false,
  isConnectedSolana: false,
  isConnecting: false,
  isLoginWindowOpen: false,
  network: {},
  networkError: '',
  networks: [],
  networkTokens: [],
  token: null,
  tokenBalance: null,
  user: {},
  userAuth: {},
  userLoading: true,
  showDepositModal: false,
  depositToken: null,
  setEvmLoginOpen: () => {},
  setSolanaLoginOpen: () => {},
  setDepositToken: (token) => {},
  setShowDepositModal: () => {},
  findCasino: (networkName, address) => { },
  findTokenBalance: (address) => { },
  findTokenById: (id) => {},
  getNetworkFromName: (name) => {},
  refreshBalances: async () => [],
  searchToken: (term) => { },
  searchTokens: async (term, chainId) => [],
  setIsLoginWindowOpen: () => { },
  setNetworkTokens: () => {},
  signIn: async () => { },
  signOut: () => { },
  updateBalance: (tokenId, balance) => {}
})

export const BaseProvider = ({ children }) => {
  const cachedAt = useRef(0)
  const [balances, setBalances] = useState([])
  const [casinosCache, setCasinosCache] = useState([])
  const [tokensCache, setTokensCache, tokensCacheRef] = useStateRef([])
  const [networksCache, setNetworksCache] = useState(null)
  const [casino, setCasino] = useState(null)
  const [casinosLoading, setCasinosLoading] = useState(true)
  const [casinoLoading, setCasinoLoading] = useState(true)
  const [casinoError, setCasinoError] = useState(null)
  const [casinosError, setCasinosError] = useState(null)
  const [networkError, setNetworkError] = useState(null)
  const [isConnected, setIsConnected] = useState(false);
  // const [isConnecting, setIsConnecting] = useState(false);
  const [networks, setNetworks] = useState([
    // { name: 'ethereum', id: 1, symbol: 'eth', logo: '/networks/ethereum.svg' },
    { name: 'solana', id: 101, symbol: 'sol', logo: '/networks/solana.png' },
    // { name: 'sepolia', id: 11155111, symbol: 'spo', logo: '/networks/sepolia.png' },
    { name: 'bsc', id: 56, symbol: 'bsc', logo: '/networks/bsc.png' },
  ])
  const [network, setNetwork] = useState(null)
  const [networkTokens, setNetworkTokens] = useState({ tokens: [], total: 0 })
  const [token, setToken] = useState(null)
  const [tokenBalance, setTokenBalance] = useState(null)
  const [defToken, setDefToken] = useState(null)
  const [user, setUser] = useState(null)
  const [userAuth, setUserAuth] = useState(null)
  const [userLoading, setUserLoading] = useState(false)
  const [balancesLoading, setBalancesLoading] = useState(true)
  const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false)
  const [solanaLoginOpen, setSolanaLoginOpen] = useState(false)
  const [evmLoginOpen, setEvmLoginOpen] = useState(false)
  const [isSigningMessage, setIsSigningMessage] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositToken, setDepositToken] = useState(null)

  const { data, isError, isLoading, isSuccess, signMessageAsync } = useSignMessage();
  const { chainId: evmChainId, isDisconnected, address, isConnected: isConnectedEVM, status: statusEVM, isConnecting: isConnectingEVM, connector } = useAccount({ enabled: false });
  const { disconnect: disconnectEVM } = useDisconnect();
  const { connection: connectionSolana } = useConnection()
  const { disconnect: disconnectSolana, signMessage: signMessageSolana, wallet: solanaWallet, connected: isConnectedSolana } = useWallet()
  const router = useRouter();
  const { switchChainAsync } = useSwitchChain()

  // Support multichain accounts
  const saveAuth = (chainId, data) => {
    saveChainAuth(chainId, data)
    setUserAuth(getChainAuth(chainId))
  }

  const signOut = () => {
    removeChainAuth(network?.id)
    setUserAuth(null)
    setUser(null)
    if (isEvm(network?.id)) {
      disconnectEVM()
    }
    if (isSolana(network?.id)) disconnectSolana()
    router.push('/casinos')
  }

  const signOutWithoutDisconnecting = () => {
    localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_LKEY)
    setUserAuth(null)
    setUser(null)
  }

  const signIn = async () => {
    setIsLoginWindowOpen(true)
  }

  const updateBalance = (tokenId, balance) => {
    const exists = balances.find(x => x.token?.id === tokenId)

    if (!exists) {
      refreshBalances()
      return
    }

    setBalances(p => p.map(x => {
      if (x.token?.id === tokenId) return {...x, balance}

      return x
    }))
  }

  const refreshBalances = async () => {
    if (!user) {
      setBalancesLoading(false)
      return
    }

    setBalancesLoading(true)
    const [er, data] = await getUserBalance()

    if (data) {
      setBalances(data.balances)
    } else {
      setBalances([])
    }

    setBalancesLoading(false)
  }

  const initUser = async (useCache = false) => {
    setUser(null)
    setUserAuth(null)
    setUserLoading(true)
    const auth = getCurrentChainAuth()
    devLog(auth ? '[Get User]' : '[No user to get]')

    if (auth && useCache) {
      setUser(auth.user)
      setUserAuth({...auth, chainId: network.id })
      setUserLoading(false)
      return
    }

    if (auth) {
      devLog(auth)
      const [er1, data] = await getUser()

      if (data) {
        setUser(data)
        setUserAuth(auth)
      }
    }

    setUserLoading(false)
  }

  const findTokenBalance = (address) => {
    if (!address) return null
    return balances.find(x => x.token.address === address)
  }

  const loginWithSignature = async (signature, msg, chainId) => {
    try {
      const referral_code = localStorage.getItem("REF")

      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: msg,
          signature,
          ...referral_code ? { referral_code } : {}
        }),
      })
  
      const json = await r.json()
      
      if (!json || json.error) {
        console.error('[LOGIN ERROR]', json?.error || 'Unknown error')
        setIsSigningMessage(false)
        return
      }
      
      json.chainId = chainId
      localStorage.chainId = chainId
      saveAuth(chainId, json)
      initUser()
      const networkName = convertNetworkID(chainId)
      
      // Reset login state
      setIsSigningMessage(false)
      setIsLoginWindowOpen(false)
      setSolanaLoginOpen(false)
      setEvmLoginOpen(false)
  
      // Use referral_code once
      if (referral_code) {
        localStorage.removeItem("REF")
      }
  
      const pvpPaths = [
        "/casinos/[network]/[token]/poker/[room]",
        "/casinos/[network]/[token]/coinflip/[room]",
        "/casinos/[network]/[token]/rockpaperscissors/[room]",
      ]
  
      if (pvpPaths.some(x => x === router?.pathname)) {
        return
      }
  
      if (networkName) router.push(`/casinos/${networkName}`)

    } catch (err) {
      console.error('[LOGIN ERROR]', err)
      setIsSigningMessage(false)
    }
  }

  const getNonce = async (walletToGetNonceFor) => {
    return new Promise(async (resolve, reject) => {
      const n = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/nonce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletToGetNonceFor }),
      })
      const { nonce } = await n.json()
      resolve(nonce)
    })
  }

  const signMessageForEVM = async (chainId) => {
    devLog("[signMessageForEVM]", chainId)
    return new Promise(async (resolve, reject) => {
      setIsSigningMessage(true)
      const nonce = await getNonce(address)
      const message = 'gm wagmi frens'
      const msg = createSiweMessage(
        chainId,
        address,
        message,
        nonce
      );
      devLog('[EVM SIGN MESSAGE]', msg)
      await signMessageAsync({
        message: msg,
      }).then((res) => {
        devLog('[EVM SIGN MESSAGE COMPLETED]', res)
        resolve({ signature: res, message: msg })
      }).catch((err) => {
        console.error('[EVM SIGNING EVM MESSAGE]', err)
        disconnectEVM();
      }).finally(() => {
        setIsSigningMessage(false)
      })
    })
  }

  const signMessageForSolana = async () => {
    return new Promise(async (resolve, reject) => {
      const nonce = await getNonce(String(solanaWallet.adapter.publicKey))
      const message = createSiweMessageSolana(
        process.env.NEXT_PUBLIC_WEBSITE_NAME,
        solanaWallet.adapter.publicKey,
        'gm wagmi frens',
        process.env.NEXT_PUBLIC_WEBSITE_LINK,
        '1',
        nonce
      )
      // this needs to be an 8bit array
      const messageBytes = new TextEncoder().encode(message);
      await signMessageSolana(messageBytes).then((res) => {
        // devLog('[SOLANA SIGN MESSAGE]', res)
        resolve({ message: message, signature: res })
      }).catch((err) => {
        signOutWithoutDisconnecting()
        console.error('[SOLANA SIGN MESSAGE]', err)
        reject(err)
      })
    })
  }

  // [Casinos]
  // Always try to set network from path so shared links work

  const initCasinos = async () => {
    setCasinosLoading(true)
    const [er, data] = await getCasinos({ limit: 100, sort: "bets_total" })
    setCasinosLoading(false)

    if (er) {
      setCasinosError(er)
      setCasinosCache([])
      setTokensCache([])
      setNetworksCache(null)
    }

    if (data) {
      setCasinosCache(data.casinos)
      setTokensCache(data.casinos.map(x => x.token))

      const grouped = {}
      networks.forEach(x => {
        grouped[x?.name] = data.casinos.filter(c => c?.token?.network?.id === x.id)
      })

      setNetworksCache(grouped)
      cachedAt.current = Date.now()

      devLog('[CASINOS]', data)
      devLog('[NETWORKS CACHE]', grouped)

      // Set default network + token
      devLog('[DEF TKN]', grouped.ethereum?.[0]?.token)
      setDefToken(grouped.ethereum?.[0]?.token)
    }
  }

  const findCasino = (networkName, address) => {
    if (!casinosCache) return null

    return casinosCache.find(x => 
      x.token.address === address && 
      x.token.network.name.toLowerCase() === networkName.toLowerCase()
    );
  }

  const searchTokens = async (term, chainId, useCache = false) => {
    if (!term) return  []

    if (useCache) {
      devLog('[Search] query cache...')
      const cachedResults = searchToken(term)
      if (cachedResults.length) {
        devLog(cachedResults)
        return chainId ? cachedResults.filter(x => x.network.id === chainId) : cachedResults
      }
   }

    devLog('[Search] query server...')

    const [er, data] = await searchCasinos({ q: term })
    if (er) {
      console.error('[Search ERROR]', er)
      return []
    }

    console.log(data)

    if (data) {
      return chainId ? data?.casinos.map(x => x.token)
                                    .filter(x => x.network.id === chainId)
                     : data?.casinos.map(x => x.token);
    }
    
    return []
  }

  const searchToken = (str) => {
    str = str.toLowerCase()
    return tokensCacheRef.current.filter(x => x.name.toLowerCase().includes(str) || x.symbol.toLowerCase().includes(str) || x.address.toLowerCase().includes(str))
  }

  const findTokenById = (id) => {
    devLog('[FIND]', id)
    if (!id) return null
    const t = tokensCacheRef.current.find(x => x.id === id)
    devLog('[FOUND]', t)
    return t
  }

  const getNetworkFromName = (name = '') => {
    return networks.find(x => x.name.toLowerCase() === name.toLowerCase())
  }

  const getNetworkFromId = (id = 1) => {
    return networks.find(x => x.id === id)
  }

  const setCasinoAsync = async (chain_id, token_address) => {
    devLog('[Get Casino]', chain_id, token_address)
    setCasinoLoading(true)
    setCasino(null)
    setCasinoError(null)
    let cached = casinosCache.find(x => x.token.network.id === chain_id && x.token.address === token_address)

    if (cached) {
      devLog("Fetched from cache", cached)
      cached.token.token_2022 = cached.token_2022
      setCasino(cached)
      setToken(cached.token)
      setCasinoError(p => null)
      setCasinoLoading(false)
      return
    }
    
    const [er, data] = await getCasino(chain_id, token_address)
    setCasinoLoading(false)

    if (data) {
      setCasino(data)
      data.token.token_2022 = data.token_2022
      setToken(data?.token)
      setCasinoError(p => null)
      devLog('[Get Casino]', data)
    }

    if (er) {
      const msg = getApiError(er)
      setCasinoError(msg)
    }
  }

  const connectWalletToEvmChain = (chainId) => {
    disconnectEVM()
    setTimeout(()=> {
      setIsLoginWindowOpen(true)
    }, 500)
  }
  
  const handleEvmWallet = (chain_id) => {
    const chainId = chain_id || evmChainId
    let auth = getChainAuth(chainId)
    devLog('[AUTH]', auth)

    if (!auth) {
      signMessageForEVM(chainId)
        .then(({ signature, message }) => {
          loginWithSignature(signature, message, chainId)
        })
        .catch(err => {
          console.error('[EVM SIGN ERROR]', err)
          setIsSigningMessage(false)
        })
      return
    }

    if (auth?.user?.wallet_address !== address) {
      signOutWithoutDisconnecting() // Clear auth but keep wallet connected
      signMessageForEVM(chainId)
        .then(({ signature, message }) => {
          loginWithSignature(signature, message, chainId)
        })
        .catch(err => {
          console.error('[EVM SIGN ERROR]', err)
          setIsSigningMessage(false)
        })
    } else {
      // User already authenticated with current wallet
      setIsLoginWindowOpen(false)
      setEvmLoginOpen(false)
    }
  }

  const handleSolanaWallet = () => {
    let wallet = String(solanaWallet.adapter.publicKey)
    if (!wallet) {
      devLog('[SOLANA] Wallet:', 'Not found!')
      return
    }

    devLog('[SOLANA] Wallet:', wallet)

    const auth = getChainAuth(101)

    if (!auth) {
      setIsSigningMessage(true)
      signMessageForSolana()
      .then(({ message, signature }) => {
          devLog('[SOLANA] Sig:', message, signature)
          let signatureString = Array.from(signature).map(x => x.toString(16).padStart(2, '0')).join('')
          loginWithSignature(signatureString, message, 101)
      })
      .catch((err) => {
        console.error('[SOLANA] Sig:', err)
        setIsSigningMessage(false)
      })
      return
    }

    if (auth?.user?.wallet_address !== wallet) {
      signOutWithoutDisconnecting()
      setIsSigningMessage(true)
      signMessageForSolana()
      .then(({ message, signature }) => {
          let signatureString = Array.from(signature).map(x => x.toString(16).padStart(2, '0')).join('')
          loginWithSignature(signatureString, message, 101)
      })
      .catch((err) => {
        console.error('[SOLANA] Sig:', err)
        setIsSigningMessage(false)
      })
    } else {
      // User already authenticated with current wallet
      setIsLoginWindowOpen(false)
      setSolanaLoginOpen(false)
    }
  }

  const switchEvmNetwork = async (chainId) => {
    if (!chainId) {
      devLog("[SWITCH NETWORK ERROR]", "No chainId provided")
      return false
    }
    
    devLog("[Switch?]", evmChainId, chainId)
    if (evmChainId === chainId) return true
    
    try {
      devLog("[SWITCH NETWORK]", `Switching from [${evmChainId}] to [${chainId}]...`)
      const r = await switchChainAsync({ chainId })
      devLog("[SWITCH NETWORK DONE]", r)
      return true
    } catch (error) {
      console.error("[SWITCH NETWORK ERROR]", error)
      return false
    }
  }

  useEffect(() => {
    if (!isLoginWindowOpen) {
      setSolanaLoginOpen(false)
      setEvmLoginOpen(false)
      setIsSigningMessage(false)
    }
  }, [isLoginWindowOpen])

  useEffect(() => {
    devLog('[EVM] Connected:', isConnectedEVM)

    if (!isConnectedEVM) {
      devLog("[EVM]", "Disconnected!")
      // Only remove EVM auth when explicitly disconnected
      if (userAuth && isEvm(userAuth.chainId)) {
        removeEvmAuth()
        setUserAuth(null)
      }
    }

    if (isConnectedEVM && evmLoginOpen) {
      // Check if network is defined and has a valid ID before attempting to switch
      if (network?.id) {
        if (evmChainId !== network.id) {
          devLog("[Switch Network]", `Switch network to ${network.id}...`)
          switchEvmNetwork(network.id)
            .then(() => {
              handleEvmWallet(network.id)
            })
            .catch(er => {
              console.error("[Switch Network]", er)
              setIsSigningMessage(false)
              setEvmLoginOpen(false)
            })
        } else {
          handleEvmWallet(network.id)
        }
      } else {
        // If network is not defined, use the current chain ID or default to a fallback
        const chainIdToUse = evmChainId || 1 // Default to Ethereum mainnet if nothing else is available
        devLog("[No network defined] Using current chain:", chainIdToUse)
        handleEvmWallet(chainIdToUse)
      }
    }

  }, [isConnectedEVM, evmLoginOpen, network?.id])

  useEffect(() => {
    devLog('[SOLANA] Connected:', isConnectedSolana)

    if (isConnectedSolana && solanaLoginOpen) {
      handleSolanaWallet()
    }
  }, [isConnectedSolana, solanaLoginOpen])

  useEffect(()=> {
    devLog("[evmChainId]", evmChainId)
  }, [evmChainId])

  useEffect(()=> {
    if (!network) return
    devLog('[Casino Network Changed]', network)
    initUser(true)
  }, [network])

  useEffect(()=> {
    if (balancesLoading) return
    devLog('[Casino Token Changed]', token)
    const bal = token ? findTokenBalance(token?.address) : null
    setTokenBalance(bal)
  }, [token, balancesLoading])

  useEffect(() => {
    devLog('[token balance Changed]', tokenBalance)
  }, [tokenBalance])

  useEffect(() => {
    if (!router.isReady || !networksCache) return

    devLog('/[Network]', router.query?.network, network)
    devLog('/[Token]', router.query?.token, token)

    console.log("[DEBUG] router.pathname", router.pathname)


    // Set network and token if available
    const x = getNetworkFromName(router.query?.network)

    if (x) {
      setNetwork(x)
      localStorage.setItem("chainId", x.id)
    }

    if (x && router?.query?.token) {
      setCasinoAsync(x.id, router.query?.token)
      return
    }

    // Set default network
    if (!x && !network) {
      devLog('[Set Default Network]')
      setNetwork(getNetworkFromId(1))
      setToken(networksCache?.ethereum?.[0]?.token)
      localStorage.setItem("chainId", "1")
    }

    // Set default token
    if (x && !router.query?.token) {
      devLog('[Set Default Token]')
      setToken(networksCache[x?.name]?.[0]?.token)
    }

    // Reset casino when navigating to /casinos or /casinos/[network]
    if (router.pathname === '/casinos' || router.pathname === '/casinos/[network]') {
      console.log("[DEBUG] Resetting casino")
      setCasino(null)
      setToken(null)
    }

  }, [router.isReady, networksCache, router.query?.network, router?.query?.token, router.pathname])

  useEffect(() => {
    if (user) refreshBalances()
  }, [user])

  useEffect(() => {
    initCasinos()

    // Clear auth on load if structure changed
    if (!getAuth()) {
      disconnectEVM()
      disconnectSolana()
    }
  }, [])

  useEffect(() => {
    if (!router.isReady) return

    const { ref } = router.query
    if (ref) {
      localStorage.setItem("REF", ref)
    }
  }, [router.isReady, router.query?.ref])

  return (
    <BaseContext.Provider value={{
      findCasino,
      findTokenBalance,
      findTokenById,
      getNetworkFromName,
      refreshBalances,
      searchToken,
      searchTokens,
      setIsLoginWindowOpen,
      setNetworkTokens,
      signIn,
      signOut,
      updateBalance,
      setShowDepositModal,
      setDepositToken,
      setEvmLoginOpen,
      setSolanaLoginOpen,
      depositToken,
      showDepositModal,
      balances,
      balancesLoading,
      casino,
      casinoError,
      casinosCache,
      casinoLoading,
      casinosLoading,
      isConnected,
      isConnectedEVM,
      isConnectedSolana,
      isConnectingUser: isConnectingEVM,
      isLoginWindowOpen,
      isSigningMessage,
      network,
      networkError,
      networks,
      networksCache,
      networkTokens,
      token,
      tokensCache,
      tokenBalance,
      user,
      userAuth,
      userLoading,
    }}>
      {children}
    </BaseContext.Provider>
  );
}
