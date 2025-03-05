import CashBag from "@/components/basic/icons/cashbag";
import Space from "@/components/basic/icons/space";
import Support from "@/components/basic/icons/support";
import Token from "@/components/basic/icons/token";
import First from "@/components/basic/icons/first";
import Second from "@/components/basic/icons/second";
import Third from "@/components/basic/icons/third";
import coinImage1 from "@/assets/coin-images/1.png"
import coinImage2 from "@/assets/coin-images/2.png"
import coinImage3 from "@/assets/coin-images/3.png"
import coinImage4 from "@/assets/coin-images/4.png"
import coinImage5 from "@/assets/coin-images/5.png"
import coinImage6 from "@/assets/coin-images/6.png"

import eth from "@/assets/ethereum.png"
import bsc from "@/assets/coin-images/mainCoinImages/bsc.png"
import polygon from "@/assets/coin-images/mainCoinImages/polygon.png"
import avalanche from "@/assets/coin-images/mainCoinImages/avax.png"
import sol from "@/assets/solana.png"

import preview1 from "@/assets/login-image.png"
import preview2 from "@/assets/poker-preview.png"
import preview3 from "@/assets/preview1.png"

export const stats = [
  { icon: <Space />, value: "10K +", label: "Active users" },
  { icon: <CashBag />, value: "$1M +", label: "Total wagered" },
  { icon: <Support />, value: "24/7", label: "Live support" },
  { icon: <Token />, value: "5938+", label: "Supported Tokens" },
];

export const steps = [
  {
    icon: <First className="w-full h-auto text-textOpacity" />,
    title: "Connect Wallet",
    description:
      "Connect your crypto wallet to the Gambly platform for seamless deposits and withdrawal.",
  },
  {
    icon: <Second className="w-full h-auto" />,
    title: "Select and deposit any ERC20 or Solana (SPL) Token",
    description:
      "Deposit any ERC20 or Solana (SPL) token to play our games. Your digital assets, whether mainstream or niche, are your ticket to our ultimate online gaming freedom.",
  },
  {
    icon: <Third className="w-full h-auto" />,
    title: "Play!",
    description:
      "Play our games with your digital assets. No need to worry about fiat currency, just play with your assets!",
  },
];

export const images = [
  preview1,
  preview2,
  preview3,
];

export const logos = [
  { src: sol, alt: "logo" },
  { src: eth, alt: "eth" },
  { src: bsc, alt: "bnb" },
  // { src: bsc, alt: "bnb" },
  // { src: polygon, alt: "polygon" },
  // { src: avalanche, alt: "avalanche" },
  // { src: eth, alt: "eth" },
];

export const faqData = [
  {
    question: "How does Gambly.io work?",
    answer: "Gambly.io is a cross-chain casino platform that lets you play, stake, and earn using any ERC20 or Solana (SPL) token. Connect your wallet, bet on live PvP games, and enjoy real-time, competitive gameplay.",
  },
  {
    question: "What blockchains are supported?", 
    answer: "Currently, Gambly.io supports Ethereum (ERC20 tokens) and Solana (SPL tokens) with plans to expand to even more chains in the future.",
  },
  {
    question: "How do I leverage Gambly.io?",
    answer: "- Stake $GAMBLY tokens to earn a share of the Gambly's revenue."
  },
  {
    question: "Can I create my own casino?",
    answer: "Yes! Simply search for your token in the search bar and your casino will be created.",
  },
  {
    question: "How do I get started?",
    answer: "Simply click \"Connect Wallet\", select Ethereum or Solana, and start betting with your favorite token.",
  },
];

export const coinImages = [
  {
    src: coinImage1,
    alt: "coin",
  },
  {
    src:  coinImage2,
    alt: "coin",
  },
  {
    src: coinImage3,
    alt: "coin",
  },
  {
    src: coinImage4,
    alt: "coin",
  },
  {
    src: coinImage5,
    alt: "coin",
  },
  {
    src: coinImage6,
    alt: "coin",
  },
  {
    src: coinImage4,
    alt: "coin",
  },
];
