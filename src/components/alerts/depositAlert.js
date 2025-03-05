const DepositAlert = ({ amount, tokenName, tokenSymbol }) => {
    return (
        <div id="alert-1" className="flex bg-green rounded-full hover:bg-gold border-gold cursor-pointer transition-all text-xs items-center p-4 mt-2 text-blue-800" role="alert">
            Your deposit of {amount} ${tokenSymbol} has been received!
        </div>);
}

export default DepositAlert;