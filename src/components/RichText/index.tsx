import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { GalleryBlock } from '@/blocks/GalleryBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import type { SerializedIconNode } from '@/features/icons/server/nodes/IconNode'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import type React from 'react'
import { textStateCSSMap } from '@/features/textStateConfig'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  MediaBlock as MediaBlockProps,
  GalleryBlock as GalleryBlockProps,
  MediaCardBlock as MediaCardBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { MediaCardBlock } from '@/blocks/MediaCard/Component'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedIconNode
  | SerializedBlockNode<
      MediaBlockProps | BannerBlockProps | CodeBlockProps | GalleryBlockProps | MediaCardBlockProps
    >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'projects' ? `/projects/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  // Apply TextStateFeature inline styles on text nodes
  // TextState serializes under the '$' key in Lexical's NodeState JSON:
  // { type: 'text', version: 1, '$': { color: 'text-red', ... } }
  text: (args) => {
    const { node } = args
    const n = node as unknown as Record<string, unknown>
    const nodeState = (n['$'] as Record<string, string> | undefined) ?? {}
    const stateStyle: React.CSSProperties = {}
    for (const [stateKey, stateValues] of Object.entries(textStateCSSMap)) {
      const activeVal = nodeState[stateKey]
      if (activeVal && stateValues[activeVal]) {
        Object.assign(stateStyle, stateValues[activeVal])
      }
    }
    const textConverter = defaultConverters.text
    const base = typeof textConverter === 'function' ? textConverter(args) : null
    if (Object.keys(stateStyle).length === 0) return base
    return <span style={stateStyle}>{base}</span>
  },
  icon: ({ node }) => {
    const n = node as unknown as SerializedIconNode
    const cls = [n.iconClass, n.size].filter(Boolean).join(' ')
    const style: React.CSSProperties = { display: 'inline-block' }
    if (n.color) style.color = n.color
    if (n.bgColor) style.backgroundColor = n.bgColor
    if (n.fontSize) style.fontSize = n.fontSize
    return <i className={cls} aria-hidden="true" style={style} />
  },
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    galleryBlock: ({ node }) => (
      <GalleryBlock
        className="col-start-1 "
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    mediaCard: ({ node }) => (
      <MediaCardBlock
        className="col-start-1 col-span-3"
        {...node.fields}
        disableInnerContainer={true}
      />
    ),

    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, data, ...rest } = props

  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      data={data}
      {...rest}
    />
  )
}
