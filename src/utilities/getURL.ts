import canUseDOM from './canUseDOM'

const normalizeUrl = (url: string) =>
  (url.startsWith('http') ? url : `https://${url}`).replace(/\/$/, '')

export const getServerSideURL = () => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) return normalizeUrl(process.env.NEXT_PUBLIC_SERVER_URL)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  return 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
