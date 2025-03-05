const { useContext } = require("react");

const CallButton = ({ isCurrentPlayer = false, validActions, currentPlayer, socket, raiseAmountMin, raiseAmountMax }) => {


    const callAction = async () => {
        try {
            console.log('poker:act', { action: 'call' })
            socket.emitWithAck('poker:act', { action: 'call' })
        } catch (e) {
            console.error(e)
        }
    }

    if (!isCurrentPlayer || !validActions || !validActions.includes('call')) {
        return (
            <div className="bg-blue text-dark cursor-not-allowed opacity-20 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
                CALL
            </div>
        );
    } else {
        return (
            <div onClick={() => {
                callAction();
            }} className="bg-blue text-dark cursor-pointer hover:opacity-70 w-1/3 lg:w-[200px]  h-14 p-2 items-center justify-center flex rounded-xl ">
                {raiseAmountMax.toString() === '0' ? 'CALL (ALL-IN)' : 'CALL'}
            </div>
        );
    }
}

export default CallButton;