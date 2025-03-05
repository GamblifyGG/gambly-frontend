import { useContext } from "react"
import { BaseContext } from "@/context/BaseContext"
import { Iconify } from "@/components/common"
import { twMerge } from "tailwind-merge";

const Notice =  ({ className, setLowBal = () => {} }) => {
  const { tokenBalance, token, balancesLoading } = useContext(BaseContext);

  if (balancesLoading || Number(tokenBalance?.balance) > 0) {
    setLowBal(false)
    return null
  }

  setLowBal(true)

  const defaultClasses = "rounded-lg border border-primary bg-primary/10 flex gap-3 items-start text-sm py-2 px-3 mb-4";
  const mergedClasses = twMerge(defaultClasses, className);

  return (
    <div className={mergedClasses}>
      <Iconify icon="ooui:alert" className="text-primary text-lg relative top-1" />
      <div>
        <h5 className="font-bold mb-0 text-primary">You do not have enough {token?.symbol} in your balance!</h5>
        <p>Please deposit more to continue...</p>
      </div>
    </div>
  )
}

export default Notice;