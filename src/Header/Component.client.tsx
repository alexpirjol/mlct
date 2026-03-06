'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import styles from './Component.module.css'
import { cn } from '@/utilities/ui'
import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { formatPhoneNumber } from '@/utilities/formatPhoneNumber'

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
  const phoneNumber = data.contact?.phone
  const showPhoneNumber = data.showPhoneNumber
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  // Close menu when clicking outside the header
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

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

  const PhoneNumber = () => (
    <div className="flex-1 flex justify-center items-center gap-2 group">
      <span className="icon-wrapper circle-no text-white group-hover:text-yellow-400 transition-colors">
        <i className={`fa fa-mobile-alt fas text-xl`} aria-hidden="true"></i>
      </span>
      <a
        className="text-xl text-white group-hover:text-yellow-400 transition-colors"
        href={`tel:${phoneNumber}`}
      >
        {phoneNumber && formatPhoneNumber(phoneNumber)}
      </a>
    </div>
  )

  return (
    <header ref={headerRef} className={cn(styles['header-root'], 'relative')}>
      <div
        className={cn(
          styles['header-inner'],
          'p-4 lg:px-10 lg:py-0 min-h-[70px] lg:min-h-0 items-center justify-between',
        )}
      >
        <Link href="/" className={styles['header-logo']}>
          <Logo
            loading="eager"
            priority="high"
            url={(data as any)?.generalSttings.logo?.url}
            className="h-[45px] lg:h-[70px]"
          />
        </Link>
        {showPhoneNumber && <PhoneNumber />}
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
      <div
        className={cn(
          'lg:hidden absolute top-full left-0 right-0 z-50 overflow-hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <nav
          className={cn(
            styles['header-mobile-nav'],
            'transition-all duration-300 ease-in-out',
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
          )}
          aria-hidden={!mobileOpen}
        >
          <ul>
            <NavItems navItems={navItems} pathname={pathname} isMobile />
          </ul>
        </nav>
      </div>
    </header>
  )
}
