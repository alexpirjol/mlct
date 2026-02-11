import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { PostHero } from '@/heros/PostHero'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PayloadRedirects } from '@/components/PayloadRedirects'

export const revalidate = 600

type Args = {
  params: Promise<{
    category: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { category } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(category)
  const categoryDoc = await queryCategoriesBySlug({ slug: decodedSlug })

  const url = '/projects/' + encodeURIComponent(category)
  if (!categoryDoc) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <PostHero project={categoryDoc} />
      <div className="container">
        {categoryDoc.layout && <RenderBlocks blocks={categoryDoc.layout} />}
      </div>
    </article>
  )
}

const queryCategoriesBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'categories',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return result.docs?.[0] || null
})

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { category } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: category } },
    limit: 1,
    overrideAccess: false,
  })
  const categoryDoc = categoryResult.docs[0]

  return {
    title: categoryDoc?.meta?.title || categoryDoc?.title || category,
    description: categoryDoc?.meta?.description,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 1000, // adjust as needed
    pagination: false,
  })

  return categories.map((cat: { slug: string }) => ({
    category: cat.slug,
  }))
}
