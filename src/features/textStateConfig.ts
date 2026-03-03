/**
 * Shared TextState configuration.
 *
 * This file is consumed by:
 *  - `src/fields/defaultLexical.ts`  (server) – passed directly to TextStateFeature
 *  - `src/components/RichText/index.tsx` (frontend) – used to map state keys → React inline styles
 *
 * IMPORTANT: This file uses `defaultColors` from `@payloadcms/richtext-lexical`, which is a
 * plain JS object with no Node.js APIs, so it can be used in both server and RSC contexts.
 */

import { defaultColors } from '@payloadcms/richtext-lexical'
import type React from 'react'

// ── Helpers ──────────────────────────────────────────────────────────────────

function hyphenToCamel(s: string): string {
  return s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

function toReact(css: Record<string, string>): React.CSSProperties {
  return Object.fromEntries(
    Object.entries(css).map(([k, v]) => [hyphenToCamel(k), v]),
  ) as React.CSSProperties
}

// ── Payload config object (hyphen-case CSS, as required by TextStateFeature) ─

export const textStateForPayload = {
  color: defaultColors.text,
  highlight: defaultColors.background,
  transform: {
    uppercase: { label: 'Uppercase', css: { 'text-transform': 'uppercase' as const } },
    lowercase: { label: 'Lowercase', css: { 'text-transform': 'lowercase' as const } },
    capitalize: { label: 'Capitalize', css: { 'text-transform': 'capitalize' as const } },
  },
  fontSize: {
    xs: { label: 'XS', css: { 'font-size': '0.75em' as const, 'line-height': '1rem' as const } },
    small: {
      label: 'Small',
      css: { 'font-size': '0.875em' as const, 'line-height': '1.25rem' as const },
    },
    large: {
      label: 'Large',
      css: { 'font-size': '1.25em' as const, 'line-height': '1.75rem' as const },
    },
    xl: { label: 'XL', css: { 'font-size': '1.5em' as const, 'line-height': '2rem' as const } },
    '2xl': { label: '2XL', css: { 'font-size': '2em' as const, 'line-height': '2.5rem' as const } },
  },
}

// ── React CSS map (camelCase, for JSX inline styles) ─────────────────────────
// Maps stateKey → stateValueKey → React.CSSProperties
// Used by the frontend RichText text-node converter.

export const textStateCSSMap: Record<string, Record<string, React.CSSProperties>> = {
  color: Object.fromEntries(
    Object.entries(defaultColors.text).map(([k, { css }]) => [
      k,
      toReact(css as Record<string, string>),
    ]),
  ),
  highlight: Object.fromEntries(
    Object.entries(defaultColors.background).map(([k, { css }]) => [
      k,
      toReact(css as Record<string, string>),
    ]),
  ),
  transform: {
    uppercase: { textTransform: 'uppercase' },
    lowercase: { textTransform: 'lowercase' },
    capitalize: { textTransform: 'capitalize' },
  },
  fontSize: {
    xs: { fontSize: '0.75em', lineHeight: '1rem' },
    small: { fontSize: '0.875em', lineHeight: '1.25rem' },
    large: { fontSize: '1.25em', lineHeight: '1.75rem' },
    xl: { fontSize: '1.5em', lineHeight: '2rem' },
    '2xl': { fontSize: '2em', lineHeight: '2.5rem' },
  },
}

// ── Icon toolbar values ───────────────────────────────────────────────────────
// Used by the icon feature client to build toolbar colour/bg/size pickers.
// Each entry provides the CSS value to store directly on the icon node.

export const iconColorOptions = Object.entries(defaultColors.text).map(([key, { label, css }]) => ({
  key,
  label,
  cssValue: (css as Record<string, string>).color,
}))

export const iconBgColorOptions = Object.entries(defaultColors.background).map(
  ([key, { label, css }]) => ({
    key,
    label,
    cssValue: (css as Record<string, string>)['background-color'],
  }),
)

export const iconFontSizeOptions = Object.entries(textStateForPayload.fontSize).map(
  ([key, { label, css }]) => ({
    key,
    label,
    cssValue: (css as Record<string, string>)['font-size'],
  }),
)
