import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

const PokerCardMain = ({ winnerCards, rank, suit }) => {
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { duration: 500 },
        // You can add a delay or other configurations as needed
    });

    const [cardWinner, setCardWinner] = useState(false);

    const fixRankAndSuit = (rank, suit) => {
        if (rank === 'T') {
            rank = '10';
        }
        if (suit === 'clubs') {
            suit = 'C';
        } else if (suit === 'diamonds') {
            suit = 'D';
        }
        else if (suit === 'hearts') {
            suit = 'H';
        }
        else if (suit === 'spades') {
            suit = 'S';
        }
        return { rank, suit };
    }

    useEffect(() => {
        // Normalize current card's values first
        const normalizedCard = fixRankAndSuit(rank, suit);
        
        if (winnerCards.length > 0) {
            const isWinner = winnerCards.some(card => {
                const normalizedWinnerCard = fixRankAndSuit(card.rank, card.suit);
                return (
                    normalizedWinnerCard.rank === normalizedCard.rank &&
                    normalizedWinnerCard.suit === normalizedCard.suit
                );
            });
            
            setCardWinner(isWinner);
        } else {
            setCardWinner(false);
        }
    }, [winnerCards, rank, suit]);

    return (<animated.div style={fadeIn}>
        <div className="justify-center items-center flex h-full w-full">
            <img src={`/cards/set1/${rank + String(suit).toUpperCase()}.png`} className={`h-1/2 max-h-[100px] border-2 object-contain rounded-md ${cardWinner ? 'border-green' : 'border-gray'}`}></img>
        </div>
    </animated.div>);
}

export default PokerCardMain;