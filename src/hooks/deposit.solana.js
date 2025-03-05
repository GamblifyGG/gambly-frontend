import { useSolanaContract } from './solana'
import * as anchor from '@coral-xyz/anchor';
import {
  SystemProgram,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { useState } from 'react';

export function useSolanaDeposit ({
  amount,
  token
}) {
  const [shortError, setShortError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [txData, setTxData] = useState(null)
  const { wallet, owner, program, provider } = useSolanaContract(null, token)

  const {} = useSolanaContract()

  const reset = () => {
    setIsPending(false)
    setIsError(false)
    setIsSuccess(false)
    setShortError(null)
    setTxData(null)
  }

  const deposit = async () => {
    reset()
    setIsPending(true)

    // amount
    const tokenAmount = new anchor.BN(amount);

    // token address
    const mint = new PublicKey(token?.address);

    // derive casino bank pda
    const [casinoBank] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode('casino_bank')],
      program.programId,
    );

    try {
      const txId = await program.rpc.deposit(
        tokenAmount,
        {
          accounts: {
            casinoBank,
            vaultTokenAccount: anchor.utils.token.associatedAddress({ mint, owner: casinoBank }),

            user: wallet.publicKey,
            userTokenAccount: anchor.utils.token.associatedAddress({ mint, owner: wallet.publicKey }),

            // token
            tokenMint: mint,

            // system bullshit
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          },
        },
      );

      const url = `https://solscan.io/tx/${txId}?cluster=devnet`;
      setTxData({ url, txId })
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
      setShortError(err?.message)
    } finally {
      setIsPending(false)
    }
  }

  return {
    txData,
    isError,
    isPending,
    isSuccess,
    shortError,
    deposit,
    reset
  }
}
