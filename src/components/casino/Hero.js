import { useRef } from "react"

let randomStrings = [
  "Get ready for the ultimate poker and coinflip experience with [this token name], where every game is a new opportunity to win big and enjoy the excitement.",
  "Dive into the world of online poker and coinflip games with [this token name], bringing unmatched thrill and entertainment to your gaming sessions.",
  "With [this token name], enjoy the best of both worlds in poker and coinflip games, offering a perfect blend of skill, luck, and endless fun.",
  "Transform your gaming routine with [this token name], your top choice for engaging in high-stakes poker and dynamic coinflip matches online.",
  "Step into the arena of poker and coinflip with [this token name], where each play is a step towards victory in a vibrant and secure gaming environment.",
  "Master the art of poker and the excitement of coinflip with [this token name], the ultimate token for enthusiasts seeking a superior gaming experience.",
  "Experience the thrill of poker and the simplicity of coinflip with [this token name], a token designed for seamless and exhilarating online gaming.",
  "Join a community of poker and coinflip aficionados by playing with [this token name], where every game is a chance to showcase your skills and luck.",
  "Elevate your poker and coinflip strategies with [this token name], offering an unparalleled platform for gaming excellence and big wins.",
  "Engage in the most thrilling poker and coinflip games on the web with [this token name], where every bet is a doorway to endless excitement and rewards."
]

const Hero = ({ symbol, name, imageUrl, log }) => {
  let randomString = useRef(randomStrings[Math.floor(Math.random() * randomStrings.length)])
  let replaced = useRef(randomString.current.replace('[this token name]', "$" + symbol))

  return (
    <div className="casino-hero p-12 lg:p-14 rounded-lg border border-dark-260">
      <div>
        <div className="mb-5 flex items-center gap-4 lg:text-5xl text-2xl">
          <img src={imageUrl} className='h-10' alt="" />
          <span className="text-primary">{name}</span> Casino
        </div>
        <p className="text-dark-200 lg:text-2xl text-sm" style={{ maxWidth: '39.3em' }}>{replaced.current}</p>
      </div>
    </div>
  )
}
export default Hero