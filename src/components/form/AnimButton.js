import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Checkmark from './AnimCheckmark'

const AnimButton = ({ onClick, start, done, success, error, text, ...rest }) => {
  const [stage, setStage] = useState(0);
  const [key, setKey] = useState(0)
  const [showCheck, setShowCheck] = useState(false)

  const resetAnimation = () => {
    setKey(prevKey => prevKey + 1); // Change the key to reset animation
  };

  const line = { width: '44px', background: 'transparent', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#FFA843' }

  const stage1 = {
    initial: { width: '100%' },
    animate: { 
      ...line,
      transition: { duration: 0.2 } 
    },
  };

  const stage2 = {
    initial: line,
    animate: {  
      rotate: 360,
      transition: { 
        duration: 1, 
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear"
      } 
    },
  }

  const stage3 = {
    initial: line,
    animate: {  
      border: '2px solid #FFA843',
      scale: 1.2,
      transition: { 
        duration: 0.3, 
        ease: "easeInOut"
      }
    },
  };

  const stages = [{ initial: { width: '100%' }}, stage1, stage2, stage3]

  useEffect(() => {
    if (start) setStage(1)
    if (done) setStage(3)
    if (error) {
      setStage(0)
      resetAnimation()
    }
  }, [start, done, success, error])

  return (
    <motion.button
      key={key}
      onClick={onClick}
      variants={ stages[stage] }
      initial="initial"
      animate="animate"
      onAnimationComplete={() => {
        if (stage === 1) {
          setStage(2);
        }

        if (stage === 3 && success) {
          setTimeout(() => setShowCheck(true), 200)
        }
      }}
      {...rest}
      className="mx-auto flex h-[44px] gap-1.5 items-center justify-center grad-primary text-dark rounded-[22px] disabled:opacity-50 disabled:pointer-events-none"
    >
      { stage == 0 && text }
      { showCheck && <Checkmark color="#FFA843" size={24}/> }
    </motion.button>
  );
};

export default AnimButton;