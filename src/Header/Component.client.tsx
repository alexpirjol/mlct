'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './Component.module.css'
import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'

import type { Header as HeaderType, Setting as SettingsType } from '@/payload-types'

interface HeaderClientProps {
  data: HeaderType | SettingsType
}

interface NavItemsProps {
  navItems: any[]
  pathname: string
  isMobile?: boolean
}

const NavItems: React.FC<NavItemsProps> = ({ navItems, pathname, isMobile = false }) => {
  return (
    <>
      {navItems.map((item: any, i: number) => {
        const isActive = pathname === (item.link?.url || '')
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
                      const isSubActive = pathname === (sub.url || '')
                      return (
                        <li
                          key={j}
                          className={
                            styles['header-submenu-item'] +
                            (isSubActive ? ' ' + styles['active'] : '')
                          }
                        >
                          <Link href={sub.url || '#'}>
                            <span className={styles['header-link-bg']}></span>
                            {sub.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  item.link.subItems.map((sub: any, j: number) => {
                    const isSubActive = pathname === (sub.url || '')
                    return (
                      <Link
                        key={j}
                        href={sub.url || '#'}
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
  // Storing the value in a useState to avoid hydration errors
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const navItems = (data as any)?.navItems || []
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
    setMobileOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

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
    <header className={styles['header-root']} {...(theme ? { 'data-theme': theme } : {})}>
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
