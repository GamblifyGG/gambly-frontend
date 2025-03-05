import api, { awaiter } from './client'

export function getRpsGames({ chain_id, token_address, after, until, sort, order, offset, limit, mine, ended }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/rps`, {
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

export function getRpsGame({ chain_id, token_address, id }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/rps/${id}`), 'game')
} 

export function createRpsGame({ chain_id, token_address, bet, amount, password }) {
  return awaiter(api.post(`casinos/${chain_id}/${token_address}/rps`, {
    bet,
    amount,
    ...password ? { password } : {}
  }), 'game')
} 
