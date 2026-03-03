import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { getBlockBg } from '@/utilities/blockBackground'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { GalleryBlock } from '@/blocks/GalleryBlock/Component'
import { MapBlock } from '@/blocks/MapBlock/Component'
import { MediaCardBlock } from '@/blocks/MediaCard/Component'
import { ContactInfoBlock } from '@/blocks/ContactInfoBlock/Component'
import { CarouselBlock } from '@/blocks/CarouselBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  galleryBlock: GalleryBlock,
  mapBlock: MapBlock,
  mediaCard: MediaCardBlock,
  carousel: CarouselBlock,
  contactInfo: ContactInfoBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]
            const bg = getBlockBg((block as { background?: string | null }).background)
            const noVerticalSpacing = (block as { noVerticalSpacing?: boolean | null })
              .noVerticalSpacing

            if (Block) {
              return (
                <div
                  className={cn({ 'py-8': !noVerticalSpacing }, bg.className)}
                  style={bg.style}
                  key={index}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
