import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Settings: GlobalConfig = {
  slug: 'setting',
  label: 'Settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'generalSttings',
      type: 'group',
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
        {
          name: 'logo',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Upload a logo for the header (SVG or PNG recommended)',
          },
        },
      ],
    },

    {
      name: 'organizationDetails',
      type: 'group',
      label: 'Organization Details',
      fields: [
        {
          name: 'organization',
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
      type: 'group',
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
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social Info',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook page',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram page',
        },
      ],
    },
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
}

export default Settings
