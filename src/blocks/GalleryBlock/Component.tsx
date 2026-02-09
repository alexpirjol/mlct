'use client'
import type { StaticImageData } from 'next/image'

import React, { useState } from 'react'

import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Video from 'yet-another-react-lightbox/plugins/video'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Share from 'yet-another-react-lightbox/plugins/share'
import { RowsPhotoAlbum } from 'react-photo-album'
import { cn } from '@/utilities/ui'

import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/styles.css'
import 'react-photo-album/rows.css'

import RichText from '@/components/RichText'

import type { GalleryBlock as GalleryBlockProps } from '@/payload-types'

type Props = GalleryBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const GalleryBlock: React.FC<Props> = (props) => {
  const { captionClassName, className, enableGutter = true, media, disableInnerContainer } = props
  const [index, setIndex] = useState(-1)

  const slides = Array.isArray(media)
    ? media
        .map((item) => {
          if (typeof item === 'string' || !item) return null
          const { sizes, width, height, url, caption } = item
          if (!url || !width || !height) return null
          return {
            src: url,
            width,
            height,
            description: caption && (
              <div
                className={cn(
                  {
                    container: !disableInnerContainer,
                  },
                  captionClassName,
                )}
              >
                <RichText data={caption} enableGutter={false} />
              </div>
            ),
            srcSet:
              sizes && sizes.og && sizes.og.url
                ? [
                    {
                      src: sizes.og.url,
                      width: sizes.og.width,
                      height: sizes.og.height,
                    },
                  ]
                : [],
          }
        })
        .filter((slide): slide is NonNullable<typeof slide> => slide !== null)
    : []

  return (
    <div
      className={cn(
        {
          container: enableGutter,
        },
        className,
      )}
    >
      <RowsPhotoAlbum
        photos={slides}
        targetRowHeight={150}
        onClick={({ index: current }) => setIndex(current)}
      />

      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom, Share]}
      />
    </div>
  )
}
