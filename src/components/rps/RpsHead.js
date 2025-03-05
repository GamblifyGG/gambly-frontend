const CoinHead = ({ side = 'rock', size = 'md', player = 1 }) => {
  const map = {
    none: '',
    rock: 'bg-gradient-to-b from-[#64748B] to-[#94A3B8]',
    paper: 'bg-gradient-to-b from-[#0891B2] to-[#67E8F9]',
    scissors: 'bg-gradient-to-b from-secondary-600 to-secondary-500',
  }

  const player1images = [
    { src: "/rps/rock-player-1.svg", alt: "Rock" },
    { src: "/rps/paper-player-1.svg", alt: "Paper" },
    { src: "/rps/scissor-player-1.svg", alt: "Scissors" },
  ];

  const player2images = [
    { src: "/rps/rock-player-2.svg", alt: "Rock" },
    { src: "/rps/paper-player-2.svg", alt: "Paper" },
    { src: "/rps/scissor-player-2.svg", alt: "Scissors" },
  ];

  const sizeMap = {
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-6xl'
  }

  const getImage = () => {
    if (player === 1) {
      if(side === 'rock') return player1images[0]
      if(side === 'paper') return player1images[1]
      if(side === 'scissors') return player1images[2]
    } else {
      if(side === 'rock') return player2images[0]
      if(side === 'paper') return player2images[1]
      if(side === 'scissors') return player2images[2]
    }
  }

  const variant = map[side] || map.none
  const sizeClass = sizeMap[size]

  if (!side) return <></>

  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center w-[1em] h-[1em]`}>
      <img src={getImage().src} alt={side} />
    </div>
  )
}

export default CoinHead