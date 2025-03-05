import api, { awaiter } from './client'
const include_casino_data = false

export function getUserReferralStats() {
  return awaiter(api.get('user/referrals'))
} 

export function getUserReferralPayouts({ after, until, sort, order, offset, limit }) {
  return awaiter(api.get('user/referrals/payouts', {
    params: { include_casino_data, after, until, sort, order, offset, limit }
  }))
} 

export function getReferralCode(code) {
  return awaiter(api.get(`referrals/code/${code}`))
} 