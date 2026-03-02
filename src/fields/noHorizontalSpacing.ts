import type { Field } from 'payload'

export const noHorizontalSpacingField = (): Field => ({
  name: 'noHorizontalSpacing',
  type: 'checkbox',
  label: 'No horizontal spacing',
  defaultValue: false,
  admin: {
    position: 'sidebar',
  },
})
