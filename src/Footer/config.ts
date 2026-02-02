import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      label: 'Footer Title',
      // localized: true,
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Footer Categories',
      // localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: false,
          label: 'Category Label',
          // localized: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          // localized: true,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: false,
              label: 'Link Label',
              // localized: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Standard', value: 'none' },
                { label: 'Email', value: 'mail' },
                { label: 'Phone', value: 'phone' },
                { label: 'Address', value: 'address' },
              ],
              defaultValue: 'none',
              required: true,
              label: 'Link Type',
            },
            {
              name: 'url',
              type: 'text',
              label:
                'URL (absolute, mailto, tel, Google Maps for address, or leave blank to link to CMS page below)',
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
      // localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          // localized: true,
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
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (!data?.categories) return data
        data.categories = data.categories.map((cat: any) => {
          if (!cat.links) return cat
          cat.links = cat.links.map((link: any) => {
            if (link.type === 'mail' && link.label) {
              link.url = `mailto:${link.label}`
            } else if (link.type === 'phone' && link.label) {
              link.url = `tel:${link.label}`
            }
            // address: do not auto-generate url, leave as entered
            return link
          })
          return cat
        })
        return data
      },
    ],
    afterChange: [revalidateFooter],
  },
}
