import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'



const RockPaperScissorsAnimation = ({ game, setAnimDone = () => {}, imageClasses = 'w-[100px] h-auto', className = '' }) => {
    const player1Bet = game?.creator?.bet
    const player2Bet = game?.opponent?.bet
    const [stop, setStop] = useState(false)

    const images = [
        { src: "/rps/rock-player-1.svg", alt: "Rock" },
        { src: "/rps/paper-player-1.svg", alt: "Paper" },
        { src: "/rps/scissor-player-1.svg", alt: "Scissors" },
        { src: "/rps/rock-player-2.svg", alt: "Rock" },
        { src: "/rps/paper-player-2.svg", alt: "Paper" },
        { src: "/rps/scissor-player-2.svg", alt: "Scissors" }
    ];

    useEffect(() => {
        if (game?.state === 'ended') {
          setTimeout(()=> {
            setStop(true)
            setTimeout(() => setAnimDone(true), 500)
          }, 1200)
        }
    }, [game, setAnimDone]);


    const getImagePlayer1 = (player1Bet) => {
        if (player1Bet === 'scissors') {
            return images[2];
        }
        if (player1Bet === 'paper') {
            return images[1];
        }
        if (player1Bet === 'rock') {
            return images[0];
        }
        return {}
    }

    const getImagePlayer2 = (player2Bet) => {
        if (player2Bet === 'scissors') {
            return images[5];
        }
        if (player2Bet === 'paper') {
            return images[4];
        }
        if (player2Bet === 'rock') {
            return images[3];
        }
        return {}
    }

    const checkWinner = (player1Bet, player2Bet) => {
        if (player1Bet === player2Bet) {
            return 'tie';
        }

        return (
            (player1Bet === 'rock' && player2Bet === 'scissors') ||
            (player1Bet === 'paper' && player2Bet === 'rock') ||
            (player1Bet === 'scissors' && player2Bet === 'paper')
            ) ? 'player1' : 'player2';
    }

    const y = [0, -40, 0, -40, 0, -40, 0]
    const times = [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1]

    if (!game) return null

    return (
        <div className={`flex z-50 gap-[90px] items-center justify-center min-h-[10rem] top-0 left-0 w-full h-full ${className}`}>
            <motion.img
                className={imageClasses}
                src={stop ? getImagePlayer1(player1Bet).src : images[0].src}
                alt={getImagePlayer1(player1Bet).alt}
                initial={{ y: 0, scale: 0.8 }}
                animate={ stop ? { scale: checkWinner(player1Bet, player2Bet) == 'player1' ? 1 : 0.8 } : { y }}
                transition={{
                  duration: stop ? .5 : 1.5,
                  times,
                  repeat: stop ? 0 : Infinity
                }}
            />
            <motion.img
                className={imageClasses}
                src={stop ? getImagePlayer2(player2Bet).src : images[3].src}
                alt={getImagePlayer2(player2Bet).alt}
                initial={{ y: 0, scale: 0.8 }}
                animate={ stop ? { scale: checkWinner(player1Bet, player2Bet) == 'player2' ? 1 : 0.8 } : { y }}
                transition={{
                  duration: stop ? .5 : 1.5,
                  times,
                  repeat: stop ? 0 : Infinity
                }}
            />
        </div>
    );
}

export default RockPaperScissorsAnimation