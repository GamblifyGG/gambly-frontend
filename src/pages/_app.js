import '@/styles/globals.css'
import '@/styles/pokertable.css'
import '@/styles/scss/app.scss'
import '@solana/wallet-adapter-react-ui/styles.css'
import 'react-toastify/dist/ReactToastify.css';

import 'iconify-icon'
import Web3Modal from '../context/Web3Modal'
import { BaseProvider } from '@/context/BaseContext'

import { CoinflipProvider } from '@/context/CoinflipContext'
import { RockPaperScissorsProvider } from '@/context/RockPaperScissorsContext'
import Layout from '@/components/SimpleLayout'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { ToastContainer } from 'react-toastify';
// import { SolanaAdapter } from '@reown/appkit-adapter-solana'

export default function App({ Component, pageProps }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
    ],
    [network]
  );

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>
            <Web3Modal>
                <BaseProvider>
                  <CoinflipProvider>
                    <RockPaperScissorsProvider>
                      <Layout>
                        <Component {...pageProps} />
                        <ToastContainer theme="dark" autoClose={3000} hideProgressBar={true} />
                      </Layout>
                    </RockPaperScissorsProvider>
                  </CoinflipProvider>
                </BaseProvider>
            </Web3Modal>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}
