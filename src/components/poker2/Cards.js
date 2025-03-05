import React from "react";
import { motion } from "framer-motion";

const Cards = ({ user, hand, className, card1Dealt, card2Dealt }) => {
  if (!user) return null

  if (hand?.length == 0) return (
    <div className={`absolute top-[-10px] z-0 flex ${className}`}>
      { card1Dealt &&
        <motion.img
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: -6, x: "10%" }} 
          transition={{
            type: "spring",
            stiffness: 100, 
            damping: 15,
          }}
          className="relative w-[30px] h-auto -rotate-6 translate-x-[10%]"
          src='/cards/set1/gray_back.png'
          alt="" 
        />
      }

{ card2Dealt &&
        <motion.img
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: 6, x: "-10%" }} 
          transition={{
            type: "spring",
            stiffness: 100, 
            damping: 15,
          }}
          className="relative w-[30px] h-auto rotate-6 translate-x-[-10%]"
          src='/cards/set1/gray_back.png'
          alt="" 
        />
        }

    </div>
  )

  return (
    <div className={`absolute top-[-15px] z-0 flex ${className}`}>
      { card1Dealt &&
        <motion.img
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: -6, x: "10%" }} 
          transition={{
            type: "spring",
            stiffness: 100, 
            damping: 15,
          }}
          className="relative w-[40px] h-auto -rotate-6 translate-x-[10%]"
          src={ hand.length > 0 ? `/cards/set1/${hand[0]?.id}.png` : '/cards/set1/gray_back.png'}
          alt="" 
        />
        }
      { card2Dealt &&
        <motion.img
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: 6, x: "-10%" }} 
          transition={{
            type: "spring",
            stiffness: 100, 
            damping: 15,
          }}
          className="relative w-[40px] h-auto rotate-6 translate-x-[-10%]"
          src={ hand.length > 0 ? `/cards/set1/${hand[1]?.id}.png` : '/cards/set1/gray_back.png'}
          alt="" 
        />
}

    </div>
  )
}

export default Cards