import type { GroupField } from 'payload'
import { normalizeRichText } from '@/hooks/normalizeRichText'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const hero: GroupField = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'none',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
      ],
      required: false,
    },
    {
      name: 'direction',
      type: 'select',
      label: 'Direction',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
    },
    {
      name: 'centered',
      type: 'checkbox',
      defaultValue: false,
      label: 'Multiple visible slides',
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
    },
    {
      name: 'effect',
      type: 'select',
      label: 'Effect',
      defaultValue: 'none',
      required: true,
      options: [
        { label: 'None', value: 'none' },
        { label: 'Slide', value: 'slide' },
        { label: 'Fade', value: 'fade' },
        { label: 'Cube', value: 'cube' },
        { label: 'Coverflow', value: 'coverflow' },
        { label: 'Flip', value: 'flip' },
        { label: 'Creative', value: 'creative' },
        { label: 'Cards', value: 'cards' },
      ],
      admin: {
        condition: (_, { type, centered } = {}) => type === 'carousel' && !centered,
      },
    },
    {
      name: 'animation',
      type: 'checkbox',
      defaultValue: false,
      label: 'Animation',
      admin: {
        condition: (_, { type, effect } = {}) => type === 'carousel' && effect === 'fade',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      label: 'Autoplay',
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
    },
    {
      name: 'autoplayInterval',
      type: 'number',
      defaultValue: 2000,
      label: 'Autoplay Interval (ms)',
      admin: {
        condition: (_, siblingData = {}) =>
          siblingData.type === 'carousel' && siblingData.autoplay === true,
      },
    },

    {
      name: 'slidesPerView',
      type: 'select',
      label: 'Slides per view',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (use slide width %)', value: 'auto' },
        { label: '1.5', value: '1.5' },
        { label: '2', value: '2' },
        { label: '2.5', value: '2.5' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      admin: {
        condition: (_, { type, centered } = {}) => type === 'carousel' && centered,
      },
    },

    {
      name: 'slideWidth',
      type: 'select',
      label: 'Slide width (% of viewport, for Auto mode)',
      defaultValue: '80',
      options: [
        { label: '50%', value: '50' },
        { label: '60%', value: '60' },
        { label: '70%', value: '70' },
        { label: '80%', value: '80' },
        { label: '90%', value: '90' },
      ],
      admin: {
        condition: (_, { type, centered, slidesPerView } = {}) =>
          type === 'carousel' && centered && (slidesPerView === 'auto' || !slidesPerView),
      },
    },
    {
      name: 'carouselHeight',
      type: 'select',
      label: 'Height',
      defaultValue: '80vh',
      options: [
        { label: '5vh', value: '5vh' },
        { label: '10vh', value: '10vh' },
        { label: '15vh', value: '15vh' },
        { label: '20vh', value: '20vh' },
        { label: '25vh', value: '25vh' },
        { label: '30vh', value: '30vh' },
        { label: '35vh', value: '35vh' },
        { label: '40vh', value: '40vh' },
        { label: '45vh', value: '45vh' },
        { label: '50vh', value: '50vh' },
        { label: '55vh', value: '55vh' },
        { label: '60vh', value: '60vh' },
        { label: '65vh', value: '65vh' },
        { label: '70vh', value: '70vh' },
        { label: '75vh', value: '75vh' },
        { label: '80vh', value: '80vh' },
        { label: '85vh', value: '85vh' },
        { label: '90vh', value: '90vh' },
        { label: '95vh', value: '95vh' },
        { label: '100vh', value: '100vh' },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
        },
      }),
      label: false,
      hooks: { beforeChange: [normalizeRichText] },
      admin: {
        condition: (_, { type } = {}) => type !== 'carousel',
      },
    },
    {
      name: 'slides',
      label: 'Slides',
      type: 'array',
      admin: { initCollapsed: false, condition: (_, { type } = {}) => type === 'carousel' },
      fields: [
        {
          name: 'richText',
          type: 'richText',
          label: false,
          required: false,
          hooks: { beforeChange: [normalizeRichText] },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [...rootFeatures],
          }),
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          hasMany: false,
          required: false,
        },
      ],
    },

    {
      name: 'media',
      type: 'upload',
      hasMany: false,
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
    },
  ],
  label: false,
}
