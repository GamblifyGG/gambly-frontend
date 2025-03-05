const { useContext } = require("react");

const FoldButton = ({ isCurrentPlayer = false, validActions, currentPlayer, socket }) => {
    const foldAction = async () => {
        try {
            await socket.emitWithAck('poker:act', { action: 'fold' })
        } catch (e) {
            console.error(e)
        }

    }

    if (!isCurrentPlayer || !validActions || !validActions.includes('fold')) {
        return (
            <div className="bg-red cursor-not-allowed opacity-20 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
                FOLD
            </div>
        );
    }

    return (
        <div onClick={() => {
            foldAction();
        }} className="bg-red cursor-pointer hover:opacity-70 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
            FOLD
        </div>
    );
}

export default FoldButton;