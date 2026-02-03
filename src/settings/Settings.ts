import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'language',
      type: 'select',
      label: 'Site Language',
      required: true,
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
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      required: false,
    },
    {
      name: 'organization',
      type: 'text',
      label: 'Organization Name',
      required: false,
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
        {
          name: 'mapsUrl',
          type: 'text',
          label: 'Google Maps Link',
        },
      ],
    },
    {
      name: 'siteLinks',
      type: 'array',
      label: 'Site Links (Sitelinks)',
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
    {
      name: 'mapEmbed',
      type: 'textarea',
      label: 'Google Maps Embed Iframe',
      admin: {
        description: 'Paste the iframe code from Google Maps for a visual map on the site',
      },
      required: false,
    },
  ],
}

export default Settings
