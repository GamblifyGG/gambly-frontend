import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Notification = ({ message, duration = 3000, onClose = () => {} }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); 
  }, [duration, onClose]);

  if (!message) return null;


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`absolute bg-green/50 rounded-xl p-2 text-sm`}
    >
      <p>{message}</p>
    </motion.div>
  );
};

export default Notification;