/**
 * Shared TextState configuration.
 *
 * This file is consumed by:
 *  - `src/fields/defaultLexical.ts`  (server) – passed directly to TextStateFeature
 *  - `src/components/RichText/index.tsx` (frontend) – used to map state keys → React inline styles
 *
 * IMPORTANT: This file has no Node.js dependencies and can be safely used in both server and RSC contexts.
 */

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

// ── Theme color palette (shared by text, highlight, and icon pickers) ─────────

const themeColors = {
  accent: { label: 'Accent', hex: '#d4b804' },
  destructive: { label: 'Destructive', hex: '#dc2626' },
  mutedForeground: { label: 'Muted', hex: '#737373' },
  chart1: { label: 'Chart 1 (Coral)', hex: '#e76f51' },
  chart2: { label: 'Chart 2 (Teal)', hex: '#2a9d8f' },
  chart3: { label: 'Chart 3 (Dark)', hex: '#264653' },
  chart4: { label: 'Chart 4 (Sand)', hex: '#e9c46a' },
  chart5: { label: 'Chart 5 (Amber)', hex: '#f4a261' },
} as const

const themeTextColors = Object.fromEntries(
  Object.entries(themeColors).map(([key, { label, hex }]) => [key, { label, css: { color: hex } }]),
)

const themeBgColors = Object.fromEntries(
  Object.entries(themeColors).map(([key, { label, hex }]) => [
    key,
    { label, css: { 'background-color': hex } },
  ]),
)

// ── Payload config object (hyphen-case CSS, as required by TextStateFeature) ─

export const textStateForPayload = {
  color: themeTextColors,
  highlight: themeBgColors,
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
  effect: {
    'fade-in': { label: 'Fade In', css: { animation: 'lx-fade-in 0.8s ease-in both' as const } },
    'slide-up': {
      label: 'Slide Up',
      css: {
        animation: 'lx-slide-up 0.6s ease-out both' as const,
        display: 'inline-block' as const,
      },
    },
    pulse: { label: 'Pulse Glow', css: { animation: 'lx-pulse 2s ease-in-out infinite' as const } },
    shake: {
      label: 'Shake',
      css: { animation: 'lx-shake 0.5s ease-in-out' as const, display: 'inline-block' as const },
    },
    counter: {
      label: 'Counter',
      css: {
        display: 'inline-block' as const,
      },
    },
  },
}

// ── React CSS map (camelCase, for JSX inline styles) ─────────────────────────
// Maps stateKey → stateValueKey → React.CSSProperties
// Used by the frontend RichText text-node converter.

export const textStateCSSMap: Record<string, Record<string, React.CSSProperties>> = {
  color: Object.fromEntries(
    Object.entries(themeTextColors).map(([k, { css }]) => [
      k,
      toReact(css as Record<string, string>),
    ]),
  ),
  highlight: Object.fromEntries(
    Object.entries(themeBgColors).map(([k, { css }]) => [
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
  effect: {
    // Animations are triggered by IntersectionObserver in <AnimatedEffect>.
    // data-visible="true" is set on entry; CSS @keyframes keyed off that attribute.
    // display:inline-block is kept for transform-based effects (slide-up, shake).
    'fade-in': { display: 'inline-block' },
    'slide-up': { display: 'inline-block' },
    pulse: { display: 'inline-block' },
    shake: { display: 'inline-block' },
    counter: { display: 'inline-block' },
  },
}

// ── Text animation effects (separate toolbar menu) ─────────────────────────
// Each value maps to a CSS animation name defined in globals.css.
// `display: inline-block` is needed for transform-based animations on text.

export const effectStateForPayload = {
  effect: {
    'fade-in': {
      label: 'Fade In',
      css: { animation: 'lx-fade-in 0.8s ease-in both' },
    },
    'slide-up': {
      label: 'Slide Up',
      css: { animation: 'lx-slide-up 0.6s ease-out both', display: 'inline-block' },
    },
    pulse: {
      label: 'Pulse Glow',
      css: { animation: 'lx-pulse 2s ease-in-out infinite' },
    },
    shake: {
      label: 'Shake',
      css: { animation: 'lx-shake 0.5s ease-in-out', display: 'inline-block' },
    },
    counter: {
      label: 'Counter',
      css: { display: 'inline-block' },
    },
  },
} as const

// ── Icon toolbar values ───────────────────────────────────────────────────────
// Used by the icon feature client to build toolbar colour/bg/size pickers.
// Each entry provides the CSS value to store directly on the icon node.

export const iconColorOptions = Object.entries(themeTextColors).map(([key, { label, css }]) => ({
  key,
  label,
  cssValue: (css as Record<string, string>).color,
  css: css as Record<string, string>,
}))

export const iconBgColorOptions = Object.entries(themeBgColors).map(([key, { label, css }]) => ({
  key,
  label,
  cssValue: (css as Record<string, string>)['background-color'],
  css: css as Record<string, string>,
}))

export const iconFontSizeOptions = Object.entries(textStateForPayload.fontSize).map(
  ([key, { label, css }]) => ({
    key,
    label,
    cssValue: (css as Record<string, string>)['font-size'],
    css: css as Record<string, string>,
  }),
)
