import { useContext } from "react"
import { BaseContext } from "@/context/BaseContext"
import { Iconify } from "@/components/common"
import { twMerge } from "tailwind-merge";

const Notice =  ({ token, className }) => {
  const { network } = useContext(BaseContext);

  if (!token || network?.id === token?.network?.id) return null

  const defaultClasses = "rounded-lg border border-primary bg-primary/10 flex gap-3 items-start text-sm py-2 px-3 mb-4";
  const mergedClasses = twMerge(defaultClasses, className);

  return (
    <div className={mergedClasses}>
      <Iconify icon="ooui:alert" className="text-primary text-lg relative top-1" />
      <div>
        <h5 className="font-bold mb-0 text-primary">This Token is on a different Network!</h5>
        <p>Please login with your {token?.network?.name} wallet to continue...</p>
      </div>
    </div>
  )
}

export default Notice;