import React from 'react';
import { motion } from 'framer-motion';

const Checkmark = ({ size = 24, color = 'green' }) => {
  const lineProps = {
    stroke: color,
    strokeWidth: size / 12, 
    strokeLinecap: 'round',
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.line
        x1="5"
        y1="12"
        x2="10"
        y2="17"
        {...lineProps}
      />
      <motion.line
        x1="10"
        y1="17"
        x2="19"
        y2="7"
        {...lineProps}
        transition={{ duration: 0.3, delay: 0.3, ease: 'easeInOut' }}
      />
    </svg>
  );
};

export default Checkmark;
