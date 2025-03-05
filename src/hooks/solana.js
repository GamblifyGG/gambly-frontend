import { useEffect, useState } from "react";
import {  useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import {
  PublicKey,
} from '@solana/web3.js';

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
  const [owner, setOwner] = useState(null);
  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });

  useEffect(() => {
    console.log('[SOLANA: PROGRAM SET]', program)
  }, [program])

  useEffect(() => {
    console.log('[SOLANA: OWNER SET]', owner)
  }, [owner])

  const fetchProgram = async (contract_address) => {
    console.log('[SOLANA CON]', provider, connection)
    if (!isValidSolanaAddress(contract_address)) return
    
    const programId = new PublicKey(contract_address)
    console.log(contract_address)

    // fetch idl, instantiate program
    const idl = await anchor.Program.fetchIdl(programId, provider);
    console.log('[IDL]', idl)
    const program = new anchor.Program(idl, provider);
    setProgram(program);

    // get program owner
    const { owner } = (await program.account.casinoBank.all())[0].account;
    setOwner(owner);
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
