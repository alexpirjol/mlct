'use client'

import {
  createClientFeature,
  toolbarFeatureButtonsGroupWithItems,
} from '@payloadcms/richtext-lexical/client'

import { INSERT_ICON_COMMAND } from '../server/nodes/IconNode'
import { IconFeatureIcon } from './components/IconFeatureIcon'
import { IconNode } from './nodes/IconNode'
import { IconPlugin } from './plugin/index'

export const IconFeatureClient = createClientFeature({
  nodes: [IconNode],
  plugins: [
    {
      Component: IconPlugin,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: [
      toolbarFeatureButtonsGroupWithItems([
        {
          ChildComponent: IconFeatureIcon,
          key: 'insertIcon',
          label: 'Insert Icon',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_ICON_COMMAND, {
              iconClass: 'fa-solid fa-star',
            })
          },
        },
      ]),
    ],
  },
  toolbarInline: {
    groups: [
      toolbarFeatureButtonsGroupWithItems([
        {
          ChildComponent: IconFeatureIcon,
          key: 'insertIcon',
          label: 'Insert Icon',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_ICON_COMMAND, {
              iconClass: 'fa-solid fa-star',
            })
          },
        },
      ]),
    ],
  },
})
