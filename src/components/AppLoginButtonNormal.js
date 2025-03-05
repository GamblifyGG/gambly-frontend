import { useEffect } from "react"
// import { useWeb3Modal } from '@web3modal/wagmi/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"


const AppLoginButtonNormal = () => {
    // const { open, close } = useWeb3Modal()
    

    useEffect(() => {
        // console.log('test', connect)
    }, [])

    return (
        <div onClick={() => {
            // open()
        }} className="w-auto text-lightgray hover:opacity-75 h-8 cursor-pointer flex items-center ">
            <span className="px-4 text-[9px] lg:text-xs h-full bg-secondary rounded-3xl border items-center flex justify-center text-center border-dark-250 gap-1">Connect <FontAwesomeIcon icon={faWallet}></FontAwesomeIcon></span>
        </div>
    )
}

export default AppLoginButtonNormal;