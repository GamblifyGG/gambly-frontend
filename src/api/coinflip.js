import api, { awaiter } from './client'

export function getCoinflipGames({ chain_id, token_address, after, until, sort, order, offset, limit, mine, ended }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/coinflip`, {
    params: { 
      include_casino_data: true, 
      after, 
      until, 
      sort, 
      order, 
      offset, 
      limit,
      mine,
      ended 
    }
  }))
} 

export function getCoinflipGame({ chain_id, token_address, id }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/coinflip/${id}`), 'game')
} 

export function createCoinflipGame({ chain_id, token_address, bet, amount, password }) {
  return awaiter(api.post(`casinos/${chain_id}/${token_address}/coinflip`, {
    bet,
    amount,
    ...password ? { password } : {}
  }), 'game')
} 
