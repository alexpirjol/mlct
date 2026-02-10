'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './Component.module.css'
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
      if (window.innerWidth > 768) {
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
      <div className={styles['header-inner']}>
        <Link href="/" className={styles['header-logo']}>
          <Logo loading="eager" priority="high" url={(data as any)?.logo?.url} />
        </Link>
        {/* Desktop nav */}
        <nav className={styles['header-desktop-nav']}>
          <ul className={styles['header-nav']}>
            <NavItems navItems={navItems} pathname={pathname} />
          </ul>
        </nav>
        {/* Hamburger for mobile */}
        <div className={styles['header-mobile-toggle']}>{Hamburger}</div>
      </div>
      {/* Mobile nav dropdown */}
      <nav
        className={styles['header-mobile-nav'] + (mobileOpen ? ' ' + styles['open'] : '')}
        aria-hidden={!mobileOpen}
      >
        <ul>
          <NavItems navItems={navItems} pathname={pathname} isMobile />
        </ul>
      </nav>
    </header>
  )
}
