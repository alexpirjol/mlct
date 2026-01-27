import type { Metadata } from 'next/types'

import { CategoryCard } from '@/components/CategoryCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 50,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      heroImage: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Project Categories</h1>
        </div>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.docs.map((cat) => (
          <CategoryCard key={cat.id} doc={cat} />
        ))}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Projects`,
  }
}
