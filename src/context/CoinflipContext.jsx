import React, { createContext, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';

// Create a context with default value
export const CoinflipContext = createContext({
  games: [],
  busy: false,
  error: null,
  success: false,
  fetchGames: () => { },
  addGame: () => { },
  removeGame: () => { },
  updateGame: () => { }
});

export const CoinflipProvider = ({ children }) => {
  const router = useRouter()
  // State to hold the games array, busy flag, error state, and success flag
  const [games, setGames] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('Hello world!');
  const [success, setSuccess] = useState(false);

  // Function to fetch games
  const fetchGames = async ({ tokenAddress, network, page, limit, state }) => {
    try {
      console.log('[FETCH]', 'Games...', state)
      setBusy(true);
      // Simulating API call delay
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/pvp/coinflip/${tokenAddress}/${network}/${page}/${limit}/${state}`
      const { data } = await axios.get(url)
      console.log('[FETCH]', data.games.games)

      let gamesArr = [];
      data.games.games.forEach(game => {
        gamesArr.push(JSON.parse(game.GameState))
      })
      // convert 

      setGames(gamesArr);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setBusy(false);
    }
  };

  const addGame = (game) => {
    const exists = games.find(x => x.id === game.id)
    if (exists) return
    console.log('[ADD]', game)
    setGames(prev => {
      return prev.some(x => x.id === game.id) ? prev : [game, ...prev]
    })
  }

  const removeGame = (id) => {
    if (!id) return
    console.log('[RMV]', id)
    setGames(prev => prev.filter(x => x.id !== id))
  }

  const updateGame = (game) => {
    setGames(prev =>
      prev.map(x => x.id === game.id ? game : x)
    )
  }

  return (
    <CoinflipContext.Provider value={{ games, busy, error, success, fetchGames, addGame, removeGame, updateGame }}>
      {children}
    </CoinflipContext.Provider>
  );
}