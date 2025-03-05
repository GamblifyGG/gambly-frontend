export function toWebsiteUrl(path) {
  if (path[0] === '/') path = path.substring(1)
  const base = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://' + process.env.NEXT_PUBLIC_WEBSITE_LINK
  return `${base}/${path}`
}