import { useEffect, useState } from "react";
import {  useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { toast } from 'react-toastify'
import {
  PublicKey,
} from '@solana/web3.js';

const IDL = require('@/data/casino_bank.json')


function isValidSolanaAddress(address) {
  try {
    new PublicKey(address); // This will throw an error if invalid
    return PublicKey.isOnCurve(new PublicKey(address).toBytes());
  } catch {
    return false;
  }
}

export function useSolanaContract(deposit_contract_address = null, tokenState = null) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState(null);
  const [owner, setOwner] = useState(process.env.NEXT_PUBLIC_SOLANA_OWNER);
  console.log("[SOLANA] OWNER", owner)
  let provider = null;
  // use custom provider
  try {
    provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
  } catch (error) {
    console.log('[SOLANA: PROVIDER ERROR]', error)
  }

  useEffect(() => {
    console.log('[SOLANA: PROGRAM SET]', program)
  }, [program])

  useEffect(() => {
    console.log('[SOLANA: OWNER SET]', owner)
  }, [owner])

  const fetchProgram = async (contract_address) => {
    console.log('[SOLANA CON]', provider, connection)
    if (!isValidSolanaAddress(contract_address)) {
      toast.error('Invalid contract address. Please try again.', {
        bodyClassName: 'text-xs'
      })
      return
    }
    
    const programId = new PublicKey(contract_address)
    console.log(contract_address, programId)
    // fetch idl
    let program = null;
    try {
      program = new anchor.Program(IDL, provider);
      setProgram(program);
    } catch (error) {
      console.log('[SOLANA: PROGRAM ERROR]', error)
      if (error.message.includes('{"code": 403, "message":"Access forbidden"')) {
        toast.error('Something went wrong fetching the IDL for this contract (403). Please try again later or try switching RPC in your wallet.', {
          bodyClassName: 'text-xs'
        })
      } else {
        toast.error('Could not fetch IDL for this contract. Please try again later or try switching RPC in your wallet.', {
          bodyClassName: 'text-xs'
        })
      }
    }

    // get program owner
    // let owner = null;
    // try {
    //   const { owner } = (await program.account.casinoBank.all())[0].account;
    //   setOwner(owner);
    // } catch (error) {
    //   console.log('[SOLANA: OWNER ERROR]', error)
    //   if (error.message.includes('{"code": 403, "message":"Access forbidden"')) {
    //     toast.error('Something went wrong fetching the owner for this contract (403). Please try again later or try switching RPC in your wallet.', {
    //       bodyClassName: 'text-xs'
    //     })
    //   } else {
    //     toast.error('Could not fetch owner for this contract. Please try again later or try switching RPC in your wallet.', {
    //       bodyClassName: 'text-xs'
    //     })
    //   }
    // }
  }

  if (deposit_contract_address) {

    useEffect(() => {
      if (!connection || !wallet) return
  
      fetchProgram(deposit_contract_address)
    }, [connection, wallet]);
  } else {
    useEffect(() => {
      if (!connection || !wallet || !tokenState) return
  
      fetchProgram(tokenState?.network?.deposit_contract_address)
    }, [connection, wallet, tokenState]);
  }

  return { program, owner, provider, wallet }
}
