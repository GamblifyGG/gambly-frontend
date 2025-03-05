import api, { awaiter } from './client'

export function getUser() {
  return awaiter(api.get('user'), 'user')
} 

export function getUserTokenBalance(chainId, tokenAddress) {
  return awaiter(api.get(`user/balances/${chainId}/${tokenAddress}`), 'balance')
} 

export function getUserBalance({ chain_id, after, until, sort, order, limit, offset } = {}) {
  return awaiter(api.get(`user/balances/${chain_id ? chain_id : ''}`, {
    params: { after, until, sort, order, limit, offset }
  }))
}

export function getUserTransaction(chainId, token, id) {
  return awaiter(api.get(`user/transactions/${chainId}/${token}/${id}`), 'transaction')
}

export function getUserTransactions({ include_token_data, after, until, sort, order, limit, offset }) {
  return awaiter(api.get('user/transactions', {
      params: { include_token_data, after, until, sort, order, limit, offset }
    })
  ) 
}

export function getUserTokenTransactions(chainId, token, { include_token_data, after, until, sort, order, limit, offset }) {
  return awaiter(api.get(`user/transactions/${chainId}/${token}`, {
      params: { include_token_data, after, until, sort, order, limit, offset }
    })
  )
}

export function getUserReferralStats() {
  return awaiter(api.get('user/referrals'))
}

export function getUserReferralPayouts() {
  return awaiter(api.get('user/referrals/payouts'))
}

export function getUserStaking() {
  return awaiter(api.get('user/staking'))
}

export function getUserStakingLocks({ after, until, sort, order, offset, limit }) {
  return awaiter(api.get('user/staking/locks', {
    params: { 
      // types: ['locked', 'unlocked'], 
      after, until, sort, order, offset, limit 
    }
  }))
}

export function getUserStakingPayouts({ after, until, sort, order, offset, limit }) {
  return awaiter(api.get('user/staking/payouts', {
    params: { include_casino_data: false, after, until, sort, order, offset, limit }
  }))
}

export function requestWithdrawal({ chainId, tokenAddress, amount }) {
  return awaiter(api.post(`user/balances/${chainId}/${tokenAddress}/withdraw`, {
      amount
    })
  )
}

export function getUserBets(chainId, tokenAddress, { sort = 'created', order = 'desc', limit = 10, offset = 0 } = {}) {
  return awaiter(
    api.get(`user/bets/${chainId}/${tokenAddress}`, {
      params: {
        sort,
        order,
        limit,
        offset
      }
    })
  )
}
