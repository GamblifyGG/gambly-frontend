import api, { awaiter } from './client'

export function getPokerTables({ chain_id, token_address, after, until, sort, order, offset, limit }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/poker`, {
    params: { after, until, sort, order, offset, limit }
  }))
} 

export function getPokerTable({ chain_id, token_address, id }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/poker/${id}`), 'table')
} 

export function createPokerTable({ chain_id, token_address, move_time_limit, buy_in, max_players, _private }) {
  return awaiter(api.post(`casinos/${chain_id}/${token_address}/poker`, {
    move_time_limit, buy_in, max_players,
    private: _private
  }))
} 
