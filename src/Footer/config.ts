import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateFooter],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      label: 'Footer Title',
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Footer Categories',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: false,
          label: 'Category Label',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: false,
              label: 'Link Label',
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: false,
              admin: {
                // url is editable for 'none' and 'address'
                condition: (data, siblingData) =>
                  !siblingData?.type ||
                  siblingData.type === 'none' ||
                  siblingData.type === 'address',
              },
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: ['pages'],
              label: 'CMS Page (optional)',
              required: false,
              admin: {
                condition: (data, siblingData) => !siblingData?.type || siblingData.type === 'none',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon class (e.g. fa-facebook)',
        },
      ],
    },
  ],
}
