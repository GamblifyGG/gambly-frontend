import React, { useState } from 'react';
import { motion, transform } from 'framer-motion';

const CoinFlip = ({ value }) => {
    const deg = {
      heads: 180 * 6,
      tails: 180 * 7
    }

    return (
        <motion.div 
          className={`relative w-[100px] h-[100px] m-auto shadow-lg rounded-full}`}
          animate={{
              rotateY: value ? deg[value] : 360
          }}
          transition={{
              duration: value ? 1 : 0.3,
              ease: 'easeOut',
              repeat: value ? undefined : Infinity
          }}
          style={{
            WebkitPerspective: '800px',
            WebkitTransformStyle: 'preserve-3d'
          }}

        >
          <img
            style={{
              WebkitBackfaceVisibility: 'hidden',
            }}
            src="/heads.svg"
            alt=""
            className="z-10 absolute inset-0 w-full h-full rounded-full" />
          <img
            style={{
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(-180deg)'
            }}
            src="/tails.svg"
            alt=""
            className="absolute inset-0 w-full h-full" />

        </motion.div>
    );
};

export default CoinFlip;
