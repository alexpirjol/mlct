import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  url?: string
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, url } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  const defaultLogo =
    'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      height={50}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={url || defaultLogo}
    />
  )
}
