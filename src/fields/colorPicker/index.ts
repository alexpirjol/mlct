import type { TextField } from 'payload'

export type ColorOption = {
  /** Value stored in the database and applied on the frontend */
  value: string
  /** Override the swatch color shown in admin (only needed when value is a CSS var or non-hex). Falls back to `value`. */
  preview?: string
}

/** Project default swatches */
export const DEFAULT_COLORS: ColorOption[] = [
  { value: '#1b1b1b' },
  { value: '#292c30' },
  { value: '#ffffff' },
  { value: 'transparent' },
]

export const validateHexColor = (value?: string | null): true | string => {
  if (!value) return true
  const v = String(value).trim()
  if (v === 'transparent') return true
  if (v.startsWith('var(')) return true
  if (v.startsWith('--')) return true
  if (/^#(?:[0-9a-fA-F]{3,6}$)/.test(v)) return true
  if (/^rgba?\(/.test(v)) return true
  return `${v} is not a valid color`
}

type Options = {
  name?: string
  label?: string
  defaultColors?: ColorOption[]
  overrides?: Partial<TextField>
}

export const colorPickerField = (options: Options = {}): TextField => {
  const name = options.name || 'background'
  const label = options.label || 'Background color'
  const defaultColors = options.defaultColors || DEFAULT_COLORS

  return {
    name,
    label,
    type: 'text',
    validate: validateHexColor,
    required: false,
    admin: {
      position: 'sidebar',
      components: {
        Field: {
          path: '@/fields/colorPicker/Field',
          clientProps: { defaultColors },
        },
        Cell: '@/fields/colorPicker/Cell',
      },
    },
    ...(options.overrides ?? {}),
  } as TextField
}

export default colorPickerField
