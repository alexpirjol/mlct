import type { Block } from 'payload'

export const MapBlock: Block = {
  slug: 'mapBlock',
  interfaceName: 'MapBlock',
  fields: [
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      admin: {
        description:
          'Leave empty to use the location from Settings, or enter a custom address/coordinates',
      },
    },
    {
      name: 'height',
      type: 'select',
      label: 'Height',
      defaultValue: '100',
      options: [
        { label: '33%', value: '33' },
        { label: '50%', value: '50' },
        { label: '66%', value: '66' },
        { label: '75%', value: '75' },
        { label: '100%', value: '100' },
        { label: '125%', value: '125' },
        { label: '150%', value: '150' },
        { label: '200%', value: '200' },
      ],
    },
    {
      name: 'width',
      type: 'select',
      label: 'Width',
      defaultValue: '100',
      options: [
        { label: '25%', value: '25' },
        { label: '33%', value: '33' },
        { label: '50%', value: '50' },
        { label: '66%', value: '66' },
        { label: '75%', value: '75' },
        { label: '100%', value: '100' },
      ],
    },
  ],
}
