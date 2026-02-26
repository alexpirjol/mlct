import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

export interface Seo {
  siteTitle?: string
  siteDescription?: string
  logo?: {
    url?: string
    alt?: string
    width?: number
    height?: number
  } | null
}

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: '',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: '',
  title: '',
}

export const mergeOpenGraph = (og?: Metadata['openGraph'], seo?: Seo): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    title: seo?.siteTitle || og?.title || defaultOpenGraph.title,
    description: seo?.siteDescription || og?.description || defaultOpenGraph.description,
    siteName: seo?.siteTitle || og?.siteName || defaultOpenGraph.siteName,
    images:
      seo?.logo && typeof seo.logo === 'object' && 'url' in seo.logo && seo.logo.url
        ? [{ url: seo.logo.url }]
        : og?.images || defaultOpenGraph.images,
  }
}
