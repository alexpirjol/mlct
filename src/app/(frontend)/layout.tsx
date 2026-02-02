import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'

import { getSiteSEO } from '@/utilities/getSiteSEO'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seo = await getSiteSEO()
  const lang = seo.language || 'ro'
  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={lang}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar adminBarProps={{}} />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { getSiteSEO } = await import('@/utilities/getSiteSEO')
  const seo = await getSiteSEO()
  const lang = seo.language || 'ro'
  return {
    title: seo.siteTitle,
    description: seo.siteDescription,
    metadataBase: new URL((await import('@/utilities/getURL')).getServerSideURL()),
    openGraph: {
      title: seo.siteTitle,
      description: seo.siteDescription,
      url: seo.siteUrl,
      type: 'website',
      locale: lang === 'ro' ? 'ro_RO' : lang,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '',
    },
    alternates: {
      canonical: seo.siteUrl,
    },
    other: {
      language: lang,
    },
  }
}
