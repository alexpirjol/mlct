'use client'
import React, { useEffect, useState, Fragment, useCallback, useMemo } from 'react'
import { useField, usePreferences, FieldLabel, Button } from '@payloadcms/ui'
import { cn } from '@/utilities/ui'
import { DEFAULT_COLORS } from './index'
import type { ColorOption } from './index'
import './styles.css'

const PREFERENCE_KEY = 'color-picker-colors'

interface ClientField {
  label?: string | false | Record<string, string>
  required?: boolean
  [key: string]: unknown
}

interface ColorPickerFieldProps {
  path: string
  field?: ClientField
  clientField?: ClientField
  defaultColors?: ColorOption[]
}

const Field: React.FC<ColorPickerFieldProps> = ({
  path,
  field,
  clientField,
  defaultColors = DEFAULT_COLORS,
}) => {
  const fieldConfig = field ?? clientField
  const label = fieldConfig?.label
  const required = fieldConfig?.required
  const { value, setValue } = useField<string>({ path })
  const { getPreference, setPreference } = usePreferences()
  // extras = user-added colors on top of defaults
  const [extras, setExtras] = useState<ColorOption[]>([])
  const colorOptions = useMemo(() => [...defaultColors, ...extras], [defaultColors, extras])
  const [isAdding, setIsAdding] = useState(false)
  const [colorToAdd, setColorToAdd] = useState('')

  useEffect(() => {
    const load = async () => {
      const prefs = await getPreference<unknown[]>(PREFERENCE_KEY)
      if (prefs && prefs.length) {
        const migrated: ColorOption[] = prefs.map((p) =>
          typeof p === 'string' ? { value: p } : (p as ColorOption),
        )
        // Only keep entries that are not already in defaultColors
        const newExtras = migrated.filter((p) => !defaultColors.some((d) => d.value === p.value))
        setExtras(newExtras)
      }
    }
    load()
  }, [getPreference, defaultColors])

  const handleAdd = useCallback(() => {
    if (!colorToAdd) return
    if (colorOptions.some((c) => c.value === colorToAdd)) return
    const next: ColorOption[] = [{ value: colorToAdd }, ...extras]
    setExtras(next)
    setPreference(PREFERENCE_KEY, next)
    setValue(colorToAdd)
    setColorToAdd('')
    setIsAdding(false)
  }, [colorToAdd, colorOptions, extras, setPreference, setValue])

  const handleDelete = useCallback(
    (color: string) => {
      const next = extras.filter((c) => c.value !== color)
      setExtras(next)
      setPreference(PREFERENCE_KEY, next)
      if (value === color) setValue(null)
    },
    [extras, value, setPreference, setValue],
  )

  return (
    <div className="custom-color-picker">
      <FieldLabel htmlFor={path} label={label || undefined} required={required} />
      {isAdding ? (
        <div className="ccp-add">
          <input
            className="ccp-input"
            type="text"
            placeholder="#ffffff or tailwind class"
            value={colorToAdd}
            onChange={(e) => setColorToAdd(e.target.value)}
          />
          <Button buttonStyle="primary" size="small" onClick={handleAdd}>
            Add
          </Button>
          <Button buttonStyle="secondary" size="small" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Fragment>
          <ul className="ccp-list">
            {colorOptions.map((opt, i) => {
              const bg = opt.preview ?? opt.value
              return (
                <li key={i} className="ccp-item">
                  <div className="ccp-chip-wrap">
                    <button
                      type="button"
                      className={cn('ccp-chip', {
                        'ccp-chip--selected': opt.value === value,
                        'ccp-chip--transparent': opt.value === 'transparent',
                        'ccp-chip--none': opt.value === 'none',
                      })}
                      style={opt.value !== 'transparent' && opt.value !== 'none' ? { backgroundColor: bg } : undefined}
                      aria-label={opt.value}
                      title={opt.value}
                      onClick={() => setValue(opt.value)}
                    />
                    {extras.some((d) => d.value === opt.value) && (
                      <button
                        type="button"
                        className="ccp-delete"
                        aria-label={`Remove ${opt.value}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(opt.value)
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
          <div style={{ marginTop: 8 }}>
            <Button size="small" onClick={() => setIsAdding(true)}>
              Add color
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default Field
