import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Notification = ({ message, duration = 3000, onClose, variant = "info" }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); 
  }, [duration, onClose]);

  if (!message) return null;

  const variantClass = {
    info: 'bg-dark-300',
    error: 'bg-red',
    success: 'bg-green',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`${variantClass[variant]} fixed bottom-8 text-xs right-4 text-white px-4 py-2 shadow-lg rounded-lg`}
    >
      <p>{message}</p>
    </motion.div>
  );
};

export default Notification;
