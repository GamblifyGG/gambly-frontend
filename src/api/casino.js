import api, { awaiter } from './client'

export function getCasinos({ chain_id, after, until, sort, order, offset, limit }) {
  console.log('GET casinos/', chain_id)
  return awaiter(api.get(`casinos/${chain_id || ''}`, {
    params: { after, until, sort, order, offset, limit }
  }))
} 

export function getCasino(chain_id, token_address) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}`), 'casino')
} 

export function searchCasinos({ q, limit, offset }) {
  return awaiter(api.get('casinos/search', {
      params: { q, limit, offset }
    })
  )
} 

export function getCasinoBurns({ chain_id, token_address, after, until, sort, order, offset, limit }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/burns`, {
      params: { after, until, sort, order, limit, offset }
    })
  )
} 

export function getCasinoBurnsVolume({ chain_id, token_address, window_duration, interval }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/burns/volume`, {
    params: { window_duration, interval }
  })
)
} 

export function getCasinoBetVolume({ chain_id, token_address, window_duration, interval }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/bet_volume`, {
      params: { window_duration, interval }
    })
  )
} 

export function getCasinoTopWinners({ chain_id, token_address, limit }) {
  return awaiter(api.get(`casinos/${chain_id}/${token_address}/top_winners`, {
      params: { limit }
    })
  )
} 

export function burnCasinoBalance(chain_id, token_address) {
  return awaiter(api.post(`casinos/${chain_id}/${token_address}/burns`), 'burn')
} 