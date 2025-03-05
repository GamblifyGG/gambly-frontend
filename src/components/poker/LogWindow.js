import { AutoScrollContainer } from "react-auto-scroll-container";
import dynamic from 'next/dynamic';
const PokerChatMessage = dynamic(() => import('@/components/poker/ChatMessage'), {
    loading: () => <p>Loading...</p>,
    ssr: false
})

const LogWindow = ({ pokerMessages }) => {
    return (<div className='bg-darkgray w-full lg:w-1/2 border-t border-r border-l border-b border-lightgray h-full relative'>
        <div className='odd:bg-gray even:bg-darkgray overflow-y-auto h-[calc(100%-0px)] w-full relative'>
            <AutoScrollContainer percentageThreshold={10} className='absolute w-full h-full bg-dark-700'>
                {pokerMessages.map((message, index) => {
                    return <PokerChatMessage from={message.from} time={message.time} key={index} message={message.message}></PokerChatMessage>
                })}
            </AutoScrollContainer>
        </div>
    </div>
    );
}

export default LogWindow;