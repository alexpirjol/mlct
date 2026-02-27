'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { cn } from '@/utilities/ui'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import './styles.css'
import {
  Pagination,
  Autoplay,
  EffectFade,
  EffectCards,
  EffectCoverflow,
  EffectCreative,
  EffectCube,
  EffectFlip,
} from 'swiper/modules'
import RichText from '@/components/RichText'

import { Media } from '@/components/Media'

import type { Page } from '@/payload-types'

export const Carousel: React.FC<Partial<NonNullable<Page['hero']>>> = ({
  slides,
  autoplay = true,
  animation = true,
  direction,
  effect,
  autoplayInterval = 2000,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [showText, setShowText] = React.useState(!animation)
  const hasMovedPastFirstSlide = React.useRef(false)
  const fadeDuration = (autoplayInterval || 2000) + 1000
  const fixedHeight = slides && slides.some((s) => Boolean(s?.media))

  React.useEffect(() => {
    if (!animation) {
      return
    }
    // Fade in on mount
    const fadeInTimer = setTimeout(() => setShowText(true), 50)
    return () => clearTimeout(fadeInTimer)
  }, [animation])

  React.useEffect(() => {
    if (!animation) {
      return
    }
    // When we reach slide 2 (index 1), start fading out
    if (activeIndex === 1 && !hasMovedPastFirstSlide.current) {
      hasMovedPastFirstSlide.current = true
      setShowText(false)
    }
  }, [activeIndex, animation])

  return (
    <div
      className={cn(
        'relative',
        'min-h-[200px]',
        fixedHeight ? 'h-[50vh] md:h-[80vh]' : 'h-[10vh]',
        direction,
        'flex items-center justify-center text-white',
      )}
      data-theme="dark"
    >
      <Swiper
        effect={effect || 'fade'}
        loop={true}
        speed={autoplayInterval || 2000}
        direction={direction || 'vertical'}
        fadeEffect={{
          crossFade: true,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[
          Pagination,
          Autoplay,
          EffectFade,
          EffectCards,
          EffectCoverflow,
          EffectCreative,
          EffectCube,
          EffectFlip,
        ]}
        autoplay={
          autoplay
            ? {
                delay: autoplayInterval || 2000,
                disableOnInteraction: false,
              }
            : false
        }
        className={`mySwiper h-full w-full ${animation ? 'animation-enabled' : ''}`}
        style={
          {
            '--autoplay-duration': `${autoplayInterval || 2000}ms`,
          } as React.CSSProperties
        }
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides?.map(({ media, richText }, i) => {
          return (
            <SwiperSlide
              key={i}
              className="relative h-full w-full"
              data-zoom={i % 2 === 0 ? 'in' : 'out'}
            >
              <div>
                {richText && (
                  <div
                    className={cn(
                      'absolute inset-0 z-20 flex items-center justify-center pointer-events-none carousel-hero-text',
                      animation ? 'transition-opacity' : '',
                      showText ? 'opacity-100' : 'opacity-0',
                    )}
                    style={{ transitionDuration: `${fadeDuration}ms` }}
                  >
                    <div className="container">
                      <div className="max-w-[36.5rem] mx-auto md:text-center">
                        <RichText className="mb-6" data={richText} enableGutter={false} />
                      </div>
                    </div>
                  </div>
                )}
                {media && typeof media === 'object' && (
                  <Media
                    className="w-full h-full absolute inset-0"
                    imgClassName="object-cover w-full h-full"
                    priority
                    resource={media}
                  />
                )}
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default Carousel
