import { formatUnits } from "viem";
const { useContext } = require("react");

const BetButton = ({ isCurrentPlayer = false, validActions, currentPlayer, socket, type, raiseAmountMin, raiseAmountMax, raiseAction, setRaiseAmount, setRaiseWindowOpen, raiseWindowOpen, token }) => {

    const betActionMax = async () => {
        try {
            console.log('poker:act', { action: type, bet: raiseAmountMin })
            await socket.emitWithAck('poker:act', { action: type, bet: raiseAmountMax })
        } catch (e) {
            console.error(e)
        }
    }

    if (!isCurrentPlayer && validActions && validActions.includes(type)) {
        return (
            <div className="bg-green flex-col dark text-dark cursor-not-allowed opacity-20 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
                {type === 'bet' ? 'BET' : 'RAISE'}
            </div>
        );
    }

    return (
        !raiseWindowOpen &&
            raiseAmountMin.toString() === raiseAmountMax.toString() ?
                <div onClick={() => {
                    setRaiseAmount(raiseAmountMax);
                    betActionMax();
                }} className="bg-green flex-col dark text-dark cursor-pointer hover:opacity-70 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
                    {raiseAmountMax.toString() === '0' ? 'RAISE (ALL IN)' : 'RAISE'}
                    <span className="text-[7px]">({formatUnits(raiseAmountMax, token?.decimals)})</span>
                </div>
            :
            <div onClick={() => {
                setRaiseWindowOpen(true);
            }} className="bg-green text-dark dark cursor-pointer hover:opacity-70 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
                {type === 'bet' ? 'BET' : 'RAISE'}
            </div>
    );
}

export default BetButton;