import { createNode, createServerFeature } from '@payloadcms/richtext-lexical'

import { IconServerNode } from './server/nodes/IconNode'

export const IconFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/icons/client#IconFeatureClient',
    nodes: [
      createNode({
        converters: {
          html: {
            converter: ({ node }) => {
              const n = node as { iconClass?: string; size?: string }
              const cls = [n.iconClass, n.size].filter(Boolean).join(' ')
              return `<i class="${cls}" aria-hidden="true"></i>`
            },
            nodeTypes: [IconServerNode.getType()],
          },
        },
        node: IconServerNode,
      }),
    ],
  },
  key: 'icon',
})
