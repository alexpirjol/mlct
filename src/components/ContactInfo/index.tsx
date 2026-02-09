import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { WorkHours } from '@/Footer/components/WorkHours'
import type { Setting } from '@/payload-types'

type ContactInfoProps = {
  contact?: Setting['contact']
  workHours?: NonNullable<Setting['organization']>['workHours']
  variant?: 'footer' | 'block'
  className?: string
}

// Format phone number with proper spacing
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')

  // Romanian mobile format: 07XX XXX XXX (4-3-3)
  if (digits.startsWith('07') && digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }

  // Romanian landline format: 0XX XXX XXXX (3-3-4)
  if (digits.startsWith('0') && digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  // International format with + : +XX XXX XXX XXX
  if (phone.startsWith('+')) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }

  // Default: return as-is if format doesn't match
  return phone
}

export function ContactInfo({
  contact,
  workHours,
  variant = 'footer',
  className,
}: ContactInfoProps) {
  if (!contact && !workHours?.length) return null

  type ContactItem = {
    icon: string
    label: string
    value: string | React.ReactElement
    href: string | null
  }

  const contactItems = (
    [
      contact?.phone
        ? ({
            icon: 'fa-mobile-alt',
            label: 'Telefon',
            value: formatPhoneNumber(contact.phone),
            href: `tel:${contact.phone}`,
          } as ContactItem)
        : null,
      contact?.email
        ? ({
            icon: 'fa-envelope',
            label: 'Email',
            value: contact.email,
            href: `mailto:${contact.email}`,
          } as ContactItem)
        : null,
      contact?.address
        ? ({
            icon: 'fa-map-marker-alt',
            label: 'Adresă',
            value: contact.address,
            href: contact.location || '#',
          } as ContactItem)
        : null,
      workHours?.length
        ? ({
            icon: 'fa-clock',
            label: 'Program',
            value: <WorkHours data={workHours} variant={variant === 'footer' ? 'short' : 'long'} />,
            href: null,
          } as ContactItem)
        : null,
    ] as const
  ).filter((item): item is ContactItem => item !== null)

  if (variant === 'footer') {
    return (
      <ul className={cn('space-y-1', className)}>
        {contactItems.map((item, i) => (
          <li key={i} className="fusion-li-item flex items-start gap-2">
            <span className="icon-wrapper circle-no mt-1">
              <i className={`fa ${item.icon} fas text-lg`} aria-hidden="true"></i>
            </span>
            <div className="fusion-li-item-content">
              {item.href && item.href !== '#' ? (
                <Link
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="hover:underline"
                >
                  {item.value}
                </Link>
              ) : (
                <span>{item.value}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  // Block variant - display in columns
  const totalColumns = contactItems.length
  const gridColsClasses: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }
  const gridColsClass = gridColsClasses[totalColumns] || 'md:grid-cols-2'

  return (
    <div className={cn('grid grid-cols-1 gap-8', gridColsClass, className)}>
      {contactItems.map((item, i) => (
        <div key={i} className="contact-item flex flex-col items-center text-center">
          <div className="icon-wrapper mb-3">
            <i className={`fa ${item.icon} fas text-2xl text-accent`} aria-hidden="true"></i>
          </div>
          <h5 className="font-semibold mb-2 text-sm">{item.label}</h5>
          <div className="contact-value">
            {item.href && item.href !== '#' ? (
              <Link
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="hover:underline"
              >
                {item.value}
              </Link>
            ) : (
              <div>{item.value}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
