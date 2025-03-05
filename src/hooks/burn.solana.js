import { useSolanaContract } from './solana'
import * as anchor from '@coral-xyz/anchor';
import { parse } from 'uuid'
import {
  Transaction,
  SystemProgram, Ed25519Program,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
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
  const { wallet, owner, program, provider } = useSolanaContract(depositContractAddress)

  const {} = useSolanaContract()
  const idBuffer = Buffer.from(parse(transactionId))
  const burnAddy = new PublicKey("1nc1nerator11111111111111111111111111111111")

  const burn = async () => {
    setShortError(null)
    setIsSuccess(false)
    setIsError(false)

    // token address
    const mint = new PublicKey(token);

    // derive casino bank pda
    const [casinoBank] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode('casino_bank')],
      program.programId,
    );

    // derive withdrawal pda
    const [withdrawalPda] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode('withdrawal_pda'), idBuffer],
      program.programId,
    );

    // create transaction
    const transaction = new Transaction();

    // add signature verification instruction
    transaction.add(Ed25519Program.createInstructionWithPublicKey({
        // program's owner, the hot wallet, signs all withdrawal requests
        // todo: should be a better way to fetch it, maybe while fetching idl
        publicKey: owner.toBuffer(),
        message: Buffer.from(message, 'hex'),
        signature: Buffer.from(signature, 'hex'),
    }));

    // add withdrawal instruction
    transaction.add(
      await program.methods.processWithdrawal(
        idBuffer,
        new anchor.BN(amount),
      )
      .accounts({
        withdrawalPda: withdrawalPda,

        // casino bank pda
        casinoBank,
        // casino bank pda's token account
        vaultTokenAccount: anchor.utils.token.associatedAddress({ mint, owner: casinoBank }),

        // recipient's token account
        recipientTokenAccount: anchor.utils.token.associatedAddress({ mint, owner: burnAddy }),
        // recipient's public key
        recipient: burnAddy,
        // token mint
        tokenMint: mint,

        // system bullshit
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .signers([wallet])
      .instruction());

      try {
        setIsPending(true)
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
        const txId = await provider.sendAndConfirm(transaction);
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
