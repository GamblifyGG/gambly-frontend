import { useState, useContext, useEffect } from "react"
import { BaseContext } from "@/context/BaseContext"
// animal icon
import AvatarDarkBg from "@/components/AvatarDarkBg"

export default function UserWindow() {
    const { user, signOut, setIsLoginWindowOpen } = useContext(BaseContext)

    useEffect(() => {
        console.log('[USER]', user)
    }, [user])
    return <div className="flex flex-col">
        <div className="flex items-center justify-center gap-2 flex-col">
            <AvatarDarkBg playername={user.wallet_address} size="100" />
            <span className="text-lightgray text-xs">{user?.wallet_address}</span>
            {/* <div className="flex w-full items-center justify-center mt-4">
                <button
                    // onClick={() => setIsLoginWindowOpen(false)}
                    className="w-full hover:border-primary flex-col border border-bordergray  p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition duration-300"
                >
                    Action Button
                </button>
            </div> */}
            <button
                onClick={() => {
                    signOut()
                    setIsLoginWindowOpen(false)
                }}
                className="w-full hover:border-primary flex-col border border-bordergray  p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition duration-300"
            >
                Sign Out
            </button>
        </div>
    </div>
}
