import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  projects: '/projects',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  data?: any // Additional document data for path generation
}

export const generatePreviewPath = async ({ collection, slug, req, data }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  let path = `${collectionPrefixMap[collection]}/${encodedSlug}`

  // For projects collection, include the category slug in the path
  if (collection === 'projects') {
    // First try to get category from passed data, then from req.data
    const docData = data || req.data
    let categorySlug: string | null = null
    
    if (typeof docData?.category === 'object' && docData.category?.slug) {
      // Category is already populated with slug
      categorySlug = docData.category.slug
    } else if (typeof docData?.category === 'string') {
      // Category is just an ID, need to fetch it
      try {
        const category = await req.payload.findByID({
          collection: 'categories',
          id: docData.category,
          depth: 0,
        })
        categorySlug = category.slug
      } catch (error) {
        console.error('Error fetching category for preview:', error)
      }
    }
    
    if (categorySlug) {
      path = `/projects/${encodeURIComponent(categorySlug)}/${encodedSlug}`
    }
  }

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
