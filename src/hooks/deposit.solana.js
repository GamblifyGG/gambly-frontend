import { useSolanaContract } from './solana'
import * as anchor from '@coral-xyz/anchor';
import {
  SystemProgram,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { useState } from 'react';

export function useSolanaDeposit({
  amount,
  token
}) {
  const [shortError, setShortError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [txData, setTxData] = useState(null)
  const { wallet, owner, program, provider } = useSolanaContract(null, token)

  const { } = useSolanaContract()

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
    console.log("Depositing", token)
    // token address
    const mint = new PublicKey(token?.address);

    // derive casino bank pda
    const [casinoBank] = PublicKey.findProgramAddressSync(
      [new TextEncoder().encode('casino_bank')],
      program.programId,
    );
    console.log('[SOLANA: CASINO BANK]', casinoBank)
    let vaultTokenAccount = anchor.utils.token.associatedAddress({ mint, owner: casinoBank });
    console.log('[SOLANA: VAULT TOKEN ACCOUNT]', vaultTokenAccount)
    let userTokenAccount = anchor.utils.token.associatedAddress({ mint, owner: wallet.publicKey });
    console.log('[SOLANA: USER TOKEN ACCOUNT]', userTokenAccount)
    console.log("Program", program)
    if (token?.token_2022 === false) {
      try {
        const txId = await program.rpc.deposit(
          tokenAmount,
          {
            accounts: {
              user: wallet.publicKey,
              tokenMint: mint,
              tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
              associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
              userTokenAccount,
              casinoBank,
              vaultTokenAccount,
              rent: SYSVAR_RENT_PUBKEY,
              systemProgram: SystemProgram.programId,
            },
          },
        );

        const url = `https://solscan.io/tx/${txId}?cluster=mainnet`;
        setTxData({ url, txId })
        setIsSuccess(true)
      } catch (err) {
        console.error(err)
        setShortError(err?.message)
      } finally {
        setIsPending(false)
      }
    } else {
      try {
        console.log("Depositing token-2022", token);
        
        // Define token program ID
        const TOKEN_2022_PROGRAM_ID = new anchor.web3.PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
        const ASSOCIATED_TOKEN_PROGRAM_ID = new anchor.web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
        
        // Derive user token account using SPL Token function
        const userTokenAccount = await getAssociatedTokenAddress(
          mint,                    // mint
          wallet.publicKey,        // owner
          false,                   // allowOwnerOffCurve
          TOKEN_2022_PROGRAM_ID,   // programId
          ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId
        );
        
        // Derive vault token account
        const [casinoBank] = PublicKey.findProgramAddressSync(
          [new TextEncoder().encode('casino_bank')],
          program.programId,
        );
        
        const vaultTokenAccount = await getAssociatedTokenAddress(
          mint,                    // mint
          casinoBank,              // owner
          true,                    // allowOwnerOffCurve (PDA)
          TOKEN_2022_PROGRAM_ID,   // programId
          ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId
        );
        
        // Check if user token account exists
        const userAccountInfo = await provider.connection.getAccountInfo(userTokenAccount);
        const tx = new anchor.web3.Transaction();

        // Create ATA if needed
        if (!userAccountInfo) {
          console.log("Creating ATA at address:", userTokenAccount.toString());
          const createATAInstruction = createAssociatedTokenAccountInstruction(
            wallet.publicKey,        // payer
            userTokenAccount,        // associatedToken
            wallet.publicKey,        // owner
            mint,                    // mint
            TOKEN_2022_PROGRAM_ID,   // programId
            ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId
          );
          tx.add(createATAInstruction);
        }

        // Add deposit instruction
        const depositInstruction = await program.methods.deposit2022(tokenAmount)
          .accounts({
            user: wallet.publicKey,
            tokenMint: mint,
            tokenProgram: TOKEN_2022_PROGRAM_ID.toString(),
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID.toString(),
            userTokenAccount,
            casinoBank,
            vaultTokenAccount,
            rent: SYSVAR_RENT_PUBKEY,
            systemProgram: SystemProgram.programId
          })
          .instruction();
        tx.add(depositInstruction);

        // Simulate first
        console.log("Simulating transaction...");
        const simulation = await provider.simulate(tx);
        console.log("Simulation logs:", simulation.logs);

        // Send transaction
        const txId = await provider.sendAndConfirm(tx);
        
        const url = `https://solscan.io/tx/${txId}?cluster=mainnet`;
        setTxData({ url, txId })
        setIsSuccess(true)
      } catch (err) {
        console.error("Deposit failed:", err);
        console.error("Error details:", err.logs);
        setShortError(err?.message || "Transaction failed");
      } finally {
        setIsPending(false)
      }
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
