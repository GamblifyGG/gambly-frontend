const RaiseButton = ({ socket, raiseAmountMin, raiseAmountMax, setRaiseAmount, raiseWindowOpen, setRaiseWindowOpen }) => {
    return (
        !raiseWindowOpen &&
            raiseAmountMin === raiseAmountMax ?
            <div onClick={() => {
                setRaiseAmount(raiseAmountMax);
                raiseAction();
            }} className="bg-green flex-col dark text-dark cursor-pointer hover:opacity-70 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
                Call (ALL IN)
                <span className="text-[7px]">({Number(raiseAmountMax) === 0 ? '0' : Number(raiseAmountMax).toFixed(8)})</span>
            </div>
            :

            <div onClick={() => {
                setRaiseWindowOpen(true);
            }} className="bg-green text-dark dark cursor-pointer hover:opacity-70 w-1/3 lg:w-[200px] h-14 p-2 items-center justify-center flex rounded-xl ">
                RAISE
            </div>
    );
}

export default RaiseButton;