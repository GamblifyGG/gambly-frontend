import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'



const RockPaperScissorsAnimation = ({ state, player1Bet, player2Bet, isWinnerAnimationComplete, setIsWinnerAnimationComplete, imageClasses = '', mainClass = '' }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const images = [
        { src: "/rps/rock-player-1.svg", alt: "Rock" },
        { src: "/rps/paper-player-1.svg", alt: "Paper" },
        { src: "/rps/scissor-player-1.svg", alt: "Scissors" },
        { src: "/rps/rock-player-2.svg", alt: "Rock" },
        { src: "/rps/paper-player-2.svg", alt: "Paper" },
        { src: "/rps/scissor-player-2.svg", alt: "Scissors" }
    ];

    useEffect(() => {
        if (state === 'ended') {
            setIsWinnerAnimationComplete(true);
            return;
        }
        console.log('player1Bet', player1Bet);
        console.log('player2Bet', player2Bet);
        const interval = setTimeout(() => {
            setIsWinnerAnimationComplete(true);
            // set random image from images array
            // setCurrentImage(Math.floor(Math.random() * images.length));
        }, 1600);

        return () => clearTimeout(interval);
    }, [player1Bet, player2Bet, state, setIsWinnerAnimationComplete]);


    const getImagePlayer1 = (player1Bet) => {
        if (player1Bet === 'scissors') {
            return images[2].src;
        }
        if (player1Bet === 'paper') {
            return images[1].src;
        }
        if (player1Bet === 'rock') {
            return images[0].src;
        }
    }

    const getImagePlayer2 = (player2Bet) => {
        if (player2Bet === 'scissors') {
            return images[5].src;
        }
        if (player2Bet === 'paper') {
            return images[4].src;
        }
        if (player2Bet === 'rock') {
            return images[3].src;
        }
    }

    const checkWinner = (player1Bet, player2Bet) => {
        if (player1Bet === player2Bet) {
            return 'tie';
        }
        if (
            (player1Bet === 'scissors' && player2Bet === 'paper') ||
            (player1Bet === 'paper' && player2Bet === 'rock') ||
            (player1Bet === 'rock' && player2Bet === 'scissors')
        ) {
            return 'player1';
        }
        return 'player2';
    }
    // first show this animation, then show the final choises from the game result
    // then show the winner

    const animationProps = state === 'ended' ? {} : {
        animate: {
            y: [0, -40, 0, -40, 0, -40, 0],
            transition: {
                y: {
                    duration: 1.5,
                    times: [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1],
                    repeat: 0,
                    repeatDelay: 0.5
                },
            }
        }
    };

    return (
        <div className={`flex z-50 items-center justify-center min-h-[10rem] top-0 left-0 w-full h-full ${mainClass}`}>
            <motion.img
                className={imageClasses + ' ' + (checkWinner(player1Bet, player2Bet) === 'player1' ? ' border border-green' : '')}
                key={currentImage}
                src={isWinnerAnimationComplete ? (state === 'ended' ? getImagePlayer1(player1Bet) : images[0].src) : images[0].src}
                alt={images[currentImage].alt}
                initial={{ y: 0, scaleX: 1 }}
                {...animationProps}
            />
            <motion.img
                key={currentImage}
                className={imageClasses + ' ' + (checkWinner(player1Bet, player2Bet) === 'player2' ? ' border border-green' : '')}
                src={isWinnerAnimationComplete ? (state === 'ended' ? getImagePlayer2(player2Bet) : images[3].src) : images[3].src}
                alt={images[currentImage].alt}
                initial={{ y: 0, scaleX: 1 }}
                {...animationProps}
            />
        </div>
    );
}

export default RockPaperScissorsAnimation