import { useRouter } from 'next/router'
import { useState } from 'react'
import useStateRef from 'react-usestateref'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from "react-toastify";
import { formatUnits, parseUnits } from 'viem'
import Swal from 'sweetalert2'
import { useContext, useEffect, useRef, createRef } from 'react'
import io from 'socket.io-client'
import Head from "next/head";
import BigNumber from 'bignumber.js';

import { getLayout } from '@/components/CasinoLayout'
import { Button } from '@/components/form'
import { BaseContext } from '@/context/BaseContext'
import Seat from '@/components/poker/Seat'
import PokerCardMain from '@/components/poker/pokerCardMain'
import { convertNetworkNameToId } from '@/utils/convertNetworkID'
import { devLog } from '@/utils/common'
import ImagePreloader from '@/components/poker/ImagePreloader'
import { getPokerTable } from '@/api'
import BetButtons from "@/components/poker/BetButtons"
import { Iconify, CopyLinkButton } from "@/components/common"
import CasinoLoader from "@/components/CasinoLoader"
import { toWebsiteUrl } from "@/utils/toWebsiteUrl"

const smallifyAddress = (address) => {
    return address.slice(0, 3) + '...' + address.slice(-3);
}

const Poker = () => {
    const [interacted, setInteracted] = useState(false);
    const router = useRouter()
    const { room } = router.query
    const targetRef = useRef(null);

    const { user, userAuth, token, setShowDepositModal, tokenBalance, casinoError, casinoLoading } = useContext(BaseContext);
    const userRef = useRef(user)

    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    const [currentPlayer, setCurrentPlayer, currentPlayerRef] = useStateRef(null);
    const [communityCards, setCommunityCards, communityCardsRef] = useStateRef([null, null, null, null, null]);
    const [validActions, setValidActions] = useState([]);
    const [playerCountdown, setPlayerCountdown, playerCountdownRef] = useStateRef(null);
    const [playerCountdownRem, setPlayerCountdownRem, playerCountdownRemRef] = useStateRef(null);

    const [myCards, setMyCards] = useState([null, null]);

    const [button, setButton] = useState(null);
    const [smallBlind, setSmallBlind] = useState(10);
    const [bigBlind, setBigBlind] = useState(20);


    const [playersInGame, setPlayersInGame] = useState([]);
    const playersRef = useRef([])

    const [betAmount, setBetAmount] = useState(0);
    const [betAmountMax, setBetAmountMax] = useState(0);
    const [betAmountMin, setBetAmountMin] = useState(0);
    const [betWindowOpen, setBetWindowOpen] = useState(false);


    const [raiseAmount, setRaiseAmount] = useState(0);
    const [raiseAmountMax, setRaiseAmountMax] = useState(0);
    const [raiseAmountMin, setRaiseAmountMin] = useState(0);
    const [raiseWindowOpen, setRaiseWindowOpen] = useState(false);


    const [foldedSeats, setFoldedSeats] = useState([]);
    const [gatherChips, setGatherChips] = useState(false);
    const [resetChips, setResetChips] = useState(false);

    const [currentPot, setCurrentPot] = useState(0);

    const currentPotRef = useRef(null);


    const [initialLoad, setInitialLoad] = useState(true);
    const [deckVisible, setDeckVisible] = useState(false);
    const [allHands, setAllHands] = useState(null);
    const [moveTimeLimit, setMoveTimeLimit] = useState(0);

    const [playersToStandUp, setPlayersToStandUp] = useState([]);


    const [infoMessage, setInfoMessage] = useState(null);
    const [winningMessage, setWinningMessage] = useState(null);
    const [roundTimer, setRoundTimer] = useState(0)
    const [roundTimerKey, setRoundTimerKey] = useState(0)

    const [pokerMessages, setPokerMessages, pokerMessagesRef] = useStateRef([
        {
            message: "Welcome to the poker table",
            time: new Date().toLocaleTimeString(),
            from: "Dealer"
        },
        {
            message: "Good luck",
            time: new Date().toLocaleTimeString(),
            from: "Dealer"
        },
    ]);

    const roomLink = () => toWebsiteUrl(`casinos/${router.query?.network}/${router.query?.token}/poker/${router.query?.room}`)

    const logs = useRef([])

    const playAudio = (audio) => {
        try {
            if (!interacted) return;

            const sounds = {
                'allin': '/sounds/bet.mp3',
                'bet': '/sounds/bet.mp3',
                'call': '/sounds/call.mp3',
                'check': '/sounds/check.mp3',
                'deal': '/sounds/deal.mp3',
                'timer': '/sounds/timer.mp3',
                'turn': '/sounds/your-turn.mp3',
                'win': '/sounds/win-sound.mp3',
                'fold': '/sounds/fold.mp3',
            }

            if (!sounds[audio]) return

            const audioToPlay = new Audio(sounds[audio]);

            audioToPlay.onerror = function () {
                console.error('The audio file could not be loaded!')
            }

            audioToPlay.play();
        } catch (e) {
            console.error(e)
        }
    }

    const seatRefs = useRef([...Array(10)].map(() => createRef(null)));
    const cardDealRefs = useRef([...Array(20)].map(() => createRef(null)));
 
    const [seatsFolded, setSeatsFolded] = useState([]);

    const [casino, setCasino] = useState(null);

    const [sitWindow, setSitWindow] = useState(false);
    const [winnerCards, setWinnerCards] = useState([]);
    const [table, setTable] = useState(null)
    const [seats, setSeats, seatsRef] = useStateRef([])
    const [players, setPlayers] = useState([])
    const [hands, setHands, handsRef] = useStateRef({})
    const [prompt, setPrompt, promptRef] = useStateRef(null)
    const [cardsDealt, setCardsDealt, cardsDealtRef] = useStateRef(false)
    
    const [mySeat, setMySeat] = useState(null)
    const [winners, setWinners] = useState(null);
    const [round, setRound, roundRef] = useStateRef({ round: null, communityCards: [], pot: null })
    const [activePlayer, setActivePlayer] = useState(null)
    const [notification, setNotification] = useState(null)

    const [mainMessage, setMainMessage] = useState(null)
    const [myTurn, setMyTurn] = useState(false)
    const [joining, setJoining] = useState(false)
    const [starting, setStarting] = useState(false)
    const [started, setStarted] = useState(false)
    const [ended, setEnded] = useState(false)
    const [handEnded, setHandEnded] = useState(false)
    const [error, setError] = useState(null)
    const [closed, setClosed] = useState(false)

    const si = useRef(null)
    const sock = useRef(null)
    const timerAudio = useRef(null)

    const toastOpts = { theme: "colored", closeButton: false, progress: false, icon: false, position: "bottom-right" }

    const getWinningMessage = (hand, playerName) => {
        switch (hand) {
            case "HIGH_CARD": return `${playerName} won with High Card!`;
            case "PAIR": return `${playerName} won with a Pair!`;
            case "TWO_PAIR": return `${playerName} won with Two Pair!`;
            case "THREE_OF_A_KIND": return `${playerName} won with Three of a Kind!`;
            case "STRAIGHT": return `${playerName} won with a Straight!`;
            case "FLUSH": return `${playerName} won with a Flush!`;
            case "FULL_HOUSE": return `${playerName} won with a Full House!`;
            case "FOUR_OF_A_KIND": return `${playerName} won with Four of a Kind!`;
            case "STRAIGHT_FLUSH": return `${playerName} won with a Straight Flush!`;
            case "ROYAL_FLUSH": return `${playerName} won with a Royal Flush!`;
            case "ONLY_ONE_PLAYER_LEFT": return `${playerName} won as the last player standing!`;
            default: return `${playerName} won!`;
        }
    };

    async function getTable(chain_id, token_address, id) {
        devLog('[GET Table]', { chain_id, token_address, id })
        const [er, data] = await getPokerTable({ chain_id, token_address, id })

        if (er) {
            console.error('[GET Table]', er)
            let msg = er?.error || er?.details || er?.message || 'Error fetching game'
            if (er?.error === "VALIDATION_ERROR") {
                msg = "Invalid game link!"
            }
            setError(msg)
            return null
        }

        console.log(data)
        if (data?.ended) {
            setClosed(true)
            return
        }

        devLog('[GET Table]', data)
        setTable(data)
    }

    function toPlayer({seat, bet, status, user}) {
        return {
            betSize: bet?.betSize * 1,
            dealt: status !== 'free',
            id: user.wallet_address,
            seatIndex: seat,
            stack: bet?.stack * 1,
            totalChips: bet?.totalChips * 1,
            cards: [],
            hand: [],
            status,
            seat
        }
    }

    function getPlayer(seatIndex) {
        return playersRef.current.find(p => p.seat === seatIndex)
    }

    function getSeat(seatIndex) {
        return seatsRef.current.find(p => p.seat === seatIndex)
    }

    function updatePlayers(data) {
        const players = data.filter(x => x.user !== null)
                            .map(x => toPlayer(x))

        playersRef.current = players
        setPlayers(players)
        setPlayersInGame(players)

        const me = data.find(x => x?.user?.wallet_address === user?.wallet_address)
        if (me) setMySeat(me.seat)

        const p = players.find(x => x.status == "playing")
        setCurrentPlayer(p ? p.id : null)
        // devLog('[players updated]', playersRef)

        if (table && !table?.started && players.length < 2) {
            const m = 'At least 2 players needed to start game...'
            setMainMessage(m)
            setRound(null)
            setWinningMessage(null)
            setCardsDealt(false)
            setCommunityCards([])
            setWinners(null)
            setWinnerCards([])
            setFoldedSeats([])
            setCurrentPot(0)
            setCurrentPlayer(null)
            setPrompt(null)
        }
    }

    function iamPlayer() {
        return user?.wallet_address && seatsRef.current.some(x => x?.user?.wallet_address === user?.wallet_address)
    }

    function canJoin() {
        return (user && user?.wallet_address) && !seatsRef.current.some(x => x.isMe)
    }

    function getMySeat() {
        return seatsRef.current.find(x => x.isMe)
    }

    function getFreeSeat() {
        return seatsRef.current.find(x => !x?.user)?.seat
    }

    function isMySeat(seatIndex) {
        const me = getMySeat()
        if (!me) return false
        return me.seat === seatIndex
    }

    function isMyTurn() {
        const me = getMySeat()
        if (!me || !prompt) return false
        return me.seat === prompt.seat
    }



    function playCountDown(ms) {
        if (!interacted) return

        if (timerAudio.current) clearTimeout(timerAudio.current)
        const minMs = 4000
        if (ms < minMs) return

        const tillMs = ms - minMs

        timerAudio.current = setTimeout(()=> {
            playAudio('timer')
            clearTimeout(timerAudio.current)
        }, tillMs)
    }

    function onPrompt(data) {
        setPrompt(data)
        const p = getSeat(data.seat)
        if (!p) return

        const minBet = BigNumber(data.chipRange.min)
        const userMax = BigNumber(p.bet.stack)
        let maxBet = BigNumber(data.chipRange.max)
        maxBet = maxBet.isGreaterThan(userMax) ? userMax : maxBet

        setBetAmountMin(minBet);
        setBetAmountMax(maxBet);
        setRaiseAmountMin(minBet);
        setRaiseAmountMax(maxBet);

        if (si.current) {
            clearTimeout(si.current)
            si.current = null
        }

        setActivePlayer(p.user?.wallet_address)
        let m = parseInt(data.time)
        setPlayerCountdown(m)
        setValidActions(data.actions)

        if (isMySeat(data.seat)) playCountDown(m * 1000)

        si.current = setTimeout(() => {
            setActivePlayer(null)
            setValidActions([])
            setPrompt(null)
        }, m * 1000)

        // si.current = setInterval(()=> {
        //     m--
        //     // setPlayerCountdown(m)
        //     if (m === 0) {
        //         clearInterval(si.current)
        //     }
        // }, 1000)
    }

    useEffect(()=> {
        // devLog('[PROMPT CHANGED]', prompt)
        devLog('[MY TURN]', isMyTurn())
        setMyTurn(isMyTurn())
        if (isMyTurn()) playAudio('turn')
        if (!prompt) setRaiseWindowOpen(false)
    }, [prompt])


    function updatePlayer(data) {
        devLog('updatePlayer', data)
        const p = playersRef.current.find(x => x.seatIndex == data.seat)
        devLog(playersRef.current, p)
        if (!p) return
        setCurrentPlayer(p.id)
    }

    function resetTable() {
        setWinningMessage(null)
        setCardsDealt(false)
        setCommunityCards([])
        setWinners(null)
        setWinnerCards([])
        setFoldedSeats([])
        setCurrentPot(0)
        setCurrentPlayer(null)
        setPrompt(null)
        setSeats(prev => prev.map(x => ({ 
            ...x,
            hand: getHand(x.seat),
            card1Dealt: false, 
            card2Dealt: false,
            isMe: x.user?.wallet_address === userRef.current?.wallet_address,
            action: null,
            payout: null,
            ranking: null,
            winnerCards: [],
            bigBlind: null,
            smallBlind: null
        })))
    }

    function onRound(data) {
        const normalizeCards = (cards) => cards.map(card => {
            let suit = card.suit;
            if (suit === 'clubs') suit = 'C';
            if (suit === 'diamonds') suit = 'D';
            if (suit === 'hearts') suit = 'H';
            if (suit === 'spades') suit = 'S';
            return { 
                rank: card.rank === 'T' ? '10' : card.rank,
                suit: suit
            };
        });

        const cards = normalizeCards(data.communityCards);
        devLog('[COMMUNITY CARDS]', cards)
        setCommunityCards(cards)
        setCurrentPot(data.pot.size * 1)

        if (data.round === 'preflop') {
            setHandEnded(false)
            resetTable()
            setTimeout(() => {
                dealHands()
            }, 100);
        } else {
            setCardsDealt(true)
        }

        if (round?.round !== data.round) {
            const msg = `Here comes the ${data.round}`
            toast.info(msg, toastOpts)
        }

        setRound(data)
    }

    function getHand(seatIndex) {
        return handsRef.current[seatIndex] || null
    }

    function onHand(data) {
        setHands(p => {
            p[data.seat] = data.hand
            return p
        })

        playersRef.current = playersRef.current.map(x => {
            return x.seatIndex == data.seat ? {...x, hand: data.hand } : x
        })

        setSeats(prev => {
            return prev.map(x => {
                return x.seat == data.seat ? {...x, hand: data.hand } : x
            })
        })

        const cards = data.hand.map(x => ({
            _rank: x.rank,
            _suit: x.suit[0].toUpperCase()
        }))

        setMyCards(cards)
    }

    function onWinners(data) {
        if (!data?.winners?.length) return;

        const normalizeCards = (cards) => (cards || []).map(card => {
            let suit = card.suit;
            if (suit === 'clubs') suit = 'C';
            if (suit === 'diamonds') suit = 'D';
            if (suit === 'hearts') suit = 'H';
            if (suit === 'spades') suit = 'S';
            return { 
                rank: card.rank === 'T' ? '10' : card.rank,
                suit: suit
            };
        });

        // Sort winners by strength
        const sortedWinners = [...data.winners].sort((a, b) => b.strength - a.strength);
        const highestStrength = sortedWinners[0]?.strength;
        
        // Split winners into actual winners and refunded players
        const actualWinners = data.winners.filter(w => w.strength === highestStrength);
        const refundedPlayers = data.winners.filter(w => w.strength < highestStrength && w.payout > 0);

        // Update winners state with normalized cards
        const winningCards = normalizeCards(actualWinners[0]?.cards || []);
        setWinners({
            ...data,
            winners: actualWinners,
            refunded: refundedPlayers,
            winningCards: winningCards
        });

        if (data?.communityCards) {
            setCommunityCards(data.communityCards);
        }
        // Update winner cards state separately to ensure it's always set
        setWinnerCards(winningCards);

        // Update seats with normalized winner cards
        setSeats(prev => {
            return prev.map(p => {
                const winner = actualWinners.find(w => w.seat === p.seat);
                return {
                    ...p,
                    winnerCards: winner ? normalizeCards(winner.cards || []) : [],
                    payout: winner ? winner.payout : p.payout,
                    ranking: winner ? winner.ranking : p.ranking
                };
            });
        });

        // Create combined message for winners and refunds
        let msg = '';
        
        if (actualWinners.length > 0) {
            const isTie = actualWinners.length > 1;
            
            if (isTie) {
                msg = `${actualWinners.length} players tied${actualWinners[0]?.ranking ? ` with ${actualWinners[0].ranking}` : ''}!`;
            } else {
                const winner = actualWinners[0];
                const playerName = winner.user.ens_name || smallifyAddress(winner.user.wallet_address);
                const ranking = winner.ranking ? winner.ranking.toUpperCase() : 'HAND';
                msg = getWinningMessage(ranking, playerName);
            }

            // Add refund information to the message if there are any
            if (refundedPlayers.length > 0) {
                const refundMsgs = refundedPlayers.map(player => {
                    const playerName = player.user.ens_name || smallifyAddress(player.user.wallet_address);
                    return `${playerName} received a refund of ${formatUnits(player.payout, token.decimals)} ${token.symbol}`;
                });
                
                msg += ` | ${refundMsgs.join(' and ')}`;
            }
            
            setWinningMessage(msg);
            setInfoMessage(msg);
            toast.success(msg, { theme: 'colored', closeButton: false, position: 'bottom-right' });
        }

        playAudio('win');
    }

    function onSeats(data) {
        // Initial structure
        if (!seatsRef.current.length) {

            setSeats(() => data.seats.map(x => (
                {
                    ...x, 
                    hand: null,
                    card1Dealt: false, 
                    card2Dealt: false,
                    isMe: x.user?.wallet_address === userRef.current?.wallet_address,
                    action: null,
                    payout: null,
                    ranking: null,
                    winnerCards: [],
                    smallBlind: data?.blinds?.small?.seat === x.seat ? data.blinds.small.amount : null,
                    bigBlind:  data?.blinds?.big?.seat === x.seat ? data.blinds.big.amount : null,
                })
            ))
            devLog('[INITIAL SEATS]', data.seats)
            return
        }

        setSeats(() => {
            return seatsRef.current.map(x => {
                const updt = data.seats.find(d => d.seat === x.seat)

                if (updt) {
                    if (x.status !== "playing" && updt.status === "playing") {
                        toast.success("New player joined!", toastOpts)
                    }

                    const isPlaying = updt?.user && ["playing", "folded", "busted", "left"].includes(updt?.status)
                    
                    if (!isPlaying) {
                        setHands(p => {
                            p[updt?.seat] = null
                            return p
                        })
                    }

                    return {
                        ...x,
                        ...updt,
                        user: isPlaying ? updt.user : null,
                        isMe: updt.user?.wallet_address === userRef.current?.wallet_address,
                        card1Dealt: isPlaying ? x.card1Dealt : false, 
                        card2Dealt: isPlaying ? x.card2Dealt : false,
                        action: isPlaying ? x.action : null,
                        hand: isPlaying ? x.hand : null,
                        payout: isPlaying ? x.payout : null,
                        ranking: isPlaying ? x.ranking : null,
                        winnerCards: isPlaying ? x.winnerCards : [],
                        ...data?.blinds ? {
                            smallBlind: data?.blinds?.small?.seat === x.seat ? data.blinds.small.amount : null,
                            bigBlind:  data?.blinds?.big?.seat === x.seat ? data.blinds.big.amount : null,
                        } : {}
                    }
                }


                return x
            })
        })
    }

    function onAuth(data) {
        // setUser(data.user)
    }

    function onCountdown(sec, ctx = "") {
        console.log('[COUNTDOWN]', ctx, sec)
        // Abort countdown
        if (!sec) {
            setRoundTimerKey(Date.now())
            setRoundTimer(0)
            return
        }
        setRoundTimerKey(Date.now())
        setRoundTimer(sec)
    }

    useEffect(() => {
        if (user) userRef.current = user
    }, [user])

    useEffect(() => {
        if (starting) setInfoMessage('Game starting soon..')
    }, [starting])

    useEffect(() => {
        setJoining(players.length < 2 && !ended)
        setStarting(players.length > 1 && round?.round == null)
        setStarted(players.length > 1 && round?.round != null)

        if (players.length === 0 && ended) {
            resetTable()
        }
    }, [players])

    // if we exit the page, give warning message that we are about to leave the table (if we're sitting at a table)
    useEffect(() => {
        const exitingFunction = (url) => {
          if (iamPlayer()) {
            // Prevents the route from changing immediately
            Swal.fire({
              title: 'Are you sure?',
              text: "You are sitting at the table, are you sure you want to leave?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, leave!'
            }).then((result) => {
              if (result.isConfirmed) {
                router.events.off('routeChangeStart', exitingFunction);
                router.push(url);
              } else {
                router.events.emit('routeChangeError'); 
                throw 'Route change aborted by the user';
              }
            });
            
            // Throw an error to prevent the route change immediately
            throw 'Blocking route change for confirmation';
          }
        };
    
        router.events.on('routeChangeStart', exitingFunction);
    
        return () => {
          router.events.off('routeChangeStart', exitingFunction);
        };
      }, [router]);

    async function sit(seat) {
        try {
            console.log('[poker:sitDown]', { seat, bet: table.buy_in_min })
            await sock.current.emitWithAck('poker:sitDown', {
                seat,
                bet: table.buy_in_min
            })
        } catch (e) {
            console.error(e)
        }
    }

    const dealHands = async () => {
        if (cardsDealtRef.current) return

        if (!promptRef.current) setInfoMessage('Here are your cards...')
        devLog('[DEAL HANDS]')
        setDeckVisible(true)
        setCardsDealt(false)

        const joined =  seatsRef.current.filter(x => x.user != null)

        setTimeout(async () => {
            for (let j of joined) {
                const index = j.seat
                let targetRef = getRefForSeat(index);
                let refForCard = getrefforcard(index);
                let refForCard2 = getrefforcard(index + 1);

                playAudio('deal')
                await moveToTarget(targetRef, refForCard, index + 1, 1)
                setSeats(prev => {
                    return prev.map((x,i) => i == index ? {...x, card1Dealt: true} : x)
                })

                playAudio('deal')
                await moveToTarget(targetRef, refForCard2, index + 1, 2)
                devLog('[DEAL HANDS]', index)
                setSeats(prev => {
                    return prev.map((x,i) => i == index ? {...x, card2Dealt: true} : x)
                })
            }

            setCardsDealt(true);
            setDeckVisible(false);
        }, 1000)

    }

    const leaveTable = async () => {
        try {
            if (!confirm('Are you sure you want to leave the table?')) return
            console.log('[poker:standUp]', user?.wallet_address)
            await sock.current.emitWithAck('poker:standUp')
        } catch (e) {
            console.error(e)
        }
    }

    const getMyPlayersSeat = (players, address) => {
        let returning = null;
        players.forEach((player) => {
            // devLog("Player", player)
            if (player !== null) {
                if (String(player.id).toLowerCase() === String(address).toLocaleLowerCase()) {
                    returning = Number(player.seatIndex) + 1;

                }
            }
        })
        return returning;
    }

    const getClassNameForPokerContainer = () => {
        let returning = 'pokerContainer-seat1';
        if (user) {
            let playerSeat = getMyPlayersSeat(playersInGame, user?.wallet_address);
            // devLog("My player seat", playerSeat);

            if (playerSeat !== null) {
                returning = "pokerContainer-seat" + playerSeat;
            } else {
                returning = "pokerContainer-seat1";
            }
        } else {
            returning = "pokerContainer-seat1";
        }
        return returning;
    }

    const distributeWinningsToPlayers = (playerIndexes, totalPot) => {
        // if (window is loaded only then)
        if (typeof window === 'undefined') {
            return;
        }
        playerIndexes.forEach((seatIndex, index) => {
            // Create a clone of the pot for each player
            const potClone = currentPotRef.current.cloneNode(true);
            document.body.appendChild(potClone);

            // Style the cloned pot
            potClone.style.position = 'absolute';
            potClone.style.left = `${currentPotRef.current.getBoundingClientRect().left}px`;
            potClone.style.top = `${currentPotRef.current.getBoundingClientRect().top}px`;

            // Calculate the winnings for each player
            const winnings = totalPot / playerIndexes.length;

            // Update the cloned pot with the winnings amount (you might want to add text or something similar)
            // potClone.textContent = `${winnings}`; // Uncomment and modify according to your needs
            const firstDiv = potClone.querySelector('div:first-child');
            if (firstDiv) {
                firstDiv.textContent = formatUnits(winnings, casino.token?.decimals); // Replace 'New Text' with the text you want to set
            }
            // Move the cloned pot to the player's seat
            let targetRef = getRefForSeat(seatIndex);
            if (!targetRef) return; // Error handling if targetRef is null

            const targetRect = targetRef.current.getBoundingClientRect();
            const movingRect = potClone.getBoundingClientRect();

            let deltaX = targetRect.left - movingRect.left + targetRect.width / 2 - movingRect.width / 2;
            let deltaY = targetRect.top - movingRect.top + targetRect.height / 2 - movingRect.height / 2;

            potClone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            potClone.style.transition = 'all 1s ease-in-out';

            // Remove the cloned pot after the animation is complete
            setTimeout(() => {
                potClone.remove();
            }, 1000);
        });

        // Reset the current pot
        setCurrentPot(0);
    }

    const moveToTarget = (inputTarget, refTarget, seat, card) => {
        // devLog('[MOVE]', inputTarget, refTarget, seat, card)
        return new Promise((resolve, reject) => {

            const targetRect = inputTarget.current?.getBoundingClientRect();
            const movingRect = refTarget.current?.getBoundingClientRect();

            if (!targetRect || !moveToTarget) {
                resolve()
                return
            }

            // devLog('Target Rect:', targetRect);
            // devLog('Moving Rect:', movingRect);

            // devLog('Target Rect:', targetRect);
            // devLog('Moving Rect:', movingRect);
            let initialPosition = {
                x: refTarget.left,
                y: refTarget.top
            };

            let deltaX = targetRect.left - movingRect.left;
            let deltaY = targetRect.top - movingRect.top;

            // Calculate the distance to move it to the center of the target

            const xDistance = targetRect.left - refTarget.left + (targetRect.width / 2) - (refTarget.width / 2);
            const yDistance = targetRect.top - refTarget.top + (targetRect.height / 2) - (refTarget.height / 2);
            // devLog(xDistance, yDistance)
            // add some top to the yDistance
            deltaY = deltaY + targetRect.height / 2;
            deltaX = deltaX + targetRect.width / 2 - movingRect.width / 2;

            // replace movingRects with refTarget with pure css
            refTarget.current.style.position = 'absolute';
            refTarget.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            refTarget.current.style.transition = 'all 0.3s ease-in-out';
            // once the animation is complete, remove the animation and fade out the card
            setTimeout(() => {
                refTarget.current.style.transform = 'translate(0px, 0px)';
                refTarget.current.style.transition = 'none';
                // move back to initial position
                refTarget.current.style.position = 'absolute';
                refTarget.current.style.transform = `translate(${initialPosition.x}px, ${initialPosition.y}px)`;
                refTarget.current.style.transition = 'none';
                // 
                // devLog(cardsDealtsRef.current)

                resolve();
            }, 300);
        })

    };

    let getrefforcard = (index) => {
        return cardDealRefs.current[index]
    }

    let getRefForSeat = (index) => {
        return seatRefs.current[index]
    }

    useEffect(() => {
        if (winners?.winners) {
            const realWinners = winners.winners.filter(x => x.hasOwnProperty("ranking"))

            if (winners.winners.length === 0) {
                const msg = 'No winners this round!'
                setWinningMessage(msg)
                setInfoMessage(msg)
                toast.success(msg, { theme: 'colored', progress: false, closeButton: false, position: 'bottom-right' })
                setHands({})
                setEnded(true)
                return
            }

            if (!realWinners.length && winners.winners.length) {
                const msg = 'Remaining player wins!'
                setWinningMessage(msg)
                setInfoMessage(msg)
                toast.success(msg, { theme: 'colored', progress: false, closeButton: false, position: 'bottom-right' })
                setHands({})
                setEnded(true)
                return
            }

            const ranking = winners.winners[0]?.ranking?.toUpperCase()
            let player = winners.winners.length > 1 ? `${winners.winners.length} players` : 'Player ' + (winners.winners[0].seat + 1)
            
            if (winners.winners.length == 1 && isMySeat(winners.winners[0].seat)) {
                player = 'You'
            }

            let msg = getWinningMessage(ranking, player)

            setWinningMessage(msg)
            setInfoMessage(msg)
            toast.success(msg, { theme: 'colored', closeButton: false, position: 'bottom-right' })
            setHands({})

            // Update seats with winner information
            setSeats(prev => {
                return prev.map(p => {
                    const h = winners?.hands.find(v => v.seat === p.seat);
                    const w = winners?.winners.find(v => v.seat === p.seat);

                    return {
                        ...p,
                        hand: h ? h.hand : p.hand,
                        payout: w ? w.payout : p.payout,
                        ranking: w ? w?.ranking : p?.ranking,
                        winnerCards: w ? w.cards : [], // Ensure winnerCards is always an array
                    };
                });
            })

        } else {
            setInfoMessage(null)
            setWinningMessage(null)
        }

        setEnded(winners != null)

    }, [winners])

    useEffect(() => {
        console.log('[SEATS CHANGED]', seats);
        updatePlayers(seats)
    }, [seats]);

    // Socket
    useEffect(()=> {
        if (!table) return

        // Auth event so reconnect
        if (sock.current && userAuth) {
            console.log('closing socket')
            sock.current.close();
            sock.current.disconnect();
            sock.current = null
            devLog('[Reconnect with Auth]')
        }

        const { room } = router.query
        const token = userAuth?.token
        devLog('[Socket AUTH]', userAuth)

        sock.current = io(process.env.NEXT_PUBLIC_WSS_URL, {
            path: '/poker-api',
            transports: ['websocket'],
            query: { room },
            ...token ? {auth: { token }} : {},
        })

        sock.current.emitWithAck = (event, ...args) => {
            return new Promise((resolve, reject) => {
                sock.current.emit(event, ...args, (err, result) => {
                if (err) return reject(err);
                resolve(result);
                });
            });
        }

        sock.current.on('connect', () => {
            setConnected(true)
            devLog('connected to room:', room);
            // toast.success("Connected!", {...toastOpts, position: "bottom-left"})
        })

        sock.current.on('connect_error', (err) => {
            console.error(err);
            setConnected(false)
            if (err?.message == "INVALID_ROOM") {
                setClosed(true)
            }
            
        })

        sock.current.on('game:auth', data => {
            onAuth(data)
        })

        sock.current.on('game:error', data => {
            devLog('[GAME ERR]', data)
            const msg = data?.error || 'Something went wrong!'
            toast.error(msg, { theme: 'colored', closeButton: false, position: 'bottom-right' })
        })

        sock.current.onAny((event, data) => {
            console.log(`[${event}]`, data);
            if (logs.current.length >= 100) logs.current.shift()
            logs.current.push({ ts: new Date().toTimeString().split(" ")[0], event, data })
        })

        sock.current.on('poker:prompt', data => {
            devLog('[PROMPT]', data)
            devLog(seatsRef.current)
            onPrompt(data)
            const x = seatsRef.current.find(s => s.seat === data.seat)
            setInfoMessage(x && x.isMe ? `It's your turn!` : `It's Player ${data.seat + 1}'s turn!`)
        })

        sock.current.on('poker:act', data => {
            devLog('[ACT]', data)
            setPrompt(null)
        })

        sock.current.on('poker:sitDown', data => {
            devLog('[SIT DOWN]', data)
            toast.success("You sat down!", { theme: "colored", closeButton: false, position: "bottom-right" })
        })

        sock.current.on('poker:hand', data => {
            devLog('[HAND]', data)
            onHand(data)
        })

        sock.current.on('poker:standUp', data => {
            devLog('[SIT UP]', data)
        })

        sock.current.on('poker:round', data => {
            devLog('[ROUND]', data)
            onRound(data)
        })

        sock.current.on('poker:winners', data => {
            devLog('[WINNERS]', data)
            onWinners(data)
        })

        sock.current.on('poker:countdown', data => {
            onCountdown(data.time, 'poker:countdown')
        })

        sock.current.on('poker:event', data => {
            const alertEvents = {
                handEnded: "Hand ended!",
                handStarted: "New Hand started!",
                showdownEnded: "Showdown ended!"
            }

            if (alertEvents[data.event]) {
                toast.info(alertEvents[data.event], toastOpts)
            }

            if (data.event = "handEnded") {
                setHandEnded(true)
            }

            if (data.event = "handStarted") {
                setHandEnded(false)
            }

            if (data?.time >= 5) onCountdown(data.time, data.event)
        })

        sock.current.on('poker:action', data => {
            devLog('[ACTION]', data)
            const act = {
                "check": "checked!",
                "bet": "placed bet!",
                "call": "called!",
                "fold": "folded!",
                "raise": "raised!"
            }
            const action = act[data?.action] || data?.action + "ed!"
            const person = isMySeat(data?.seat)? "You" : `Player ${data.seat + 1}`
            const msg = `${person} ${action}`
            toast.info(msg, toastOpts)
            setPrompt(null)
            setActivePlayer(null)
            setPlayerCountdown(0)
            if (timerAudio.current) clearTimeout(timerAudio.current)

            if (data.action === 'fold') {
                setFoldedSeats(p => {
                    return [...p, data.seat]
                })
            }

            playAudio(data.action)

            setInfoMessage(`${isMySeat(data.seat) ? 'You' : 'Player ' + data.seat} ${data.action}ed!`)

            setSeats(prev => prev.map(x => x.seat === data.seat ? {...x, action: data.action } : {...x, action: null}))
        })

        sock.current.on('poker:seats', data => {
            // devLog('[SEATS]', data)
            onSeats(data)
        })

        devLog('[Socket setup!]')

        return () => {
            sock.current.close();
            sock.current.disconnect();
        }
    }, [table, userAuth])

    useEffect(() => {
        if (!router.isReady) return
        const { network, room, token } = router.query
        getTable(convertNetworkNameToId(network), token, room)
        window.logs = (n = -20) =>  console.log(logs.current.slice(n))
    }, [router.isReady])

    if (casinoLoading || casinoError) {
        return <CasinoLoader casinoLoading={casinoLoading} casinoError={casinoError}/>
    }

    if (closed) return (
        <div className='bg-dark-700 w-full h-[calc(100vh-60px)] lg:h-[calc(100vh-80px)] absolute z-[50] flex items-center justify-center'>
            {/* join room button */}
            <div className='border border-white/10 rounded-xl bg-darkgray p-4 h-auto w-1/2 z-50 text-center'>
                <div className="text-white">
                    <div className="text-primary font-bold text-xl mb-2">Table Ended!</div>
                    { table?.id || router?.query?.room && <div className="text-sm mb-2">Poker Room: <span className="text-primary">{table?.id || router?.query?.room}</span></div> }
                    <Button href={`/casinos/${router.query?.network}/${router.query?.token}/poker/`}>Join Other Tables</Button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="w-full mx-auto absolute left-0 lg:px-[120px] lg:w-100 h-[calc(100vh-60px)] lg:h-[calc(100vh-80px)] flex flex-col">
        <Head>
            <title>{token?.symbol ? `Play ${token?.symbol} Poker - Gambly`: "Play Poker - Gambly"}</title>
        </Head>
            <div className="h-full w-full relative">
                {table === null ?
                    <div className='bg-dark-700 w-full h-full absolute z-[50] flex items-center justify-center'>
                        <div className='border rounded-md bg-darkgray p-4 h-auto w-1/2 z-50 text-center'>
                            <img src="/logo-letter.png" className="h-16 animate-pulse w-16 m-auto"></img>
                            {error ? <div className="text-red">
                                {error}</div>
                                :
                                <div>Loading...</div>
                            }
                        </div>
                    </div>
                    :
                    interacted === false ?
                        <div className='bg-dark-700 w-full h-full absolute z-[50] flex items-center justify-center'>
                            {/* join room button */}
                            <div className='border rounded-xl bg-darkgray p-4 h-auto w-1/2 z-50 text-center'>
                                <div className="text-white">
                                    <div className="text-lg">Poker Room: <span className="text-primary">{table.id}</span></div>
                                    <div className="text-xs my-4">Buy in with {table.casino.token.symbol}</div>
                                    <Button size='sm' variant='primary' onClick={() => {
                                        setInteracted(true);
                                    }}>Enter Room</Button>
                                </div>
                            </div>
                        </div>
                        :
                        <>
                            <div className="pt-[30px] pr-4 pb-4 pl-4 flex w-full h-full">

                                <ImagePreloader />
                                <div className="absolute flex gap-2 items-center">
                                    <div className="relative">
                                        <CountdownCircleTimer
                                            key={roundTimerKey}
                                            strokeWidth={2}
                                            trailColor="#20212d"
                                            size={26}
                                            isPlaying
                                            strokeLinecap="butt"
                                            duration={roundTimer}
                                            colors={['#FFA843', '#FFA843', '#CC3E3E', '#20212d']}
                                            colorsTime={[7, 5, 2, 0]}
                                            className={`${roundTimer ? '' : 'hidden'}`}
                                        >
                                        </CountdownCircleTimer>
                                        <div className={`${connected ? 'bg-green' : 'bg-red animate-pulse'} absolute inset-0 m-auto h-[15px] w-[15px] rounded-full`}></div>
                                    </div>
                                    <span className="uppercase font-bold text-[10px]">{connected ? round?.round : 'Connecting...'}</span>
                                    {/* <div>seats: {seats.length} players: {players.length} winners: {winners ? winners.length : 'null'} <br></br> joining: {joining ? 1 : 0} <br></br>starting: {starting ? 1: 0} <br></br>started: {started ? 1 : 0} <br></br>ended: {ended ? 1 : 0}</div> */}
                                </div>

                                {sitWindow !== false &&
                                    <div className="absolute flex items-center justify-center w-full h-[calc(100%-50px)] backdrop-blur-sm z-[60] ">

                                        <div className="flex relative  bg-darkgray border-4 border-lightgray rounded-md p-4 items-center justify-center">
                                            <div onClick={() => {
                                                setSitWindow(false);
                                            }} className='absolute top-2 hover:opacity-90 cursor-pointer bg-lightgray p-1 w-[30px] rounded-full flex items-center justify-center right-2 z-50 text-whitegrey'>X</div>
                                            <div className="text-white">
                                                <div className="text-center">
                                                    <div className="text-2xl">Sit at table</div>

                                                    <div className='text-xs rounded-md mt-2 bg-gray'>
                                                        Balance: {formatUnits(tokenBalance?.balance, table.casino.token.decimals)} {table.casino.token.symbol}
                                                    </div>

                                                    {(BigInt(tokenBalance?.balance) >= BigInt(table.buy_in_min)) ?
                                                        <Button size='sm' variant="secondary" onClick={() => {
                                                            if (sitWindow !== false) {
                                                                sit(sitWindow)
                                                                setSitWindow(false);
                                                            }
                                                        }} className={`mt-2 ${BigInt(tokenBalance?.balance) < BigInt(table.buy_in_min) ? 'cursor-not-allowed' : 'cursor-pointer'}`}> Buy In: {formatUnits(table.buy_in_min, table.casino.token.decimals)} {table.casino.token.symbol}</Button>

                                                        :
                                                        <>
                                                            <div className="text-xs text-red mt-2">You do not have enough {table.casino.token.symbol} to join this table.</div>
                                                            <Button
                                                                size="sm"
                                                                variant="primary"
                                                                className="mt-2"
                                                                onClick={() => setShowDepositModal(true)}
                                                            >Deposit More {table.casino.token.symbol}</Button>

                                                            <div className="text-xs mt-2">Minimum buy in: {formatUnits(table.buy_in_min, table.casino.token.decimals) || 0} {table.casino.token.symbol}</div>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <div className={`hidden poker-table_ _poker-table-${table.max_players} rounded-full linear-gradient-dark  border-[24px] border-x-primary border-y-darkgray w-full h-full`}>
                                    {
                                        (() => {
                                            let n = 0
                                            let mySeatNeedsMoving = seatsRef.current.findIndex(x => x.isMe) > 0

                                            return seatsRef.current.map((seat, index) => {
                                                let i = index

                                                if (mySeatNeedsMoving) {
                                                    if (seat.isMe) {
                                                        i = 0
                                                        n = 1
                                                    } else {
                                                        i = (index + 1) - n
                                                    }
                                                } 

                                                return <div
                                                    key={index} 
                                                    style={{ gridArea: `seat-${i}` }}
                                                    className={`seat-${i}`}
                                                >
                                                    {i} / {index}
                                                </div>
                                            })
                                        })()
                                    }
                                </div>


                                {/* Table */}
                                <div className={`${'table' + (table.max_players || 10) + 'players'} rounded-full linear-gradient-dark  border-[24px] border-x-primary border-y-darkgray w-full h-full`}>
                                    <AnimatePresence>
                                        { joining && mainMessage &&
                                            <motion.div
                                                initial= {{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                                                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`bg-dark-700 text-sm flex ${canJoin() ? 'flex-col': ''} items-center gap-2 p-4 rounded-xl absolute z-[55] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                                            >
                            
                                                {/* <span className="text-primary"><iconify-icon inline icon="svg-spinners:clock"></iconify-icon></span> */}
                                                <svg className="text-primary text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"/><rect width="2" height="7" x="11" y="6" fill="currentColor" rx="1"><animateTransform attributeName="transform" dur="22.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect><rect width="2" height="9" x="11" y="11" fill="currentColor" rx="1"><animateTransform attributeName="transform" dur="1.875s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect></svg>
                                                <div className="text-center">{ mainMessage }</div>
                                                { canJoin() && 
                                                    <button
                                                        onClick={ () => setSitWindow(getFreeSeat())}
                                                        className="mt-2 text-dark bg-secondary py-1 px-6 rounded-md hover:bg-secondary-400"
                                                    >Sit Down</button>
                                                }
                                            </motion.div>
                                        }
                                    </AnimatePresence>

                                    <div className={`${getClassNameForPokerContainer()} h-full flex items-center justify-center w-[100%] relative`}>
                                        <img src='/logo-letter.png' className="w-[100px] h-[100px] absolute left-[calc(50%-50px)] opacity-40 animate-pulse margin-0  z-50 rounded-full" />
                                        
                                        <div className={`${deckVisible === true ? 'visible' : 'hidden'} transition-all absolute bottom-[200px] h-16 z-[50] left-0 right-0 m-auto w-[100px] flex items-center text-center justify-center`}>
                                            <span>DECK</span>
                                            {cardDealRefs.current.map((cardRef, index) => (
                                                <img key={index} ref={cardRef} src={'/cards/set1/gray_back.png'} className="absolute h-24 animate-pulse"></img>
                                            ))}
                                        </div>

                                        {seats.map((seat, index) => {
                                            if (seat.user) {
                                                return <Seat
                                                        round={round}
                                                        action={seat.action}
                                                        allHands={allHands}
                                                        bet={seat.bet}
                                                        bigBlind={seat.bigBlind}
                                                        button={button}
                                                        cards={myCards}
                                                        cardsDealt={cardsDealt}
                                                        currentPlayer={activePlayer}
                                                        dealHands={dealHands}
                                                        didJoin={iamPlayer()}
                                                        ended={ended}
                                                        foldedSeats={foldedSeats}
                                                        gatherChips={gatherChips}
                                                        hand={seat?.hand}
                                                        key={seat?.seat}
                                                        moveTimeLimit={moveTimeLimit}
                                                        player={'player' + (seat?.seat + 1)}
                                                        playerChips={seat?.bet?.totalChips}
                                                        playerCountdown={playerCountdown}
                                                        setPlayerCountdownRem={setPlayerCountdownRem}
                                                        playername={seat?.user?.wallet_address}
                                                        playerSat={true}
                                                        playersInGame={playersInGame}
                                                        resetChips={resetChips}
                                                        seat={seat.seat}
                                                        seatIndex={index}
                                                        seatRef={getRefForSeat(index)}
                                                        setSitWindow={setSitWindow}
                                                        sit={sit}
                                                        status={seat?.status}
                                                        smallBlind={seat.smallBlind}
                                                        socket={sock.current}
                                                        targetRef={targetRef}
                                                        token={table?.casino?.token}
                                                        user={user}
                                                        validActions={validActions}
                                                        winners={winners}
                                                        winnerCards={seat?.winnerCards}
                                                        card1Dealt={seat?.card1Dealt}
                                                        card2Dealt={seat?.card2Dealt}
                                                        canJoin={canJoin()}
                                                        seatUser={seat.user}
                                                        isMe={seat.isMe}
                                                        >
                                                        </Seat>
                                            } else {
                                                return <Seat
                                                        round={round}
                                                        allHands={allHands}
                                                        bigBlind={bigBlind}
                                                        button={button}
                    
                                                        cards={myCards}
                                                        cardsDealt={cardsDealt}
                                                        currentPlayer={activePlayer}
                                                        didJoin={iamPlayer()}
                                                        dealHands={dealHands} 
                                                        targetRef={targetRef}
                                                        foldedSeats={foldedSeats}
                                                        gatherChips={gatherChips}
                                                        hand={seat?.hand}
                                                        key={seat.seat}
                                                        moveTimeLimit={moveTimeLimit}
                                                        player={'player' + (seat.seat + 1)}
                                                        playerCountdown={playerCountdown}
                                                        playername={null}
                                                        playerSat={false}
                                                        playersInGame={playersInGame}
                                                        resetChips={resetChips}
                                                        seat={seat.seat}
                                                        seatIndex={index}
                                                        seatRef={getRefForSeat(index)}
                                                        setSitWindow={setSitWindow}
                                                        sit={sit}
                                                        smallBlind={smallBlind}
                                                        socket={socket}
                                                        token={table.casino.token}
                                                        user={user}
                                                        validActions={validActions}
                                                        winners={winners}
                                                        winnerCards={winnerCards}
                                                        canJoin={canJoin()}
                                                        >
                                                        </Seat>
                                            }
                                        })}
                                        
                                        <div className="px-10 communityCards z-[50] lg:align-baseline align-center w-full h-full h-40 flex flex-grow flex-col items-center justify-center">
                                           { ended &&
                                            <motion.div
                                                initial= {{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="font-bold animate-pulse py-4 text-2xl text-primary z-[10000]">
                                                {winningMessage}
                                            </motion.div>
                                           }
                                           <div className={`${ended ? 'scale-90': ''} transition duration-300 flex w-full items-center justify-center`}>
                                           {communityCards.length > 0
                                                &&
                                                communityCards.map((card, index) => {
                                                    let rank = card?.rank;
                                                    if (rank === 'T') {
                                                        rank = '10';
                                                    }
                                                    let suit = card?.suit;
                                                    if (rank === undefined || suit === undefined) {
                                                        return;
                                                    } else {

                                                        if (suit === 'diamonds') {
                                                            suit = 'D';
                                                        }
                                                        else if (suit === 'clubs') {
                                                            suit = 'C';
                                                        }
                                                        else if (suit === 'hearts') {
                                                            suit = 'H';
                                                        }
                                                        else if (suit === 'spades') {
                                                            suit = 'S';
                                                        }

                                                        return (<PokerCardMain winnerCards={winnerCards} rank={rank} suit={suit} key={index}></PokerCardMain>)

                                                    }
                                                })}
                                           </div>
                                        </div>

                                        {/* DIV BUT THIS TAKES UP FULL WIDT */}
                                        <div className="p-2 h-full potContainer relative">
                                            <div ref={targetRef} className="flex justify-center">
                                                {currentPot > 0 && !ended &&
                                                            <div className='flex gap-1 border border-white font-bold text-dark bg-primary !h-10 items-center justify-center px-4 rounded-xl' ref={currentPotRef}>
                                                                <span className="">POT</span>
                                                                <span className="opacity-50">:</span>
                                                                {formatUnits(currentPot, table.casino.token.decimals || 18)}
                                                                {/* <img src={table.casino.token.logo.includes('http') ? table.casino.token.logo : '/placeholder.png'} className="h-6 w-6"></img> */}
                                                            </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                }

            </div>

            {/* { !raiseWindowOpen &&
                <div className="text-sm relative flex items-center gap-2 justify-center">
                    {myTurn && <div className="w-[8px] h-[8px] bg-green rounded-full animate-pulse"></div>}
                    <div>{infoMessage}</div>
                </div>
            } */}

            <div className="flex justify-between flex-grow h-40 items-center gap-4 w-full z-50">
                <BetButtons playerCountdown={playerCountdownRem} user={user} token={token} setRaiseWindowOpen={setRaiseWindowOpen} setRaiseAmount={setRaiseAmount} setBetAmount={setBetAmount} raiseWindowOpen={raiseWindowOpen} raiseAmountMin={raiseAmountMin} raiseAmountMax={raiseAmountMax} raiseAmount={raiseAmount} currentPlayer={activePlayer} betAmount={betAmount} betAmountMax={betAmountMax} betAmountMin={betAmountMin} betWindowOpen={betWindowOpen} setBetWindowOpen={setBetWindowOpen} validActions={validActions} socket={sock.current} />

                <div className='absolute z-50 top-3 right-3 w-[100px] flex flex-col gap-2 items-end'>
                    {
                        iamPlayer() && 
                        <div className="flex flex-col h-full w-full flex-grow">
                            <div onClick={() => {
                                leaveTable();
                            }} className=" p-1 h-full flex-col-reverse text-sm text-center w-full gap-1 font-extrabold italic flex  items-center justify-center bg-primary text-darkgray hover:opacity-75 cursor-pointer select-none rounded-xl">
                                <span>Stand Up</span>
                                <Iconify icon="mingcute:exit-fill" className="text-xl" />
                            </div>
                        </div>
                    }
                    <CopyLinkButton className="text-sm lg:w-full active:bg-green/50" link={roomLink()} />
                </div>
            </div>
        </div >
    )
}

Poker.getLayout = getLayout

export default Poker
