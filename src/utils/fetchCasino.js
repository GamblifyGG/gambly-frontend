const { convertNetworkNameToId } = require('./convertNetworkID')

const fetchCasino = async (token, networkName) => {
  const networkId = convertNetworkNameToId(networkName)
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/casinos/${token}/${networkId}`
  console.log('[FETCH CASINO]', url)

  const res = await fetch(url)
  const data = await res.json()
  if (data.error) throw new Error(data.message)
  return data
}

module.exports = {
  fetchCasino
}