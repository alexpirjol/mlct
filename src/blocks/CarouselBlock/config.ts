import type { Block } from 'payload'

import { hero } from '@/heros/config'

export const Carousel: Block = {
  slug: 'carousel',
  interfaceName: 'Carousel',
  fields: [
    {
      name: 'type',
      type: 'text',
      defaultValue: 'carousel',
      required: true,
      admin: {
        hidden: true,
      },
    },
    ...hero.fields.filter((f) => (f as any).name !== 'type'),
  ],
}
