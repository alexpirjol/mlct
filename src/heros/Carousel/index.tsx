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
  centered = false,
  slidesPerView,
  slideWidth,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [showText, setShowText] = React.useState(!animation)
  const hasMovedPastFirstSlide = React.useRef(false)
  const fadeDuration = (autoplayInterval || 2000) + 1000
  const fixedHeight = slides && slides.some((s) => Boolean(s?.media))

  // Centered-mode derived values
  const isCentered = Boolean(centered)
  const centeredSlidesPerView: number | 'auto' =
    !slidesPerView || slidesPerView === 'auto' ? 'auto' : parseFloat(slidesPerView as string)
  const centeredSlideWidthPct = slideWidth ? String(slideWidth) : '80'

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
    <>
      <div
        className={cn(
          'relative',
          'min-h-[250px]',
          fixedHeight ? (isCentered ? '' : 'h-[50vh] md:h-[80vh]') : 'h-[20vh]',
          !isCentered && direction,
          'flex items-center justify-center text-white',
        )}
        data-theme="dark"
        style={
          isCentered && centeredSlidesPerView === 'auto'
            ? ({ '--ccp-slide-width': `${centeredSlideWidthPct}%` } as React.CSSProperties)
            : undefined
        }
      >
        <Swiper
          effect={isCentered ? 'slide' : effect || 'fade'}
          loop={true}
          speed={autoplayInterval || 2000}
          direction={isCentered ? 'horizontal' : direction || 'vertical'}
          centeredSlides={isCentered}
          slidesPerView={isCentered ? centeredSlidesPerView : 1}
          spaceBetween={isCentered ? 16 : 0}
          fadeEffect={!isCentered ? { crossFade: true } : undefined}
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
          className={cn(
            'mySwiper h-full w-full',
            animation && 'animation-enabled',
            isCentered && 'centered-mode',
          )}
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
                className={cn('relative', isCentered ? 'centered-slide' : 'h-full w-full')}
                data-zoom={!isCentered && i % 2 === 0 ? 'in' : 'out'}
              >
                <div className={isCentered ? 'relative overflow-hidden rounded-lg' : undefined}>
                  {richText && (
                    <div
                      className={cn(
                        'z-20 flex items-center justify-center pointer-events-none carousel-hero-text',
                        isCentered ? 'relative p-6' : 'absolute inset-0',
                        animation && !isCentered ? 'transition-opacity' : '',
                        !isCentered && (showText ? 'opacity-100' : 'opacity-0'),
                      )}
                      style={!isCentered ? { transitionDuration: `${fadeDuration}ms` } : undefined}
                    >
                      <div className={isCentered ? undefined : 'container'}>
                        <div
                          className={
                            isCentered ? undefined : 'max-w-[36.5rem] mx-auto md:text-center'
                          }
                        >
                          <RichText className="mb-6" data={richText} enableGutter={false} />
                        </div>
                      </div>
                    </div>
                  )}
                  {media && typeof media === 'object' && (
                    <Media
                      className={isCentered ? 'w-full' : 'w-full h-full absolute inset-0'}
                      imgClassName={
                        isCentered ? 'object-cover w-full' : 'object-cover w-full h-full'
                      }
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
    </>
  )
}

export default Carousel
