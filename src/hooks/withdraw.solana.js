import { useSolanaContract } from './solana'
import * as anchor from '@coral-xyz/anchor';
import { parse } from 'uuid'
import {
  Transaction,
  SystemProgram, Ed25519Program,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY
} from '@solana/web3.js';
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { useState, useContext } from 'react';
import { parseContractError } from "@/utils/contracts";
import { BaseContext } from '@/context/BaseContext'
import { toast } from 'react-toastify'

const toastOpts = { theme: "colored", position: "bottom-right", progress: false, closeButton: false }


export function useSolanaWithdrawal({
  token_2022,
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
  // useContext
  const { casino } = useContext(BaseContext)

  const { } = useSolanaContract()
  const idBuffer = Buffer.from(parse(transactionId))

  const withdraw = async () => {
    setShortError(null)
    setIsSuccess(false)
    setIsError(false)

    // token address
    const mint = new PublicKey(token);
    const tokenProgramId = token_2022 
      ? new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb') 
      : anchor.utils.token.TOKEN_PROGRAM_ID;

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
    console.log("OWNER", owner)
    // add signature verification instruction
    transaction.add(Ed25519Program.createInstructionWithPublicKey({
      // program's owner, the hot wallet, signs all withdrawal requests
      // todo: should be a better way to fetch it, maybe while fetching idl
      publicKey: new PublicKey(process.env.NEXT_PUBLIC_SOLANA_OWNER).toBytes(),
      message: Buffer.from(message, 'hex'),
      signature: Buffer.from(signature, 'hex'),
    }));

    console.log("TRANSACTION", transaction, casino)

    // Calculate token account addresses using getAssociatedTokenAddress
    const recipientTokenAccount = await getAssociatedTokenAddress(
      mint,
      wallet.publicKey,
      false,
      tokenProgramId,
      anchor.utils.token.ASSOCIATED_PROGRAM_ID
    );
    
    const vaultTokenAccount = await getAssociatedTokenAddress(
      mint,
      casinoBank,
      true, // allowOwnerOffCurve = true for PDAs
      tokenProgramId,
      anchor.utils.token.ASSOCIATED_PROGRAM_ID
    );

    // Check if recipient token account exists and create it if needed
    try {
      await provider.connection.getTokenAccountBalance(recipientTokenAccount);
    } catch (error) {
      // If account doesn't exist, add instruction to create it
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        wallet.publicKey,  // payer
        recipientTokenAccount,  // ata
        wallet.publicKey,  // owner
        mint,  // mint
        tokenProgramId,  // token program id
        anchor.utils.token.ASSOCIATED_PROGRAM_ID  // ata program id
      );
      transaction.add(createATAInstruction);
    }

    // add withdrawal instruction
    if (token_2022) {
      transaction.add(
        await program.methods.processWithdrawal2022(
          idBuffer,
          new anchor.BN(amount),
        )
          .accounts({
            withdrawalPda: withdrawalPda,
            casinoBank,
            vaultTokenAccount: vaultTokenAccount,
            recipientTokenAccount: recipientTokenAccount,
            recipient: wallet.publicKey,
            tokenMint: mint,
            tokenProgram: tokenProgramId,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            instructionsSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          })
          .signers([wallet])
          .instruction());
    } else {
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
            recipientTokenAccount: anchor.utils.token.associatedAddress({ mint, owner: wallet.publicKey }),
            // recipient's public key
            recipient: wallet.publicKey,
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
    }
    try {
      setIsPending(true)
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
      const txId = await provider.sendAndConfirm(transaction);
      const url = `https://solscan.io/tx/${txId}?cluster=devnet`;
      setTxData({ url, txId })
      setIsSuccess(true)
      toast.success("Withdrawal Processed!")
    } catch (err) {
      const msg = parseContractError(err, "Error Withdrawing!")
      setShortError(msg)
      setIsError(true)
      toast.error(msg, toastOpts)
    } finally {
      setIsPending(false)
    }
  }

  return { withdraw, txData, isPending, shortError, isSuccess, isError }
}
