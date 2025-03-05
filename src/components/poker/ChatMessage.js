const PokerChatMessage = ({message = 'Test', time, from}) => {
    return (<div className='odd:bg-gray p-1 gap-2 h-auto even:bg-darkgray grid grid-cols-[auto_1fr]'>
        {/* time */}
        <div className='flex h-full items-center'>
            <span className='text-white text-[10px] p-1 rounded-md'>{time}</span>
        </div>
        <div className='flex h-full border-lightgray p-1'>
            <span className={`text-[10px] ${from === 'Dealer' ? 'text-green' : 'text-white'}`}>{message}</span>
        </div>
    
    </div>);
}

export default PokerChatMessage;