export default function getAuthTokens() {
  return {
    accessToken: localStorage.getItem('token') ? localStorage.getItem('token') : null,
    refreshToken: localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null,
  }
}
