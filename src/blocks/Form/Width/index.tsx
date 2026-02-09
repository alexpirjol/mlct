import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  // Calculate flex-basis accounting for gap-8 (2rem)
  const calculateWidth = () => {
    if (!width || width === 100) return '100%'
    // For percentage widths, subtract proportional gap space
    // With gap-8 (2rem), for 50% we need calc((100% - 2rem) / 2)
    const numericWidth = typeof width === 'string' ? parseFloat(width) : width
    if (numericWidth === 50) {
      return 'calc((100% - 2rem) / 2)'
    }
    return `${width}%`
  }

  return (
    <div
      className={className}
      style={{
        flex: `0 0 ${calculateWidth()}`,
        maxWidth: calculateWidth(),
        minWidth: 0,
      }}
    >
      {children}
    </div>
  )
}
