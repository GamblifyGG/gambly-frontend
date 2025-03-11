import api, { awaiter } from './client'

export function createLock({ amount }) {
    console.log("LOCKING" , amount)
    return awaiter(api.post(`user/staking/lock`, {
        amount: amount.toString(), // Convert BigInt to string for serialization
    }))
}

export function unlockLock({ lockId }) {
    return awaiter(api.post(`user/staking/unlock`, {
        lockId: lockId,
    }))
}

