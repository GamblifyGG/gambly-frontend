export function parseContractError(error, defaultMessage = "") {
  if (error?.message) {
    if (error?.message.includes("InsufficientUserTokenAllowance")) {
      return "Insufficient Token Allowance! Please increase approval amount."
    }

    if (error?.message.includes("User rejected the request")) {
      return "You rejected the request!"
    }
  }

  if (error?.metaMessages && error?.metaMessages?.length) {
    return error?.metaMessages[0]
  }

  if (error?.shortMessage) return error?.shortMessage

  if (error?.message) return error?.message

  return defaultMessage || 'Unknown Contract error. Try again!'
}