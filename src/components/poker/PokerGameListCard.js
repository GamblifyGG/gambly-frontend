import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PokerGameListCard = ({pokerGameObj}) => {


    const router = useRouter();
    const [game, setGame] = useState(pokerGameObj);


    return (<div className="grid grid-cols-4 gap-1">
        <span className="bg-gray text-center flex items-center justify-center border border-lightgray text-[10px]">Holdem Poker - {game?.TableID}</span>
        <span className="bg-gray text-center flex items-center justify-center border border-lightgray text-green">1/{game?.MaxPlayers}</span>
        <span className="bg-gray text-center flex items-center text-xs justify-center border border-lightgray">{game?.SmallBlinds + ' ' + game?.TokenSymbol}/{game.BigBlinds + " " + game?.TokenSymbol}</span>
        <div className="bg-gray text-center p-1 flex items-center justify-center border border-lightgray">
            <div
                onClick={() => {
                    let casinoAddress = router.query.token;
                    let network = router.query.network;
                    router.push(`/casinos/${network}/${casinoAddress}/poker/${game?.TableID}`);
                }}
                className="bg-green text-xs px-2 border border-lightgray w-full hover:text-white hover:opacity-75 transition-all cursor-pointer text-gray">
                Join
            </div>
        </div>
    </div>);
}

export default PokerGameListCard;