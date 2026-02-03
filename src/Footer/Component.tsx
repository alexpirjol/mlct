import React from 'react'
import Link from 'next/link'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Footer } from '@/payload-types'

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
  const year = new Date().getFullYear()
  const hasSocial = Array.isArray(footer.socialLinks) && footer.socialLinks.length > 0

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
          {hasSocial && (
            <div className="footer-social md:w-1/4 flex flex-col items-end">
              <span className="mb-2">Urmărește-ne pe:</span>
              <div className="footer-social-links flex gap-3">
                {((footer.socialLinks ?? []) as NonNullable<Footer['socialLinks']>).map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="footer-social-link text-xl"
                  >
                    {s.icon ? <i className={s.icon} aria-hidden="true" /> : s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="footer-bottom text-center py-4 border-t border-border text-xs opacity-80">
        <span>© {year} MAS WoodShop.</span>
      </div>
    </footer>
  )
}
