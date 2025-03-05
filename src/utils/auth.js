const AUTH_LKEY = "AUTH_V3_2" // Change this when auth structure changes

function setSingleEvmKey(chainId) {
  if (!isEvm(chainId)) return chainId
  return "1"
}

export function isEvm(chainId) {
  if (!chainId) return false
  chainId = Number(chainId)
  return !isSolana(chainId)
  // return [11155111,1].includes(chainId)
}

export function isSolana(chainId) {
  if (!chainId) return false
  chainId = Number(chainId)
  return chainId == 101
}

export function getAuth() {
  const auth = localStorage.getItem(AUTH_LKEY)
  if (!auth) return null
  return JSON.parse(auth)
}

export function getChainAuth(chainId) {
  chainId = chainId.toString()
  chainId = setSingleEvmKey(chainId)
  const auth = getAuth()
  if (!auth) return null
  return auth[chainId]
}

export function getCurrentChainAuth() {
  let chainId = localStorage.getItem("chainId")
  if (!chainId) return null

  chainId = setSingleEvmKey(chainId)
  return getChainAuth(chainId)
}

export function saveCurrentChainAuth(data) {
  let chainId = localStorage.getItem("chainId")

  if (!chainId) return null
  chainId = setSingleEvmKey(chainId)
  saveChainAuth(chainId, data)
}

export function saveChainAuth(chainId, data) {
  chainId = chainId.toString()
  chainId = setSingleEvmKey(chainId)
  const savedAuth = getAuth() || {}
  if (data) {
    data.chainId = chainId
    data.isEvm = isEvm(chainId)
    data.isSolana = isSolana(chainId)
  }
  savedAuth[chainId] = data
  localStorage.setItem(AUTH_LKEY, JSON.stringify(savedAuth))
  return savedAuth
}

export function removeChainAuth(chainId) {
  const savedAuth = getAuth() || {}
  chainId = setSingleEvmKey(chainId)

  if (savedAuth[chainId]) {
    delete savedAuth[chainId]
  }

  localStorage.setItem(AUTH_LKEY, JSON.stringify(savedAuth))
  return savedAuth
}

export function removeEvmAuth() {
  const savedAuth = getAuth() || {}

  for (let k in savedAuth) {
    if (isEvm(k)) delete savedAuth[k]
  }

  localStorage.setItem(AUTH_LKEY, JSON.stringify(savedAuth))
  return savedAuth
}