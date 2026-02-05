import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { Media } from '@/components/Media'
import { PostHero } from '@/heros/PostHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export const revalidate = 600

type Args = {
  params: Promise<{
    category: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { category } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  if (!category) notFound()

  // Find the category by slug to get its ID
  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: category } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  const categoryDoc = categoryResult.docs[0]

  // Pagination: get page number from search params or default to 1
  // (If you want to support pagination by query param, adjust here)
  const pageNumber = 1

  const projects = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 12,
    page: pageNumber,
    overrideAccess: false,
    where: {
      category: {
        equals: categoryDoc.id,
      },
    },
  })

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {draft && <LivePreviewListener />}

      <PostHero project={categoryDoc} />

      <div className="flex flex-col items-center gap-4 pt-8">
        {categoryDoc.layout && <RenderBlocks blocks={categoryDoc.layout} />}
      </div>
    </article>
  )
}

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
  const { totalDocs } = await payload.count({
    collection: 'projects',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
