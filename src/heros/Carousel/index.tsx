'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
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
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [showText, setShowText] = React.useState(false)
  const hasMovedPastFirstSlide = React.useRef(false)
  const fadeDuration = (autoplayInterval || 2000) + 1000

  React.useEffect(() => {
    // Fade in on mount
    const fadeInTimer = setTimeout(() => setShowText(true), 50)
    return () => clearTimeout(fadeInTimer)
  }, [])

  React.useEffect(() => {
    // When we reach slide 2 (index 1), start fading out
    if (activeIndex === 1 && !hasMovedPastFirstSlide.current) {
      hasMovedPastFirstSlide.current = true
      setShowText(false)
    }
  }, [activeIndex])

  return (
    <div
      className="relative h-[80vh] flex items-center justify-center text-white"
      data-theme="dark"
    >
      {richText && (
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity carousel-hero-text ${
            showText ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: `${fadeDuration}ms` }}
        >
          <div className="container">
            <div className="max-w-[36.5rem] mx-auto md:text-center">
              <RichText className="mb-6" data={richText} enableGutter={false} />
            </div>
          </div>
        </div>
      )}
      <Swiper
        effect="fade"
        loop={true}
        speed={1500}
        fadeEffect={{
          crossFade: true,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Autoplay, EffectFade]}
        autoplay={
          autoplay
            ? {
                delay: autoplayInterval || 2000,
                disableOnInteraction: false,
              }
            : false
        }
        className={`mySwiper h-full w-full ${autoplay ? 'autoplay-enabled' : ''}`}
        style={
          {
            '--autoplay-duration': `${autoplayInterval || 2000}ms`,
          } as React.CSSProperties
        }
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {media &&
          typeof media === 'object' &&
          media.map((img, i) => {
            return (
              <SwiperSlide key={i} className="relative h-full w-full" data-zoom={i % 2 === 0 ? 'in' : 'out'}>
                <Media
                  className="w-full h-full absolute inset-0"
                  imgClassName="object-cover w-full h-full"
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
