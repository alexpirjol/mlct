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
                  <li className="fusion-li-item flex items-start gap-2">
                    <span className="icon-wrapper circle-no mt-1">
                      <i className="fa fa-mobile-alt fas text-lg" aria-hidden="true"></i>
                    </span>
                    <div className="fusion-li-item-content">
                      <Link
                        href={`tel:${settings.contact?.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {settings.contact?.phone}
                      </Link>
                    </div>
                  </li>
                )}
                {settings.contact?.email && (
                  <li className="fusion-li-item flex items-start gap-2">
                    <span className="icon-wrapper circle-no mt-1">
                      <i className="fa fa-envelope fas text-lg" aria-hidden="true"></i>
                    </span>
                    <div className="fusion-li-item-content">
                      <Link
                        href={`mailto:${settings.contact?.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {settings.contact?.email}
                      </Link>
                    </div>
                  </li>
                )}
                {settings.contact?.address && (
                  <li className="fusion-li-item flex items-start gap-2">
                    <span className="icon-wrapper circle-no mt-1">
                      <i className="fa fa-map-marker-alt fas text-lg" aria-hidden="true"></i>
                    </span>
                    <div className="fusion-li-item-content">
                      <Link
                        href={settings.contact?.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {settings.contact?.address}
                      </Link>
                    </div>
                  </li>
                )}
                {!!settings.organization?.workHours?.length && (
                  <li className="fusion-li-item flex items-start gap-2">
                    <span className="icon-wrapper circle-no mt-1">
                      <i className="fa fa-clock fas text-lg" aria-hidden="true"></i>
                    </span>
                    <div className="fusion-li-item-content">
                      <WorkHours data={settings.organization?.workHours} />
                    </div>
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
      <div className="footer-bottom py-6 border-t border-border text-xs opacity-80">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 md:px-20 lg:px-24">
          <div className="flex items-center md:items-start w-full md:w-auto md:pl-4">
            © {year} {settings.organization?.organizationName}
          </div>
          <div className="footer-social min-h-8 flex items-center justify-end w-full md:w-auto text-right md:pr-4">
            <Social data={settings.social} />
          </div>
        </div>
      </div>

      <WhatsAppClient data={settings} />
    </footer>
  )
}
