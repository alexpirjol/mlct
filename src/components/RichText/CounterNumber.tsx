'use client'

/**
 * AnimatedEffect — triggers Lexical text animations when the element enters
 * the viewport, using IntersectionObserver.
 *
 * - All CSS effects (fade-in, slide-up, pulse, shake): sets data-visible="true"
 *   on the wrapper span so the CSS @keyframes kick in.
 * - Counter effect on a plain integer: additionally animates the value from 0
 *   using requestAnimationFrame (CSS-Tricks technique).
 *
 * Animates once on first entry, stays visible afterwards.
 */

import { useEffect, useRef } from 'react'
import type React from 'react'

type Props = {
  effect: string
  /** Only used for the counter effect. */
  counterValue?: number
  style?: React.CSSProperties
  children?: React.ReactNode
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const COUNTER_DURATION = 2000

export function AnimatedEffect({ effect, counterValue, style, children }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let animationId: number | null = null

    function runCounter(startTime: number, now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / COUNTER_DURATION, 1)
      const current = Math.round(easeOutCubic(progress) * counterValue!)
      el!.textContent = String(current)
      if (progress < 1) {
        animationId = requestAnimationFrame((t) => runCounter(startTime, t))
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        // Reveal element — CSS animation starts via [data-visible="true"] selector.
        el.dataset.visible = 'true'
        // Additional JS counter for integer values.
        if (effect === 'counter' && counterValue !== undefined) {
          animationId = requestAnimationFrame((t) => runCounter(t, t))
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (animationId !== null) cancelAnimationFrame(animationId)
    }
  }, [effect, counterValue])

  const isCounter = effect === 'counter' && counterValue !== undefined

  return (
    <span
      ref={ref}
      data-effect={effect}
      // SSR: show real value / content. JS replaces textContent for counter.
      aria-label={isCounter ? String(counterValue) : undefined}
      style={style}
    >
      {isCounter ? counterValue : children}
    </span>
  )
}
