import { useContext, useEffect, useRef, useState } from "react";
import { useSpring, animated } from 'react-spring';

const Cards = ({ isPlayer = false, winnerCards, handFolded, targetRef, playername, hand, playerSat, currentHand, card1dealt, card2dealt, cardsDealt, seat }) => {
    const [thisCardRef, setThisCardRef] = useState(null);

    const [cardStyle, cardStyleApi] = useSpring(() => ({
        // to: { opacity: 1, transform: 'translate(0px, 0px)' },
        // from: { opacity: 1, transform: 'translate(0px, 0px)' }
    }));

    const [card1Style, card1StyleApi] = useSpring(() => ({
        from: { opacity: 0, top: '70px' },
    }));

    const [card2Style, card2StyleApi] = useSpring(() => ({
        from: { opacity: 0, top: '70px' },
    }));

    const [isFolding, setIsFolding] = useState(false);

    // hand is when is the hand visible for everyone.
    // currentHand is when the hand is visible for the player.

    // const cardsRef = useRef(null);


    const [thisCard1Winner, setThisCard1Winner] = useState(false);
    const [thisCard2Winner, setThisCard2Winner] = useState(false);

    const card1ref = useRef(null);
    const card2ref = useRef(null);
    const [anim1Done, setAnim1Done] = useState(false)
    const [anim2Done, setAnim2Done] = useState(false)

    const cardSizes = {
        width: '50px',
        height: '50px',
        lgWidth: '50px',
        lgHeight: '50px'
    }

    const cardSizesNotMine = {
        width: '30px',
        height: '30px',
        lgWidth: '30px',
        lgHeight: '30px'
    }

    useEffect(() => {
        if (!winnerCards.length) {
            setThisCard1Winner(false);
            setThisCard2Winner(false);
        }
    }, [winnerCards])

    useEffect(() => {
        if (!cardsDealt) {
            setAnim1Done(false)
            setAnim2Done(false)
            card1StyleApi.start({
                to: { opacity: 0, top: '70px', scale: 0 },
                config: { duration: 0 }
            });
            card2StyleApi.start({
                to: { opacity: 0, top: '70px', scale: 0 },
                config: { duration: 0 }
            });
        }

        if (!anim1Done && (card1dealt || cardsDealt)) {
            setAnim1Done(true)
            setThisCard1Winner(false);
            card1StyleApi.start({
                from: { opacity: 0, top: '70px', scale: 0 },
                to: { opacity: 1, top: '0px', scale: 1 },
                delay: 300,
                config: { duration: 300 }
            });
        }

        if (!anim2Done && (card2dealt || cardsDealt)) {
            setAnim2Done(true)
            setThisCard2Winner(false);
            card2StyleApi.start({
                from: { opacity: 0, top: '70px' },
                to: { opacity: 1, top: '0px' },
                delay: 600,
                config: { duration: 300 }
            });
        }
    }, [card2dealt, card1dealt, cardsDealt])

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
        if (handFolded === true) {
            // console.log("HAND FOLDED", card1ref)
            if (card1ref.current !== null) {
                // console.log("HAND FOLDED", card1ref.current)
                setIsFolding(true);
                setTimeout(() => {
                    moveCard1ToTarget()
                    moveCard2ToTarget()
                }, 200)
            }
        } else {
            // console.log("HAND NOT FOLDED")
            cardStyleApi.start({
                to: { opacity: 1, transform: 'translate(0px, 0px)' },
                from: { opacity: 0 },
                config: { duration: 200 }
            });
        }
    }, [handFolded])

    // useEffect(() => {
    //     console.log("Checkiong current hand", currentHand)
    //     for (let i = 0; i < currentHand.length; i++) {
    //         let rank = currentHand[i]._rank;
    //         let suit = currentHand[i]._suit;
    //         let cards = winnerCards.map((card) => {
    //             return fixRankAndSuit(card.rank, card.suit);
    //         });
    //         for (let j = 0; j < cards.length; j++) {
    //             if (rank === cards[j].rank && suit === cards[j].suit) {
    //                 console.log("WINNER CARD FOUND", cards[j], currentHand[i])
    //             }
    //         }
    //     }
    // }, [winnerCards, currentHand])


    useEffect(() => {
        if (winnerCards?.length && hand?.length) {
            console.log("Checking hand: hand", hand)
            console.log("Checking hand: cards", winnerCards)

            const card1Won = winnerCards.some(x => x.rank === hand[0].rank && x.suit === hand[0].suit)
            const card2Won = winnerCards.some(x => x.rank === hand[1].rank && x.suit === hand[1].suit)

            console.log("Checking hand:", card1Won, card2Won)

            setThisCard1Winner(card1Won)
            setThisCard2Winner(card2Won)

            // for (let i = 0; i < hand.length; i++) {
            //     let rank = hand[i].rank;
            //     let suit = hand[i].suit;

            //     suit = suit === 'clubs' ? 'C' : suit === 'diamonds' ? 'D' : suit === 'hearts' ? 'H' : 'S';
            //     rank = rank === 'T' ? '10' : rank;

            //     let cards = winnerCards.map((card) => {
            //         return fixRankAndSuit(card.rank, card.suit);
            //     });
            //     console.log("CARDS", cards)

            //     for (let j = 0; j < cards.length; j++) {
            //         if (rank === cards[j].rank && suit === cards[j].suit) {
            //             console.log("WINNER CARD FOUND", cards[j], hand[i], i)
            //             if (i === 0) {
            //                 setThisCard1Winner(true);
            //             } else {
            //                 setThisCard2Winner(true);
            //             }
            //         }
            //     }
            // }
        }
    }, [winnerCards, hand])

    const moveCard1ToTarget = () => {
        const targetRect = targetRef.current.getBoundingClientRect();
        const movingRect = card1ref.current.getBoundingClientRect();
        // get the position of the card
        // console.log("Rects", targetRect, movingRect)
        let deltaX = targetRect.left - movingRect.left;
        let deltaY = targetRect.top - movingRect.top;

        deltaY = deltaY + targetRect.height / 2;
        deltaX = deltaX + targetRect.width / 2 - movingRect.width / 2;

        // console.log("X", x, "Y", y)
        // get the difference in y
        card1StyleApi.start({
            to: { transform: `translate(${deltaX}px, ${deltaY}px) !important` },
            from: { transform: `translate(0px, 0px) ` },
            config: { duration: 200 }
        });

        setTimeout(() => {
            card1StyleApi.start({
                to: { opacity: 0 },
                from: { opacity: 1 },
                config: { duration: 200 }
            });
        }, 200)
    }

    const moveCard2ToTarget = () => {
        const targetRect = targetRef.current.getBoundingClientRect();
        const movingRect = card2ref.current.getBoundingClientRect();
        // get the position of the card
        // console.log("Rects", targetRect, movingRect)
        let deltaX = targetRect.left - movingRect.left;
        let deltaY = targetRect.top - movingRect.top;

        deltaY = deltaY + targetRect.height / 2;
        deltaX = deltaX + targetRect.width / 2 - movingRect.width / 2;

        // console.log("X", x, "Y", y)
        // get the difference in y
        card2StyleApi.start({
            to: { transform: `translate(${deltaX}px, ${deltaY}px)` },
            from: { transform: `translate(0px, 0px)` },
            config: { duration: 200 }
        });

        setTimeout(() => {
            card2StyleApi.start({
                to: { opacity: 0 },
                from: { opacity: 1 },
                config: { duration: 400 }
            });
            setTimeout(() => {
                setIsFolding(false);
            }, 500)
        }, 200)
    }
    const AnimatedCard = animated.img;

    const Card = ({ cardID, cardRef, cardHidden = false, cardInfo, style }) => (
        cardHidden ?
            <AnimatedCard
                ref={cardRef}
                src={`/cards/set1/gray_back.png`}
                className={`block relative w-[30px] ${isFolding === false ? cardID === 2 ? '!rotate-6 z-[999999]' : '!-rotate-6 -mr-2' : ''} lg:w-[50px] border-2 ${thisCard1Winner === true ? 'border-green' : 'border-gray'} rounded-md`}
                style={style}
            />
            :
            <AnimatedCard
                ref={cardRef}
                src={`/cards/set1/${cardInfo.rank}${cardInfo.suit}.png`}
                className={`block relative w-[30px] ${isFolding === false ? cardID === 2 ? '!rotate-6 z-[999999]' : '!-rotate-6 -mr-2' : ''} lg:w-[50px] border-2 ${cardID === 1 && thisCard1Winner === true ? 'border-green' : 'border-gray'} ${cardID === 2 && thisCard2Winner === true ? 'border-green' : 'border-gray'} rounded-md`}
                style={style}
                onClick={() => {
                    console.log("CLICKED")
                    if (cardID === 1) {
                        // add backround color
                    } else {

                    }
                }}
            />
    );

    const VisibleCards = ({ card1Rank, card1Suit, card2Rank, card2Suit }) => {

        card1Rank = fixRankAndSuit(card1Rank, card1Suit).rank;
        card1Suit = fixRankAndSuit(card1Rank, card1Suit).suit;

        card2Rank = fixRankAndSuit(card2Rank, card2Suit).rank;
        card2Suit = fixRankAndSuit(card2Rank, card2Suit).suit;

        return (
            <div onClick={() => {
                // moveCardToTarget(cardsRef);
            }} className="flex w-[30px] lg:w-[50px] items-center justify-center">
                <Card cardID={1} cardRef={card1ref} cardInfo={{ rank: card1Rank, suit: card1Suit }} style={card1Style} />
                <Card cardID={2} cardRef={card2ref} cardInfo={{ rank: card2Rank, suit: card2Suit }} style={card2Style} />
            </div>
        );
    }

    const HiddenCards = () => {
        return (
            <div onClick={() => {
                // moveCardToTarget(cardsRef);
            }} className="flex w-[30px] lg:w-[50px] items-center justify-center scale-75">
                <Card cardID={1} cardRef={card1ref} cardHidden={true} style={card1Style} />
                <Card cardID={2} cardRef={card2ref} cardHidden={true} style={card2Style} />
            </div>
        );
    }

    if (hand !== null && hand.length == 2) {
        return (
            <VisibleCards card1Rank={hand[0].rank} card1Suit={hand[0].suit} card2Rank={hand[1].rank} card2Suit={hand[1].suit} />
        );
    }

    if (playerSat && (!hand || !hand.length)) {
        return (
            <HiddenCards />
        );
    }
}

export default Cards;