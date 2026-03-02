'use client'

import '@fortawesome/fontawesome-free/css/all.min.css'
import { Button, SelectInput, TextInput } from '@payloadcms/ui'
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

const PAGE_SIZE = 48

const SIZES = [
  { label: 'Default', value: '' },
  { label: 'XS', value: 'fa-xs' },
  { label: 'SM', value: 'fa-sm' },
  { label: 'LG', value: 'fa-lg' },
  { label: 'XL', value: 'fa-xl' },
  { label: '2XL', value: 'fa-2xl' },
]

const STYLE_PREFIXES: Record<string, string> = {
  solid: 'fa-solid',
  regular: 'fa-regular',
  brands: 'fa-brands',
}

type Props = {
  initialIconClass?: string
  initialSize?: string
  isEditing?: boolean
  onConfirm: (sel: IconSelection) => void
  onClose: () => void
}

export function IconPickerContent({
  initialIconClass,
  initialSize,
  isEditing = false,
  onConfirm,
  onClose,
}: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<'solid' | 'regular' | 'brands'>('solid')
  const [selectedSize, setSelectedSize] = useState(initialSize ?? '')
  const [page, setPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)

  // Parse initial iconClass on mount
  useEffect(() => {
    if (initialIconClass) {
      const parts = initialIconClass.split(' ')
      const styleEntry = Object.entries(STYLE_PREFIXES).find(([, p]) => parts.includes(p))
      const namePart = parts.find((p) => p.startsWith('fa-') && p !== styleEntry?.[1])
      const iconName = namePart?.replace('fa-', '') ?? null
      const iconStyle = (styleEntry?.[0] ?? 'solid') as 'solid' | 'regular' | 'brands'
      setSelectedIconName(iconName)
      setSelectedStyle(iconStyle)
    }
    setSelectedSize(initialSize ?? '')
    setTimeout(() => searchRef.current?.focus(), 80)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageIcons = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1)
  }, [search, activeCategory])

  const handleSelect = useCallback(
    (icon: IconEntry) => {
      setSelectedIconName(icon.n)
      const bestStyle = icon.s.includes(selectedStyle)
        ? selectedStyle
        : (icon.s[0] as 'solid' | 'regular' | 'brands')
      setSelectedStyle(bestStyle)
    },
    [selectedStyle],
  )

  const handleConfirm = useCallback(() => {
    if (!selectedIconName) return
    const prefix = STYLE_PREFIXES[selectedStyle]
    const iconClass = `${prefix} fa-${selectedIconName}`
    onConfirm({ iconClass, size: selectedSize })
    onClose()
  }, [selectedIconName, selectedStyle, selectedSize, onConfirm, onClose])

  const selectedIcon = ICONS.find((i) => i.n === selectedIconName)
  const previewClass = selectedIconName
    ? [STYLE_PREFIXES[selectedStyle], `fa-${selectedIconName}`, selectedSize]
        .filter(Boolean)
        .join(' ')
    : null

  return (
    <div
      className="flex flex-col h-full"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && selectedIconName) handleConfirm()
      }}
    >
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-border">
        <TextInput
          inputRef={searchRef as React.RefObject<HTMLInputElement>}
          path="icon-search"
          placeholder="Search icons…"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      {/* Body: sidebar + grid */}
      <div className="flex flex-1 min-h-0">
        {/* Category sidebar */}
        <div className="w-44 flex-shrink-0 overflow-y-auto border-r border-border py-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`w-full text-left px-4 py-1.5 text-sm transition-colors ${
              activeCategory === null
                ? 'bg-accent text-accent-foreground font-semibold'
                : 'hover:bg-secondary text-foreground'
            }`}
          >
            All Icons
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.k}
              type="button"
              onClick={() => setActiveCategory(cat.k)}
              className={`w-full text-left px-4 py-1.5 text-sm transition-colors ${
                activeCategory === cat.k
                  ? 'bg-accent text-accent-foreground font-semibold'
                  : 'hover:bg-secondary text-foreground'
              }`}
            >
              {cat.l}
            </button>
          ))}
        </div>

        {/* Icon grid */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Count + pagination */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border text-xs text-muted-foreground">
            <span>
              {filtered.length === 0
                ? 'No icons found'
                : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  buttonStyle="subtle"
                  size="small"
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ‹
                </Button>
                <span>
                  {safePage} / {totalPages}
                </span>
                <Button
                  buttonStyle="subtle"
                  size="small"
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  ›
                </Button>
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex-1 overflow-y-auto p-3">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-12">No icons found</p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-1">
                {pageIcons.map((icon) => {
                  const isSelected = selectedIconName === icon.n
                  const style = icon.s.includes(selectedStyle) ? selectedStyle : icon.s[0]!
                  const cls = `${STYLE_PREFIXES[style]} fa-${icon.n}`
                  return (
                    <button
                      key={icon.n}
                      type="button"
                      title={icon.l}
                      onClick={() => handleSelect(icon)}
                      onDoubleClick={handleConfirm}
                      className={`flex flex-col items-center justify-center gap-1 p-2 text-xs transition-colors min-h-[56px] rounded ${
                        isSelected
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      <i
                        className={cls}
                        style={{ fontSize: '1.25rem', lineHeight: 1 }}
                        aria-hidden="true"
                      />
                      <span className="truncate w-full text-center" style={{ fontSize: '0.58rem' }}>
                        {icon.n}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: preview + style + size + actions */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-border flex-wrap">
        {/* Preview */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-secondary rounded">
            {previewClass ? (
              <i className={previewClass} style={{ fontSize: '1.5rem' }} aria-hidden="true" />
            ) : (
              <span className="text-muted-foreground text-xs">—</span>
            )}
          </div>
          <div className="text-sm min-w-0">
            {selectedIcon ? (
              <>
                <p className="font-semibold truncate">{selectedIcon.l}</p>
                <p className="text-muted-foreground text-xs truncate">{previewClass}</p>
              </>
            ) : (
              <p className="text-muted-foreground text-xs">Select an icon</p>
            )}
          </div>
        </div>

        {/* Style pills when icon has multiple styles */}
        {selectedIcon && selectedIcon.s.length > 1 && (
          <div className="flex gap-1">
            {selectedIcon.s.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStyle(s as 'solid' | 'regular' | 'brands')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  selectedStyle === s
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Size */}
        <div style={{ minWidth: 130 }}>
          <SelectInput
            name="icon-size"
            path="icon-size"
            label="Size"
            value={selectedSize || undefined}
            options={SIZES}
            onChange={(opt) => setSelectedSize((opt as { value: string } | null)?.value ?? '')}
            isClearable={false}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button buttonStyle="secondary" onClick={onClose} size="medium">
            Cancel
          </Button>
          <Button
            buttonStyle="primary"
            onClick={handleConfirm}
            disabled={!selectedIconName}
            size="medium"
          >
            {isEditing ? 'Update' : 'Insert'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { IconPickerContent as IconPickerModal }
