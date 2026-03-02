import type { Field } from 'payload'

export const noVerticalSpacingField = (): Field => ({
  name: 'noVerticalSpacing',
  type: 'checkbox',
  label: 'No vertical spacing',
  defaultValue: false,
  admin: {
    position: 'sidebar',
  },
})
