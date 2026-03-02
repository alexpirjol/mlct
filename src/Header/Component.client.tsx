'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './Component.module.css'
import { cn } from '@/utilities/ui'
import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'

import type { Header as HeaderType, Setting as SettingsType } from '@/payload-types'

interface HeaderClientProps {
  data: HeaderType & SettingsType
}

interface NavItemsProps {
  navItems: HeaderType['navItems']
  pathname: string
  isMobile?: boolean
}

const NavItems: React.FC<NavItemsProps> = ({ navItems, pathname, isMobile = false }) => {
  const getHref = (link: any) => {
    if (
      link?.type === 'reference' &&
      typeof link?.reference?.value === 'object' &&
      link?.reference?.value?.slug
    ) {
      return `${link?.reference?.relationTo !== 'pages' ? `/${link?.reference?.relationTo}` : ''}/${link?.reference?.value?.slug}`
    }
    return link?.url || ''
  }

  return (
    <>
      {navItems?.map((item: any, i: number) => {
        const href = getHref(item.link)
        // Match exact path or if current path starts with the href followed by a /
        // This prevents /projects1 from matching /projects
        const isActive =
          pathname === href ||
          (href !== '/' &&
            pathname.startsWith(href) &&
            (pathname[href.length] === '/' || pathname[href.length] === '?'))
        return (
          <li
            key={i}
            className={[
              styles['header-link'],
              styles['header-nav-item'],
              isActive ? styles['active'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <CMSLink className={styles['header-link-inner']} {...item.link}>
              <span className={styles['header-link-bg']}></span>
            </CMSLink>
            {item.link?.subItems?.length > 0 && (
              <div
                className={isMobile ? styles['header-mobile-submenu'] : styles['header-submenu']}
              >
                {isMobile ? (
                  <ul>
                    {item.link.subItems.map((sub: any, j: number) => {
                      const subHref = getHref(sub)
                      const isSubActive = pathname === subHref
                      return (
                        <li
                          key={j}
                          className={
                            styles['header-submenu-item'] +
                            (isSubActive ? ' ' + styles['active'] : '')
                          }
                        >
                          <Link href={subHref || '#'}>
                            <span className={styles['header-link-bg']}></span>
                            {sub.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  item.link.subItems.map((sub: any, j: number) => {
                    const subHref = getHref(sub)
                    const isSubActive = pathname === subHref
                    return (
                      <Link
                        key={j}
                        href={subHref || '#'}
                        className={
                          styles['header-submenu-item'] +
                          (isSubActive ? ' ' + styles['active'] : '')
                        }
                      >
                        <span className={styles['header-link-bg']}></span>
                        {sub.label}
                      </Link>
                    )
                  })
                )}
              </div>
            )}
          </li>
        )
      })}
    </>
  )
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const pathname = usePathname()
  const navItems = data.navItems || []
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Hamburger icon
  const Hamburger = (
    <button
      className={styles['header-hamburger']}
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={mobileOpen}
      aria-controls="header-mobile-nav"
      type="button"
      onClick={() => setMobileOpen((v) => !v)}
    >
      <span className={styles['header-hamburger-bar']}></span>
      <span className={styles['header-hamburger-bar']}></span>
      <span className={styles['header-hamburger-bar']}></span>
    </button>
  )

  return (
    <header className={styles['header-root']}>
      <div className={cn(styles['header-inner'], 'p-4 lg:px-10 lg:py-0 min-h-[70px] lg:min-h-0')}>
        <Link href="/" className={styles['header-logo']}>
          <Logo loading="eager" priority="high" url={(data as any)?.generalSttings.logo?.url} />
        </Link>
        {/* Desktop nav */}
        <nav className={cn(styles['header-desktop-nav'], 'hidden lg:flex')}>
          <ul className={styles['header-nav']}>
            <NavItems navItems={navItems} pathname={pathname} />
          </ul>
        </nav>
        {/* Hamburger for mobile */}
        <div className={cn(styles['header-mobile-toggle'], 'flex lg:hidden ml-auto')}>
          {Hamburger}
        </div>
      </div>
      {/* Mobile nav dropdown */}
      <nav
        className={cn(
          styles['header-mobile-nav'],
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileOpen ? 'max-h-[800px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0',
        )}
        aria-hidden={!mobileOpen}
      >
        <ul>
          <NavItems navItems={navItems} pathname={pathname} isMobile />
        </ul>
      </nav>
    </header>
  )
}
