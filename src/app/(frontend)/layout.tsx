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

import { getSiteSettings } from '@/utilities/getSiteSettings'
import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  const lang = settings.generalSttings?.language || 'ro'
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
  const { getSiteSettings } = await import('@/utilities/getSiteSettings')
  const settings = await getSiteSettings()
  const lang = settings.generalSttings?.language || 'ro'
  return {
    title: settings.generalSttings?.siteTitle ?? '',
    description: settings.generalSttings?.siteDescription ?? '',
    metadataBase: new URL((await import('@/utilities/getURL')).getServerSideURL()),
    openGraph: {
      title: settings.generalSttings?.siteTitle ?? '',
      description: settings.generalSttings?.siteDescription ?? '',
      url: settings.generalSttings?.siteUrl ?? '',
      type: 'website',
      locale: lang === 'ro' ? 'ro_RO' : lang,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '',
    },
    alternates: {
      canonical: settings.generalSttings?.siteUrl ?? '',
    },
    other: {
      language: lang,
    },
  }
}
