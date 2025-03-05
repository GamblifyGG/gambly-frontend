import React from 'react';
import styles from './FlippingCoin.module.css';

const FlippingCoin = ({ isFlipping = true }) => {
  return (
    <div className={`${styles.coinContainer}`}>
      <div className={`${styles.coin} ${isFlipping ? styles.flipping : ''}`} />
    </div>
  );
};

export default FlippingCoin;