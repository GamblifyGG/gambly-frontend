import { useContext } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet, faRefresh } from "@fortawesome/free-solid-svg-icons"
import { BaseContext } from '@/context/BaseContext'

const AppLoginButton = () => {
    const { signIn, user, userAuth, userLoading, isConnectedEVM, isConnectedSolana, } = useContext(BaseContext)

    return (
        <div className="flex items-center gap-2 text-sm capitalize">
            {(!user || (userAuth.isEvm && !isConnectedEVM) || (userAuth.isSolana && !isConnectedSolana)) && 
                <div
                    onClick={() => signIn()}
                    className="w-full text-lightgray hover:opacity-75 h-8 cursor-pointer flex items-center justify-end"
                >
                    <span className="px-4 text-[9px] lg:text-xs h-full bg-secondary rounded-3xl border items-center flex justify-center text-center border-dark-250 gap-1">
                        {
                            userLoading ? <FontAwesomeIcon icon={faRefresh} className="animate-spin" />
                            : <>Connect <FontAwesomeIcon icon={faWallet} /></>
                        }
                    </span>
                </div>
            }
        </div>
    )
}

export default AppLoginButton