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
import { isEmptyLexical } from '@/utilities/isEmptyLexical'

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
  carouselHeight,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [showText, setShowText] = React.useState(!animation)
  const hasMovedPastFirstSlide = React.useRef(false)
  const isMounted = React.useRef(false)
  const fadeDuration = (autoplayInterval || 2000) + 1000

  React.useEffect(() => {
    // Mark as mounted after a tick so Swiper's internal loop-init slide changes are ignored
    const t = setTimeout(() => {
      isMounted.current = true
    }, 100)
    return () => clearTimeout(t)
  }, [])

  const restartZoomAnimation = React.useCallback(
    (swiper: { slides?: HTMLElement[]; activeIndex?: number }) => {
      const activeSlide = swiper.slides?.[swiper.activeIndex ?? 0]
      if (!activeSlide) return
      const img = activeSlide.querySelector('img')
      if (!img) return
      img.style.animationName = 'none'
      void img.offsetWidth // trigger reflow to restart
      img.style.animationName = ''
    },
    [],
  )
  const heightStyle: React.CSSProperties | undefined = carouselHeight
    ? { height: carouselHeight }
    : { height: '80vh' }

  // Centered-mode derived values
  const isCentered = Boolean(centered)
  const centeredSlidesPerView: number | 'auto' =
    !slidesPerView || slidesPerView === 'auto' ? 'auto' : parseFloat(slidesPerView as string)
  const centeredSlideWidthPct = slideWidth ? String(slideWidth) : '80'

  // Mobile portrait: ~50% lower slidesPerView (min 1)
  const mobileSlidesPerView: number | 'auto' =
    centeredSlidesPerView === 'auto' ? 'auto' : Math.max(1, centeredSlidesPerView * 0.5)
  // For auto mode, wider slide width on mobile compensates for fewer visible slides
  const mobileSlideWidthPct =
    centeredSlidesPerView === 'auto'
      ? String(Math.min(95, Math.round(parseFloat(centeredSlideWidthPct) * 1.5)))
      : centeredSlideWidthPct

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
          !isCentered && direction,
          'flex items-center justify-center text-white',
          'carousel-hero-wrapper',
        )}
        data-theme="dark"
        style={
          {
            ...(heightStyle ?? {}),
            ...(isCentered
              ? {
                  '--ccp-slide-width': `${centeredSlideWidthPct}%`,
                  '--ccp-slide-width-sm': `${mobileSlideWidthPct}%`,
                }
              : {}),
          } as React.CSSProperties
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
          breakpoints={
            isCentered
              ? {
                  0: {
                    spaceBetween: 4,
                    ...(centeredSlidesPerView !== 'auto' && {
                      slidesPerView: mobileSlidesPerView as number,
                    }),
                  },
                  431: {
                    spaceBetween: 16,
                    ...(centeredSlidesPerView !== 'auto' && {
                      slidesPerView: centeredSlidesPerView as number,
                    }),
                  },
                }
              : undefined
          }
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
            'mySwiper w-full',
            !isCentered && 'h-full',
            animation && 'animation-enabled',
            isCentered && 'centered-mode',
          )}
          style={
            {
              '--autoplay-duration': `${autoplayInterval || 2000}ms`,
              '--slide-speed': `${autoplayInterval || 2000}ms`,
            } as React.CSSProperties
          }
          onRealIndexChange={(swiper) => {
            setActiveIndex(swiper.realIndex)
            if (animation && !isCentered && isMounted.current) {
              // Small delay lets Swiper finish its loop-jump reposition before we restart
              setTimeout(() => restartZoomAnimation(swiper), 50)
            }
          }}
        >
          {slides?.map(({ media, richText }, i) => {
            return (
              <SwiperSlide
                key={i}
                className={cn('relative', isCentered ? 'centered-slide' : 'h-full w-full')}
                data-zoom={!isCentered && i % 2 === 0 ? 'in' : 'out'}
              >
                <div className={isCentered ? 'relative overflow-hidden rounded-lg' : undefined}>
                  {!isEmptyLexical(richText) && (
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
                          <RichText className="mb-6" data={richText!} enableGutter={false} />
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
