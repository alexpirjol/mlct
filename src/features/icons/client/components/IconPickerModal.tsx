'use client'

import '@fortawesome/fontawesome-free/css/all.min.css'
import { Pagination, TextInput } from '@payloadcms/ui'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import categoryData from '../../iconCategories.json'
import iconData from '../../iconList.json'

export type IconSelection = {
  iconClass: string
  size: string
}

type IconEntry = {
  n: string // icon name e.g. 'star'
  l: string // label e.g. 'Star'
  t: string[] // search terms
  s: string[] // styles: 'solid'|'regular'|'brands'
  c: string[] // category keys
}

type Category = {
  k: string // key
  l: string // label
}

const ICONS = iconData as IconEntry[]
const CATEGORIES = categoryData as Category[]

const PAGE_SIZE = 100

const STYLE_PREFIXES: Record<string, string> = {
  solid: 'fa-solid',
  regular: 'fa-regular',
  brands: 'fa-brands',
}

type GridItem = {
  icon: IconEntry
  style: string
  key: string
  iconClass: string
}

type Props = {
  initialIconClass?: string
  initialSize?: string
  isEditing?: boolean
  openKey?: number
  onConfirm: (sel: IconSelection) => void
  onClose: () => void
}

export function IconPickerContent({ initialIconClass, openKey, onConfirm, onClose }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [highlightKey, setHighlightKey] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Reset all state and re-parse initialIconClass every time the drawer is opened
  useEffect(() => {
    setSearch('')
    setActiveCategory(null)
    setPage(1)
    if (initialIconClass) {
      const parts = initialIconClass.split(' ')
      const styleEntry = Object.entries(STYLE_PREFIXES).find(([, p]) => parts.includes(p))
      const namePart = parts.find((p) => p.startsWith('fa-') && p !== styleEntry?.[1])
      const iconName = namePart?.replace('fa-', '') ?? null
      const styleName = styleEntry?.[0] ?? 'solid'
      setHighlightKey(iconName ? `${iconName}_${styleName}` : null)
    } else {
      setHighlightKey(null)
    }
    setTimeout(() => searchRef.current?.focus(), 80)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return ICONS.filter((icon) => {
      if (activeCategory && !icon.c.includes(activeCategory)) return false
      if (!q) return true
      return (
        icon.n.includes(q) ||
        icon.l.toLowerCase().includes(q) ||
        icon.t.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [search, activeCategory])

  // Expand: one tile per (icon, style) combination
  const expandedItems = useMemo<GridItem[]>(
    () =>
      filtered.flatMap((icon) =>
        icon.s.map((s) => ({
          icon,
          style: s,
          key: `${icon.n}_${s}`,
          iconClass: `${STYLE_PREFIXES[s]} fa-${icon.n}`,
        })),
      ),
    [filtered],
  )

  const totalPages = Math.max(1, Math.ceil(expandedItems.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = expandedItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1)
  }, [search, activeCategory])

  const handlePick = useCallback(
    (item: GridItem) => {
      setHighlightKey(item.key)
      onConfirm({ iconClass: item.iconClass, size: '' })
      onClose()
    },
    [onConfirm, onClose],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search bar */}
      <div
        style={{
          paddingBottom: '16px',
          borderBottom: '1px solid var(--theme-border-color)',
          flexShrink: 0,
        }}
      >
        <TextInput
          inputRef={searchRef as React.RefObject<HTMLInputElement>}
          path="icon-search"
          placeholder="Search icons…"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      {/* Body: sidebar + grid */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Category sidebar */}
        <div
          style={{
            width: 168,
            flexShrink: 0,
            overflowY: 'auto',
            borderRight: '1px solid var(--theme-border-color)',
            padding: 'calc(var(--base) * 0.5) 0',
          }}
        >
          {[{ k: null as string | null, l: 'All Icons' }, ...CATEGORIES].map((cat) => {
            const isActive = activeCategory === cat.k
            return (
              <button
                key={cat.k ?? '__all__'}
                type="button"
                onClick={() => setActiveCategory(cat.k)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  background: isActive ? 'var(--theme-elevation-150)' : 'transparent',
                  color: isActive ? 'var(--theme-elevation-900)' : 'var(--theme-elevation-700)',
                  fontWeight: isActive ? 600 : 400,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {cat.l}
              </button>
            )
          })}
        </div>

        {/* Icon grid panel */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          {/* Result count */}
          <div
            style={{
              padding: 'calc(var(--base) * 0.4) var(--gutter-h)',
              borderBottom: '1px solid var(--theme-border-color)',
              fontSize: '0.8rem',
              color: 'var(--theme-elevation-500)',
              flexShrink: 0,
            }}
          >
            {expandedItems.length === 0
              ? 'No icons found'
              : `${expandedItems.length} variant${expandedItems.length !== 1 ? 's' : ''}`}
          </div>

          {/* Icons */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 'calc(var(--base) * 0.5)' }}>
            {pageItems.length === 0 ? (
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--theme-elevation-500)',
                  fontSize: '0.85rem',
                  paddingTop: 'calc(var(--base) * 3)',
                }}
              >
                No icons found
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: 6,
                }}
              >
                {pageItems.map((item) => {
                  const isHighlighted = highlightKey === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      title={`${item.icon.l} (${item.style})`}
                      onClick={() => handlePick(item)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: 'calc(var(--base) * 0.6)',
                        minHeight: 80,
                        border: isHighlighted
                          ? '1px solid var(--theme-elevation-500)'
                          : '1px solid transparent',
                        borderRadius: 'var(--style-radius-s)',
                        background: isHighlighted ? 'var(--theme-elevation-150)' : 'transparent',
                        color: 'var(--theme-elevation-800)',
                        cursor: 'pointer',
                      }}
                    >
                      <i
                        className={item.iconClass}
                        style={{ fontSize: '1.75rem', lineHeight: 1 }}
                        aria-hidden="true"
                      />
                      <span
                        style={{
                          fontSize: '0.6rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%',
                          textAlign: 'center',
                          color: 'var(--theme-elevation-600)',
                        }}
                      >
                        {item.icon.n}
                      </span>
                      {item.icon.s.length > 1 && (
                        <span
                          style={{
                            fontSize: '0.55rem',
                            color: 'var(--theme-elevation-400)',
                            lineHeight: 1,
                          }}
                        >
                          {item.style}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: pagination */}
      <div
        style={{
          padding: 'calc(var(--base) * 0.6) var(--gutter-h)',
          borderTop: '1px solid var(--theme-border-color)',
          flexShrink: 0,
        }}
      >
        <Pagination
          page={safePage}
          totalPages={totalPages}
          hasNextPage={safePage < totalPages}
          hasPrevPage={safePage > 1}
          nextPage={safePage < totalPages ? safePage + 1 : undefined}
          prevPage={safePage > 1 ? safePage - 1 : undefined}
          onChange={setPage}
          numberOfNeighbors={1}
        />
      </div>
    </div>
  )
}

export { IconPickerContent as IconPickerModal }
