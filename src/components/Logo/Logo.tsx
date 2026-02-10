import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  url?: string | null
  alt?: string
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, url, alt } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={alt}
      height={50}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx(' w-full h-[70px]', className)}
      src={url as string}
    />
  )
}
