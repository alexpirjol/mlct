import React from 'react'
import Link from 'next/link'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { WorkHours } from './components/WorkHours'
import { Social } from './components/Social'
import WhatsAppClient from './components/WhatsApp'
import type { Footer, Setting } from '@/payload-types'

type FooterLink = NonNullable<NonNullable<Footer['categories']>[number]['links']>[number]
type FooterCategory = NonNullable<Footer['categories']>[number]

function getLinkHref(link: FooterLink): string {
  if (link.url) return link.url
  // Handle Payload relationship field structure
  if (link.page && typeof link.page === 'object') {
    if (
      'value' in link.page &&
      typeof link.page.value === 'object' &&
      link.page.value &&
      'slug' in link.page.value
    ) {
      return `/${(link.page.value as { slug?: string }).slug ?? ''}`
    }
  }
  return '#'
}

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const settings: Setting = await getCachedGlobal('setting', 1)()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer mt-auto border-t border-border dark:bg-card text-white">
      {footer.title && (
        <div className="footer-title w-full mb-6 text-center pt-8 md:pt-12">
          <h2 className="text-2xl font-bold">{footer.title}</h2>
        </div>
      )}
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <div className="footer-main w-full flex flex-col md:flex-row md:gap-8">
          <div className="footer-categories flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="footer-category">
              <h4 className="font-semibold mb-2">Contact</h4>
              <ul className="space-y-1">
                {settings.contact?.phone && (
                  <li>
                    <Link
                      href={`tel:${settings.contact?.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {settings.contact?.phone}
                    </Link>
                  </li>
                )}
                {settings.contact?.email && (
                  <li>
                    <Link
                      href={`mailto:${settings.contact?.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {settings.contact?.email}
                    </Link>
                  </li>
                )}
                {settings.contact?.address && (
                  <li>
                    <Link
                      href={settings.contact?.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {settings.contact?.address}
                    </Link>
                  </li>
                )}
                {settings.organization?.workHours && (
                  <li>
                    <WorkHours data={settings.organization?.workHours} />
                  </li>
                )}
              </ul>
            </div>
            {footer.categories?.map((cat: FooterCategory, i: number) => (
              <div className="footer-category" key={i}>
                <h4 className="font-semibold mb-2">{cat.label}</h4>
                <ul className="space-y-1">
                  {cat.links?.map((link: FooterLink, j: number) => (
                    <li key={j}>
                      <Link
                        href={getLinkHref(link)}
                        target={link.url?.startsWith('http') ? '_blank' : undefined}
                        rel={link.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom py-4 border-t border-border text-xs opacity-80">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="lex flex items-center md:items-start w-full md:w-auto">
            © {year} {settings.organization?.organizationName}
          </div>
          <div className="footer-social min-h-8 flex items-center justify-end w-full md:w-auto text-right">
            <Social data={settings.social} />
          </div>
        </div>
      </div>
      <script src="https://elfsightcdn.com/platform.js" async></script>
      {/* <div
        className="elfsight-app-7292a445-db42-40b8-bc1b-1507f78f6a46"
        data-elfsight-app-lazy
      ></div> */}
      <WhatsAppClient data={settings} />
    </footer>
  )
}
