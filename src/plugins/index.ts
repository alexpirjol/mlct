import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Page, Project } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Project | Page> = ({ doc }) => {
  if (!doc) return ''

  // Handle localized title (object) or regular string title
  if (doc.title) {
    if (typeof doc.title === 'string') {
      return doc.title
    }
    // If title is a localized object, try to get a value
    if (typeof doc.title === 'object') {
      const titleObj = doc.title as Record<string, string>
      return titleObj.en || Object.values(titleObj)[0] || ''
    }
  }

  return ''
}

const generateURL: GenerateURL<Project | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  vercelBlobStorage({
    enabled: !!process.env.VERCEL, // Optional, defaults to true
    // Specify which collections should use Vercel Blob
    collections: {
      media: true,
    },
    // Token provided by Vercel once Blob storage is added to your Vercel project
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),

  redirectsPlugin({
    collections: ['pages', 'projects'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      file: {
        slug: 'file',
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'name',
                type: 'text',
                label: 'Name (lowercase, no special characters)',
                required: true,
                admin: {
                  width: '50%',
                },
              },
              {
                name: 'label',
                type: 'text',
                label: 'Label',
                localized: true,
                admin: {
                  width: '50%',
                },
              },
            ],
          },
          {
            type: 'row',
            fields: [
              {
                name: 'width',
                type: 'number',
                label: 'Field Width (percentage)',
                admin: { width: '50%' },
              },
              {
                name: 'required',
                type: 'checkbox',
                label: 'Required',
                admin: { width: '50%' },
              },
            ],
          },
          {
            name: 'defaultValue',
            type: 'upload',
            relationTo: 'media',
            label: 'Default File',
          },
        ],
        labels: {
          plural: 'File Fields',
          singular: 'File',
        },
      } as any,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['projects'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
