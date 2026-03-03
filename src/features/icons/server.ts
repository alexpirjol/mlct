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
              const n = node as {
                iconClass?: string
                size?: string
                color?: string
                bgColor?: string
                fontSize?: string
              }
              const cls = [n.iconClass, n.size].filter(Boolean).join(' ')
              const styles: string[] = []
              if (n.color) styles.push(`color: ${n.color}`)
              if (n.bgColor) styles.push(`background-color: ${n.bgColor}`)
              if (n.fontSize) styles.push(`font-size: ${n.fontSize}`)
              const styleAttr = styles.length ? ` style="${styles.join('; ')}"` : ''
              return `<i class="${cls}"${styleAttr} aria-hidden="true"></i>`
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
