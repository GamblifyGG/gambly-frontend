// FontAwesome
import { useEffect, useState } from 'react';
import React, { useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { formatUnits } from 'viem';
import Cards from './Cards';
import PlayerChips from './PlayerChips';
import PlayerPot from './PlayerPot';
import SeatBackground from './SeatBack';
import { useAnimate } from "framer-motion"
import { useCountUp } from 'react-countup';

const actionColor = {
    "fold": "bg-red",
    "check": "bg-primary",
    "call": "bg-blue",
    "raise": "bg-secondary",
    "bet": "bg-secondary"
}


const Seat = ({ setPlayerCountdownRem, status, bet, isMe, seatUser, canJoin, ended, action, card1Dealt, card2Dealt, didJoin, user, hand, winners, winnerCards, token, setSitWindow, allHands, resetChips, gatherChips, foldedSeats, cardsDealt, seatRef, targetRef, playersInGame, bigBlind, smallBlind, seatIndex, cards, playerCountdown, currentPlayer, seat, player, playername, playerChips = 0, playerSat, round }) => {
    
    const isPlayer = user ? user.wallet_address === playername : false

    const [tokenLogo, tokenDecimals, tokenSymbol] = [token.logo, token.decimals, token.symbol]

    // console.log(`[SEAT COMP ${seat}]`, isPlayer, hand)
    // console.log({ winnerCards, winnerName, winnerAmount, winners, tokenLogo, tokenDecimals, tokenSymbol, setSitWindow, allHands, resetChips, gatherChips, foldedSeats, cardsDealt, seatRef, targetRef, playersInGame, bigBlind, smallBlind, seatIndex, cards, playerCountdown, currentPlayer, seat, player, playername, playerChips, playerSat })
    // context

    const [loggedInUserSeat, setLoggedInUserSeat] = useState(null);
    const [thisSeatsPot, setThisSeatsPot] = useState(null);
    const controls = useAnimation();
    const [handFolded, setHandFolded] = useState(false);
    const [currentHand, setCurrentHand] = useState([]);

    const [card1dealt, setCard1Dealt] = useState(null);
    const [card2dealt, setCard2Dealt] = useState(null);

    const thisPotRef = useRef(null);

    const card1ref = useRef(null);
    const card2ref = useRef(null);
    const [playerPotRef, animate] = useAnimate()


    const [isItMyTurn, setIsItMyTurn] = useState(false);

    const [winnerBlink, setWinnerBlink] = useState(false);

    // const [tokenDecimal, setTokenDecimal] = useState(tokenDecimals);
    const countUpRef = useRef(null);


    const [seatStatus, setSeatStatus] = useState(null);


    const [currentWinner, setCurrentWinner] = useState(null);
    const [currentWinningAmount, setCurrentWinningAmount] = useState(null);

    const [displayedAction, setDisplayedAction] = useState(null);

    const [isRefunded, setIsRefunded] = useState(false);

    const isWaitingForNextHand = playerSat && status === "playing" && !card1Dealt && !card2Dealt;

    const smallifyAddress = (address) => {
        return address.slice(0, 3) + '...' + address.slice(-3);
    }

    useEffect(() => {
        if (playersInGame) {
            // console.log('playersInGame', playersInGame)
            let totalPlayers = 0;
            playersInGame.forEach((p, index) => {
                if (p !== null) {
                    totalPlayers++;
                    // console.log(playername, p)
                    if (playername === p.id) {
                        if (p.betSize !== undefined && p.betSize !== null) {
                            if (p.betSize > 0) {
                                // console.log("This user bet: ", p.betSize)
                                setThisSeatsPot(p.betSize)
                            }
                        }
                    }
                }
            })


            if (totalPlayers === 1 && playerSat === true) {
                setSeatStatus('Waiting for players');
            } else {
                setSeatStatus(null);
            }

        }
    }, [playersInGame, playerSat, playername])


    const moveToTarget = () => {
        if (playerPotRef.current === null || targetRef.current === null) {
            // console.log("Ref not found")
            return;
        }
        // console.log("Moving to target", playerPotRef.current, targetRef.current)
        const targetRect = targetRef.current.getBoundingClientRect();
        const movingRect = playerPotRef.current.getBoundingClientRect();

        let deltaX = targetRect.left - movingRect.left;
        let deltaY = targetRect.top - movingRect.top;

        deltaY = deltaY + targetRect.height / 2;
        deltaX = deltaX + targetRect.width / 2 - movingRect.width / 2;


        animate(playerPotRef.current, {
            x: deltaX,
            y: deltaY,
            transition: { duration: 1, ease: "easeInOut" },
            backgroundColor: 'red',
            position: 'absolute',
        });

        setTimeout(() => {
            if (playerPotRef.current !== null) {
                animate(playerPotRef.current, {
                    x: 0,
                    y: 0,
                    transition: { duration: 0 },
                });
            }
            setThisSeatsPot(0);
        }, 1000);


        // thisPotRef.current.style.position = 'absolute';
        // thisPotRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        // thisPotRef.current.style.transition = 'all 0.3s ease-in-out';


        // useAnimationControls.start({
        //     x: deltaX,
        //     y: deltaY,
        //     transition: { duration: 0.5, ease: "easeInOut" },
        //     backgroundColor: 'red',
    };



    useEffect(() => {
        if (hand && Array.isArray(hand) && hand.length === 2) {
            setCurrentHand(hand);
            // Set both cards as dealt if we have a hand
            setCard1Dealt(true);
            setCard2Dealt(true);
        } else if (cards && Array.isArray(cards) && cards.length === 2) {
            if (cards[0] !== null && cards[1] !== null) {
                setCurrentHand(cards);
            }
        }
    }, [cards, hand]);

    // Add effect to handle folded state
    useEffect(() => {
        const isFolded = status === "folded" || foldedSeats.includes(seat);
        setHandFolded(isFolded);
    }, [status, foldedSeats, seat]);


    useEffect(() => {
        if (gatherChips !== false && gatherChips !== null && gatherChips !== undefined) {
            moveToTarget();
        }
    }, [gatherChips !== false && gatherChips !== null && gatherChips !== undefined, gatherChips, moveToTarget])


    useEffect(() => {
        if (resetChips !== false && resetChips !== null && resetChips !== undefined) {
            setThisSeatsPot(0);
            // here is where we need to do animation.
        }
    }, [resetChips])

    useEffect(() => {
        if (winners) {
            // Sort winners by strength to get the actual winner(s)
            const sortedWinners = [...winners.winners].sort((a, b) => b.strength - a.strength);
            const highestStrength = sortedWinners[0]?.strength;
            
            const winnerInfo = winners.winners.find(x => x.seat === seat);
            
            if (winnerInfo) {
                // Check if this is an actual winner (has highest strength)
                const isActualWinner = winnerInfo.strength === highestStrength;
                
                // Check if this is a refunded player (in winners array but not highest strength)
                const isRefundedPlayer = !isActualWinner && winnerInfo.payout > 0;
                
                setWinnerBlink(isActualWinner);
                setIsRefunded(isRefundedPlayer);
            } else {
                setWinnerBlink(false);
                setIsRefunded(false);
            }
        } else {
            setWinnerBlink(false);
            setIsRefunded(false);
        }
    }, [winners, seat])


    const { start, pauseResume, reset, update } = useCountUp({
        ref: countUpRef,
        start: 0,
        end: 10,
        // decimalPlaces: 2,
        decimals: 8,
        delay: 1000,
        duration: 2.5,
        onReset: () => console.log('Resetted!'),
        onUpdate: () => console.log('Updated!'),
        onPauseResume: () => console.log('Paused or resumed!'),
        // onStart: ({ pauseResume }) => console.log(pauseResume),
        onEnd: ({ pauseResume }) => console.log(pauseResume),
    });



    useEffect(() => {
        if (currentWinner !== null && currentWinningAmount !== null) {
            if (currentWinner === playername) {
                let winAmt = formatUnits(currentWinningAmount, tokenDecimals);
                reset();
                console.log("Updated Winning amount to: ", winAmt)
                update(Number(winAmt));
                setTimeout(() => {
                    setCurrentWinner(null);
                    setCurrentWinningAmount(null);
                }, 10000)
            }
        } else {
            reset();
        }
    }, [currentWinner, currentWinningAmount])


    const playCountdownSound = () => {
        let audio = new Audio('/sounds/your-turn-alarm.wav');
        audio.play();
    }

    const playersInGameCount = () => {
        let count = 0;
        playersInGame.forEach((player) => {
            if (player !== null) {
                count++;
            }
        })
        return count;
    }


    const amIInGame = () => {
        // checks if the user is in game, and if so, returns the seat number if i have a hand
        // console.log("Players in game", playersInGame)
        if (playersInGame && playersInGame.length > 0) {
            let mySeat = null;
            let dealtCards = false;
            playersInGame.forEach((player, index) => {
                if (player !== null) {
                    if (player.id === playername) {
                        mySeat = index;
                        if (player.dealt === true) {
                            dealtCards = true;
                        }
                    }
                }
            })
            return dealtCards;
        }
    }

    // Update displayedAction when action prop changes
    useEffect(() => {
        setDisplayedAction(action);
    }, [action]);

    // Clear displayed action when round changes
    useEffect(() => {
        setDisplayedAction(null);
    }, [round?.round]);

    // Helper function to check if player should show cards
    const shouldShowCards = () => {
        // Show cards if:
        // 1. Player has a hand (their own cards)
        if (hand && Array.isArray(hand) && hand.length === 2) return true;
        
        // 2. Player is in game and cards have been dealt
        if (status === "playing" && cardsDealt) return true;
        
        // 3. Player is in the current game (has been dealt cards)
        const playerInGame = playersInGame?.find(p => p?.id === playername);
        if (playerInGame?.dealt) return true;

        return false;
    };

    return (
        <div ref={seatRef} className={`${player} ${isMe? 'top-[30px]': ''} flex ${ended && !winnerBlink ? 'opacity-20' : ''} ${status == 'left' ? 'opacity-30' : ''} items-center z-50  h-full px-1 lg:px-4 justify-center flex-col relative w-full`}>
            {playerSat &&
                <>
                    <div className='absolute z-50 text-xs px-4 bg-green text-dark rounded-full'>
                        {currentWinner !== null && currentWinningAmount !== null && String(currentWinner).toLowerCase() === String(playername).toLowerCase() &&
                            <div className='flex'>
                                <span>+</span>
                                <div ref={countUpRef} />
                            </div>
                        }
                    </div>

                    {isRefunded && (
                        <div className='flex absolute z-[60000] -top-2 transition-all text-dark bg-blue border-bordergray items-center justify-center font-bold text-[9px] p-1 rounded-md'>
                            REFUNDED
                        </div>
                    )}

                    {isWaitingForNextHand && (
                        <div className='absolute inset-0  flex items-center justify-center z-[60000]'>
                            <div className='text-white border border-white/10  bg-darkgray text-xs text-center bg-black/50 px-2 py-1 rounded'>
                                Waiting for next round...
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        { displayedAction &&
                            <motion.div
                                initial= {{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`${actionColor[displayedAction]} rounded-lg lh-1 text-white capitalize absolute top-[-50px] text-xs z-[999] py-[1px] px-4`}
                            >
                                {displayedAction}
                            </motion.div>
                        }
                    </AnimatePresence>

                    <div className={`player1Cards absolute flex items-center justify-center w-full h-auto }`}>
                        <>
                            {amIInGame() === true && handFolded === true && playersInGameCount() >= 2 &&
                                <SeatBackground setPlayerCountdownRem={setPlayerCountdownRem} seat={seat} canJoin={canJoin} isPlayer={didJoin} amIWinner={winnerBlink} folded={true} />
                            }
                        </>

                        { bet &&
                        <>
                        <PlayerPot moveToTarget={moveToTarget} thisPotRef={playerPotRef} player={player} playername={playername} thisSeatsPot={bet?.betSize} tokenDecimals={tokenDecimals} tokenLogo={tokenLogo} />
                        <PlayerChips isMe={isMe} user={seatUser} smallBlind={smallBlind} bigBlind={bigBlind} playerChips={bet?.stack} logo={token?.logo} tokenDecimals={tokenDecimals} tokenSymbol={tokenSymbol} />
                        </>
                        }
                        {handFolded === true &&
                            <div className='flex absolute z-[60000] -top-2 transition-all text-dark bg-primary border-bordergray items-center justify-center font-bold text-[9px] p-1 rounded-md'>
                                FOLDED
                            </div>
                        }
                        {
                            status === "busted" &&
                            <div className='flex absolute z-[60000] -top-2 transition-all text-white bg-red border-bordergray items-center justify-center font-bold text-[9px] p-1 rounded-md'>
                                BUSTED
                            </div>
                        }
                        <SeatBackground setPlayerCountdownRem={setPlayerCountdownRem} seat={seat} canJoin={canJoin} isPlayer={didJoin} amIWinner={winnerBlink} playername={playername} playerCountdown={playerCountdown} currentPlayer={currentPlayer} playerSat={playerSat} folded={false} />
                    </div>
                    <div className='flex items-center justify-center z-[20] absolute -top-[10px] lg:-top-[40px] lg:hover:-top-[60px] transition-all'>
                        {shouldShowCards() && (
                            <Cards
                                isPlayer={isPlayer}
                                winnerCards={winnerCards}
                                handFolded={handFolded}
                                targetRef={targetRef}
                                playername={playername}
                                hand={hand}
                                playerSat={playerSat}
                                card1ref={card1ref}
                                card2ref={card2ref}
                                card1dealt={card1Dealt}
                                card2dealt={card2Dealt}
                                currentHand={currentHand}
                                seat={seat}
                                cardsDealt={cardsDealt}
                            />
                        )}
                    </div>
                </>
            }

            {!playerSat &&
                <SeatBackground setPlayerCountdownRem={setPlayerCountdownRem} canJoin={canJoin} isPlayer={didJoin} amIWinner={winnerBlink} playername={null} playerCountdown={playerCountdown} currentPlayer={currentPlayer} setSitWindow={setSitWindow} seat={seat} playerSat={playerSat} folded={null} />
            }
            {/* <div className="absolute z-10 inset-0">{seat}</div> */}
        </div>);
}

export default Seat;