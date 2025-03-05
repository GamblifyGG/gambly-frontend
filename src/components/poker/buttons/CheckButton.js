const { useContext } = require("react");


const CheckButton = ({ isCurrentPlayer = false, validActions, currentPlayer, socket }) => {

    const checkAction = async () => {
        try {
            await socket.emitWithAck('poker:act', { action: 'check' })
        } catch (e) {
            console.error(e)
        }

    }
    if (isCurrentPlayer && validActions && validActions.includes('check')) {
        return (<div onClick={() => {
            checkAction();
        }} className="bg-primary text-dark cursor-pointer hover:opacity-70 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
            CHECK
        </div>);
    } else {
        return (<div className="bg-primary text-dark cursor-not-allowed opacity-20 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
            CHECK
        </div>);
    }
}

export default CheckButton;