import type { CSSProperties } from 'react'

/**
 * Resolves a block `background` field value into either an inline style or a
 * Tailwind class string.
 *
 * Detection rules:
 *  - hex (#...)         → inline style
 *  - rgb/rgba/hsl/hsla  → inline style
 *  - var(...)           → inline style
 *  - CSS custom prop (--...) → inline style
 *  - "transparent"      → inline style
 *  - anything else      → treated as a Tailwind class (e.g. bg-blue-500)
 */
export function getBlockBg(bg?: string | null): {
  className: string
  style: CSSProperties
} {
  if (!bg) return { className: '', style: {} }

  const v = bg.trim()

  const isCssValue =
    v === 'transparent' ||
    v.startsWith('#') ||
    v.startsWith('rgb') ||
    v.startsWith('hsl') ||
    v.startsWith('var(') ||
    v.startsWith('--')

  if (isCssValue) {
    return { className: '', style: { backgroundColor: v } }
  }

  // Assume Tailwind class
  return { className: v, style: {} }
}
