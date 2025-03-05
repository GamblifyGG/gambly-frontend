import { useSolanaContract } from './solana'
import * as anchor from '@coral-xyz/anchor';
import { parse } from 'uuid'
import {
  PublicKey,
} from '@solana/web3.js';
import { useState } from 'react';

export function useSolanaBurn ({
  depositContractAddress,
  transactionId, 
  amount, 
  token, 
  signature,
  message,
}) {
  const [shortError, setShortError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [txData, setTxData] = useState(null)
  const { wallet, owner, program } = useSolanaContract(depositContractAddress)

  const idParsed = parse(transactionId)
  // const idBuffer = Buffer.from(idParsed)

  const burn = async () => {
    setShortError(null)
    setIsSuccess(false)
    setIsError(false)
    setIsPending(false)

    // token address
    const mint = new PublicKey(token);

    try {
      setIsPending(true)

      const txId = await program.methods
        .burn(idParsed, new anchor.BN(amount))
        .accounts({
          tokenMint: mint,
          user: wallet.publicKey,
        })
        .preInstructions([
          anchor.web3.Ed25519Program.createInstructionWithPublicKey({
            publicKey: owner.toBuffer(),
            message: Buffer.from(message, 'hex'),
            signature: Buffer.from(signature, 'hex'),
          }),
        ])
        .signers([]) // Only works when left empty
        .rpc();

      const url = `https://solscan.io/tx/${txId}?cluster=devnet`;
      setTxData({ url, txId })
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
      console.error(`Error withdrawing: ${err.message}`)
      setShortError(err?.message)
      setIsError(true)
    } finally {
      setIsPending(false)
    }
  }

  return { burn, txData , isPending, shortError, isSuccess, isError }
}
