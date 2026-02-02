import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    category: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { category } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  if (!category) notFound()

  // Find the category by slug to get its ID
  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: category } },
    limit: 1,
    overrideAccess: false,
  })
  const categoryDoc = categoryResult.docs[0]
  if (!categoryDoc) notFound()

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
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Projects</h1>
        </div>
      </div>
      <div className="container mb-8">
        <PageRange
          collection="projects"
          currentPage={projects.page}
          limit={12}
          totalDocs={projects.totalDocs}
        />
      </div>
      <CollectionArchive projects={projects.docs} />
      <div className="container">
        {projects?.page && projects?.totalPages > 1 && (
          <Pagination page={projects.page} totalPages={projects.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { category } = await paramsPromise
  return {
    title: `${category || ''}`,
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
