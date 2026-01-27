'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import './styles.css'
import { Pagination, Autoplay, EffectFade } from 'swiper/modules'
import Image from 'next/image'

interface CarouselProps {
  media: MediaType[]
}

export function Carousel({ media }: CarouselProps) {
  // Prefer explicit media array, fallback to carouselImages, then single media

  console.log(media)
  // if (!media.length) return null

  return (
    <Swiper
      effect="fade"
      speed={2000}
      direction={'vertical'}
      pagination={{ clickable: true }}
      modules={[Pagination, Autoplay, EffectFade]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      className="mySwiper"
    >
      {media.map((img, i) => {
        const url = img?.url || ''
        const height = img?.height ?? 600
        const width = img?.width ?? 1000
        const alt = img?.alt || 'Carousel image'
        return (
          <SwiperSlide key={i}>
            <Image src={url} height={height} width={width} alt={alt} />
            {/* <Media fill imgClassName="-z-10 object-cover" priority resource={url} /> */}
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
