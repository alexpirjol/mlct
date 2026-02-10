import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { revalidateSettings } from './hooks/revalidateSettings'

export const Settings: GlobalConfig = {
  slug: 'setting',
  label: 'Settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateSettings],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'generalSttings',
          label: 'General Settings',
          fields: [
            {
              name: 'language',
              type: 'select',
              label: 'Site Language',
              required: false,
              defaultValue: 'ro',
              options: [
                { label: 'Română', value: 'ro' },
                { label: 'English', value: 'en' },
                { label: 'Deutsch', value: 'de' },
                { label: 'Français', value: 'fr' },
                { label: 'Italiano', value: 'it' },
                { label: 'Español', value: 'es' },
                { label: 'Magyar', value: 'hu' },
              ],
            },
            {
              name: 'siteTitle',
              type: 'text',
              label: 'Site Title',
              required: false,
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Site Description',
              required: false,
            },
            {
              name: 'siteUrl',
              type: 'text',
              label: 'Site URL',
              required: false,
            },
          ],
        },
        {
          name: 'organization',
          label: 'Organization Details',
          fields: [
            {
              name: 'organizationName',
              type: 'text',
              label: 'Organization Name',
              required: false,
            },
            {
              name: 'workHours',
              type: 'array',
              label: 'Work Hours',
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  options: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ],
                  required: true,
                  hasMany: true,
                },
                {
                  name: 'start',
                  type: 'date',
                  label: 'Start Time',
                  required: true,
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                    },
                  },
                },
                {
                  name: 'end',
                  type: 'date',
                  label: 'End Time',
                  required: true,
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'contact',
          label: 'Contact Info',
          fields: [
            {
              name: 'phone',
              type: 'text',
              label: 'Phone',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email',
            },
            {
              name: 'address',
              type: 'text',
              label: 'Address',
            },
            {
              name: 'location',
              type: 'text',
              label: 'Location',
            },
          ],
        },
        {
          label: 'Social Platforms',
          fields: [
            {
              name: 'social',
              type: 'array',
              label: 'Social Links',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  label: 'Platform',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Twitter', value: 'twitter' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Pinterest', value: 'pinterest' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'page',
                  type: 'text',
                  label: 'Page/Handle/URL',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  admin: { readOnly: true, hidden: true },
                  hooks: {
                    afterRead: [
                      ({ siblingData }) => {
                        if (!siblingData) return 'fas fa-share-alt'

                        const iconMap: Record<string, string> = {
                          facebook: 'fab fa-facebook',
                          instagram: 'fab fa-instagram',
                          twitter: 'fab fa-twitter',
                          linkedin: 'fab fa-linkedin',
                          youtube: 'fab fa-youtube',
                          tiktok: 'fab fa-tiktok',
                          pinterest: 'fab fa-pinterest',
                          whatsapp: 'fab fa-whatsapp',
                          other: 'fas fa-share-alt',
                        }
                        const type =
                          typeof siblingData?.type === 'string' ? siblingData.type : 'other'
                        return iconMap[type] || iconMap.other
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'siteLinks',
              type: 'array',
              label: 'Site Links (Google search results)',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Settings
