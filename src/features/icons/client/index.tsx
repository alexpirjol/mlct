'use client'

import {
  createClientFeature,
  toolbarAddDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { $getSelection, $isNodeSelection, type BaseSelection, type LexicalEditor } from 'lexical'
import React from 'react'

import {
  iconBgColorOptions,
  iconColorOptions,
  iconFontSizeOptions,
} from '@/features/textStateConfig'
import { INSERT_ICON_COMMAND } from '../server/nodes/IconNode'
import { IconFeatureIcon } from './components/IconFeatureIcon'
import { $isIconNode, IconNode } from './nodes/IconNode'
import { IconPlugin } from './plugin/index'

// ─── Selection Helpers ────────────────────────────────────────────────────────

function getSelectedIcon(selection: BaseSelection): IconNode | null {
  if (!$isNodeSelection(selection)) return null
  for (const n of selection.getNodes()) {
    if ($isIconNode(n)) return n as IconNode
  }
  return null
}

function applyIconField(
  editor: LexicalEditor,
  field: '__color' | '__bgColor' | '__fontSize',
  cssValue: string,
  isActive: boolean,
) {
  editor.update(() => {
    const sel = $getSelection()
    if (!$isNodeSelection(sel)) return
    for (const node of sel.getNodes()) {
      if ($isIconNode(node)) {
        ;(node as IconNode).getWritable()[field] = isActive ? '' : cssValue
      }
    }
  })
}

// ─── UI Components ────────────────────────────────────────────────────────────
// Mirrors Payload's internal TextStateIcon: an "A" badge with the option's CSS applied.
// This matches exactly what the TextStateFeature dropdown shows for text options.

function hyphenToCamel(s: string): string {
  return s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

const StateIcon = ({ css }: { css?: Record<string, string> }) => {
  const camelCss = css
    ? Object.fromEntries(Object.entries(css).map(([k, v]) => [hyphenToCamel(k), v]))
    : {}
  return (
    <span
      style={{
        ...camelCss,
        alignItems: 'center',
        borderRadius: '4px',
        display: 'flex',
        fontSize: '16px',
        height: '20px',
        justifyContent: 'center',
        width: '20px',
      }}
    >
      A
    </span>
  )
}

// ─── Icon style dropdown ──────────────────────────────────────────────────────
// Separate group (key: 'iconStyle') shown only when an icon is selected.
// The group-level isEnabled hides/disables the button entirely for text selections.
// TextStateFeature's own dropdown handles text independently.

const iconStyleGroup = {
  type: 'dropdown' as const,
  key: 'iconStyle',
  order: 31,
  ChildComponent: () => (
    <StateIcon css={{ color: 'var(--theme-elevation-600)' }} />
  ),
  isEnabled: ({ selection }: { selection: BaseSelection }) => getSelectedIcon(selection) !== null,
  items: [
    // ── Clear all icon formatting ──────────────────────────────────────────
    {
      ChildComponent: () => <StateIcon />,
      key: 'icon-clear-style',
      label: 'Default style',
      order: 1,
      isActive: ({ selection }: { selection: BaseSelection }) => {
        const icon = getSelectedIcon(selection)
        return icon !== null && !icon.__color && !icon.__bgColor && !icon.__fontSize
      },
      onSelect: ({ editor }: { editor: LexicalEditor }) => {
        editor.update(() => {
          const sel = $getSelection()
          if (!$isNodeSelection(sel)) return
          for (const node of sel.getNodes()) {
            if ($isIconNode(node)) {
              const w = (node as IconNode).getWritable()
              w.__color = ''
              w.__bgColor = ''
              w.__fontSize = ''
            }
          }
        })
      },
    },
    // ── Color (→ __color) ─────────────────────────────────────────────────
    ...iconColorOptions.map(({ key, label, cssValue, css }) => ({
      ChildComponent: () => <StateIcon css={css} />,
      key: `icon-color-${key}`,
      label,
      isActive: ({ selection }: { selection: BaseSelection }) => {
        const icon = getSelectedIcon(selection)
        return icon !== null && icon.__color === cssValue
      },
      onSelect: ({ editor, isActive }: { editor: LexicalEditor; isActive: boolean }) =>
        applyIconField(editor, '__color', cssValue, isActive),
    })),
    // ── Background (→ __bgColor) ──────────────────────────────────────────
    ...iconBgColorOptions.map(({ key, label, cssValue, css }) => ({
      ChildComponent: () => <StateIcon css={css} />,
      key: `icon-bg-${key}`,
      label,
      isActive: ({ selection }: { selection: BaseSelection }) => {
        const icon = getSelectedIcon(selection)
        return icon !== null && icon.__bgColor === cssValue
      },
      onSelect: ({ editor, isActive }: { editor: LexicalEditor; isActive: boolean }) =>
        applyIconField(editor, '__bgColor', cssValue, isActive),
    })),
    // ── Font size (→ __fontSize) ──────────────────────────────────────────
    ...iconFontSizeOptions.map(({ key, label, cssValue, css }) => ({
      ChildComponent: () => <StateIcon css={css} />,
      key: `icon-size-${key}`,
      label,
      isActive: ({ selection }: { selection: BaseSelection }) => {
        const icon = getSelectedIcon(selection)
        return icon !== null && icon.__fontSize === cssValue
      },
      onSelect: ({ editor, isActive }: { editor: LexicalEditor; isActive: boolean }) =>
        applyIconField(editor, '__fontSize', cssValue, isActive),
    })),
  ],
}

// ─── Insert group ─────────────────────────────────────────────────────────────

const insertGroup = toolbarAddDropdownGroupWithItems([
  {
    ChildComponent: IconFeatureIcon,
    key: 'insertIcon',
    label: 'Insert Icon',
    onSelect: ({ editor }) => {
      editor.dispatchCommand(INSERT_ICON_COMMAND, { iconClass: 'fa-solid fa-star' })
    },
  },
])

// ─── Feature ──────────────────────────────────────────────────────────────────

export const IconFeatureClient = createClientFeature({
  nodes: [IconNode],
  plugins: [{ Component: IconPlugin, position: 'normal' }],
  toolbarFixed: {
    groups: [insertGroup, iconStyleGroup],
  },
  toolbarInline: {
    groups: [insertGroup, iconStyleGroup],
  },
})
