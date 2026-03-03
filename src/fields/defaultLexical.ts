import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  IndentFeature,
  OrderedListFeature,
  UnorderedListFeature,
  AlignFeature,
  HorizontalRuleFeature,
  TextStateFeature,
  defaultColors,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import { IconFeature } from '@/features/icons'

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({
      enabledCollections: ['pages', 'projects'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true // no validation needed, as no url should exist for internal links
              }
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    IndentFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    AlignFeature(),
    HorizontalRuleFeature(),
    IconFeature(),
    TextStateFeature({
      state: {
        color: {
          ...defaultColors.text,
        },
        highlight: {
          ...defaultColors.background,
        },
        transform: {
          uppercase: { label: 'Uppercase', css: { 'text-transform': 'uppercase' } },
          lowercase: { label: 'Lowercase', css: { 'text-transform': 'lowercase' } },
          capitalize: { label: 'Capitalize', css: { 'text-transform': 'capitalize' } },
        },
        fontSize: {
          xs: { label: 'XS', css: { 'font-size': '0.75em', 'line-height': '1rem' } },
          small: { label: 'Small', css: { 'font-size': '0.875em', 'line-height': '1.25rem' } },
          large: { label: 'Large', css: { 'font-size': '1.25em', 'line-height': '1.75rem' } },
          xl: { label: 'XL', css: { 'font-size': '1.5em', 'line-height': '2rem' } },
          '2xl': { label: '2XL', css: { 'font-size': '2em', 'line-height': '2.5rem' } },
        },
      },
    }),
  ],
})
