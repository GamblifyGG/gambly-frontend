import { useState, useEffect, useContext, useRef } from "react"
import Link from "next/link"
import { Iconify, Icon } from "@/components/common"
import { BaseContext } from "@/context/BaseContext"
import { useRouter } from "next/router";
import NetworkSelector from "./NetworkSelector"
import AppLogin from "./AppLoginButton"
import HeaderSearch from "./HeaderSearch"
import LoginWindow from './loginwindow/LoginWindow';
import HeaderBalance from '@/components/bank/HeaderBalance'
import toNetworkImg from '@/utils/convertNetworkToImage'
import { BalanceAlerts } from '@/components/alerts/balanceAlert'
import AvatarDarkBg from './AvatarDarkBg';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { network, token, user, userAuth } = useContext(BaseContext)
  const router = useRouter()
  const [menu1, setMenu1] = useState([])
  const [menu2, setMenu2] = useState([])
  const [searchIsFocused, setSearchIsFocused] = useState(false)
  const [walletVisible, setWalletVisible] = useState(false);

  const getHomeLink = () => {
    if (token?.address && network) {
      if (token?.address !== null && network !== null) {
        return `/casinos/${network?.name}/${token?.address}`
      } else {
        return '/casinos'
      }
    } else {
      return '/casinos'
    }
  }

  const isActive = (path) => {
    return router?.pathname === path
  }

  useEffect(() => {
    if (!router.isReady) return
    console.log('[PATH]', router.pathname)
    console.log('[TOKEN]', token)

    const _menu1 = [
      { label: "Home", href: `/casinos/${network?.name}`, icon: "home2", size: "25px", active: isActive("/casinos/[network]") },
      { label: "Poker", href: `/casinos/${network?.name}/${token?.address}/poker`, icon: "cards", size: "25px", active: isActive("/casinos/[network]/[token]/poker") },
      { label: "Coinflip", href: `/casinos/${network?.name}/${token?.address}/coinflip`, icon: "coin", size: "25px", active: isActive("/casinos/[network]/[token]/coinflip") },
      { label: "Rock Paper Scissors", href: `/casinos/${network?.name}/${token?.address}/rockpaperscissors`, icon: "rps", size: "25px", active: isActive("/casinos/[network]/[token]/rockpaperscissors") },
    ]

    const _menu2 = [
      { label: "Wallet", href: `/bank`, icon: "wallet2", size: "25px", active: isActive("/bank") },
      { label: "Referrals", href: `/referrals`, icon: "users", size: "25px", active: isActive("/referrals") },
    ]

    setMenu1(p => _menu1)
    setMenu2(p => _menu2)
  }, [router.pathname, network, token])

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] ">
      <div className="bg-gradient-to-r from-[#161820] to-[#1d1e27] h-[60px] lg:h-[80px] relative px-4 flex items-center gap-2">
        <Link className="header-brand block" href={`/casinos/${network?.name}`}>
          <img src="/logo-letter.png" alt="G" className="block object-contain h-10" />
        </Link>

        <HeaderSearch reportIsFocused={setSearchIsFocused} />

        <NetworkSelector className={searchIsFocused ? 'hidden lg:flex' : 'flex'} />

        <div className={`${searchIsFocused ? 'hidden lg:flex' : 'flex'} ml-auto items-center gap-2`}>
          <AppLogin />
          <HeaderBalance />

          { user &&
            <div
              onClick={() => {
                console.log("Opening account")
                goToAcc();
              }}
              onMouseLeave={() => setWalletVisible(false)}
              onMouseEnter={() => setWalletVisible(true)}
              className='border relative cursor-pointer hover:opacity-80 flex rounded-full border-bordergray h-[50px] bg-dark w-[50px] items-center justify-center'
            >
              <AvatarDarkBg playername={user?.id} size="35" />
              { userAuth?.chainId && <img src={toNetworkImg(userAuth?.chainId)} alt={userAuth?.chainId} className="absolute top-0 right-[-5px] w-[10px] h-auto"/> }
              <div className={`${walletVisible ? 'flex' : 'hidden'} absolute bg-dark p-2 border-bordergray border z-50 rounded-full -bottom-10 right-0 text-[10px]`}>
                {user.wallet_address}
              </div>
            </div>
          }
        </div>

        <button onClick={()=> setShowMenu(!showMenu)} className="block lg:hidden">
          { showMenu ?
          <Iconify icon="ic:round-close" className="text-[26px]"/> :
          <Iconify icon="mynaui:menu" className="text-[26px]"/>
          }
        </button>
      </div>

      <div className={`${showMenu ? '' : 'hidden lg:flex'} flex flex-col bg-gradient-to-b from-[#1d1e27] to-[#13141b] absolute left-0 top-[60px] lg:top-[80px] w-full lg:w-[80px] h-[calc(100vh-60px)] lg:h-[calc(100vh-80px)]`}>
        <div className="py-2 lg:w-full lg:flex lg:flex-col lg:items-center">
          {
            menu1.map((x, i) => (              
            <Link onClick={() => setShowMenu(false)} key={i} href={x.href} className="group flex items-center lg:justify-center px-4 py-2 gap-4" data-active={x.active}>
              <div className={`${x.active ? 'lg:bg-[#373a46]' : ''} rounded-xl w-[25px] h-auto lg:w-[50px] lg:h-[50px] lg:flex items-center justify-center`}>
                <Icon name={x.icon} size={x.size} className={`group-hover:text-white ${x.active ? 'text-primary lg:text-white' : 'text-white/50'}`} />
              </div>
  
              <span className={`${x.active ? 'text-white' : 'text-white/40 group-hover:text-white'} block lg:hidden font-medium`}>{x.label}</span>
              { x.active && <span className="absolute right-[-6px] h-[12px] w-[12px] rounded-full bg-primary"></span> }
            </Link>
            ))
          }
        </div>

        <div className="border-t border-gray py-2 lg:mt-auto lg:w-full lg:flex lg:flex-col lg:items-center">
          {
            menu2.map((x, i) => (              
            <Link onClick={() => setShowMenu(false)} key={i} href={x.href} className="group flex items-center lg:justify-center px-4 py-2 gap-4" data-active={x.active}>
              <div className={`${x.active ? 'lg:bg-[#373a46]' : ''} rounded-xl w-[25px] h-auto lg:w-[50px] lg:h-[50px] lg:flex items-center justify-center`}>
                <Icon name={x.icon} size={x.size} className={`group-hover:text-white ${x.active ? 'text-primary lg:text-white' : 'text-white/50'}`} />
              </div>
  
              <span className={`${x.active ? 'text-white' : 'text-white/40 group-hover:text-white'} block lg:hidden font-medium`}>{x.label}</span>
              { x.active && <span className="absolute right-[-6px] h-[12px] w-[12px] rounded-full bg-primary"></span> }
            </Link>
            ))
          }
        </div>
      </div>
      <LoginWindow></LoginWindow>
      <BalanceAlerts />
    </header>
  )
}

export default Header;
