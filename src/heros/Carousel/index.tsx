'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import './styles.css'
import { Pagination, Autoplay, EffectFade } from 'swiper/modules'
import RichText from '@/components/RichText'

import { Media } from '@/components/Media'
import type { Page } from '@/payload-types'

export const Carousel: React.FC<Page['hero']> = ({
  media,
  richText,
  autoplay = true,
  autoplayInterval = 2000,
}) => {
  return (
    <div className="relative  flex items-center justify-center text-white" data-theme="dark">
      {richText && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="container">
            <div className="max-w-[36.5rem] mx-auto md:text-center">
              <RichText className="mb-6" data={richText} enableGutter={false} />
            </div>
          </div>
        </div>
      )}
      <Swiper
        effect="fade"
        speed={2000}
        direction={'vertical'}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay, EffectFade]}
        autoplay={
          autoplay
            ? {
                delay: autoplayInterval,
                disableOnInteraction: false,
              }
            : false
        }
        className="mySwiper min-h-[80vh]"
      >
        {media &&
          typeof media === 'object' &&
          media.map((img, i) => {
            return (
              <SwiperSlide key={i} className="relative">
                <Media
                  className="w-full h-full"
                  imgClassName="object-cover"
                  priority
                  resource={img}
                />
              </SwiperSlide>
            )
          })}
      </Swiper>
    </div>
  )
}
