'use client'
import React, { useState, useRef, useEffect } from 'react'
import styles from './WhatsApp.module.css'
import type { Setting } from '@/payload-types'

type Props = {
  data: Setting
}

export default function WhatsAppWidget({ data }: Props) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [showDots, setShowDots] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (open) {
      setShowDots(true)
      setShowText(false)
      timeout = setTimeout(() => {
        setShowDots(false)
        setShowText(true)
      }, 2000)
    } else {
      setShowDots(false)
      setShowText(false)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [open])

  const handleSend = () => {
    if (input.trim()) {
      const url = `https://wa.me/${data.contact?.phone?.replace(/[^\d]/g, '')}?text=${encodeURIComponent(input)}`
      window.open(url, '_blank')
      setInput('')
      setOpen(false)
    }
  }

  return (
    <div className={styles['whatsapp-widget-fixed']}>
      {open && (
        <div className={styles['whatsapp-chat-window']}>
          <div className={styles['whatsapp-header']}>
            <div className={styles['whatsapp-avatar-bg']}>
              <img
                src={data.generalSttings?.logo?.url || '/media/default-logo.png'}
                alt={data.organization?.organizationName || 'Avatar'}
                className={styles['whatsapp-avatar-img']}
                decoding="async"
              />
            </div>
            <div className={styles['whatsapp-header-info']}>
              <div className={styles['whatsapp-header-title']}>
                {data.organization?.organizationName || 'Company'}
              </div>
              <div className={styles['whatsapp-header-status']}>Online</div>
            </div>
            <button
              className={styles['whatsapp-close-btn']}
              aria-label="Close chat window"
              onClick={() => setOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>
          <div className={styles['whatsapp-messages']}>
            <div className={styles['whatsapp-message']}>
              <span className={styles['whatsapp-message-bubble']}>
                <svg
                  width="9"
                  height="17"
                  viewBox="0 0 9 17"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.772965 3.01404C-0.0113096 1.68077 0.950002 0 2.49683 0H9V17L0.772965 3.01404Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              {showDots && (
                <div className={styles['whatsapp-dots']}>
                  <span className={styles['whatsapp-dot']} />
                  <span className={styles['whatsapp-dot']} />
                  <span className={styles['whatsapp-dot']} />
                </div>
              )}
              {showText && (
                <p>
                  Buna 👋
                  <br />
                  Cu ce va putem ajuta?
                </p>
              )}
            </div>
          </div>
          <div className={styles['whatsapp-input-row']}>
            <input
              ref={inputRef}
              className={styles['whatsapp-input']}
              type="text"
              placeholder="Enter Your Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
              aria-label="Type your message"
            />
            <button
              className={styles['whatsapp-send-btn']}
              onClick={handleSend}
              aria-label="Send message"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 28 28"
                width="22"
                height="22"
                fill="#fff"
              >
                <path d="M9.166 7.5a.714.714 0 0 0-.998.83l1.152 4.304a.571.571 0 0 0 .47.418l5.649.807c.163.023.163.26 0 .283l-5.648.806a.572.572 0 0 0-.47.418l-1.153 4.307a.714.714 0 0 0 .998.83l12.284-5.857a.715.715 0 0 0 0-1.29L9.166 7.5Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <button
        className={styles['whatsapp-bubble-btn']}
        aria-label="Open chat window"
        onClick={() => setOpen(true)}
        type="button"
        style={{ display: open ? 'none' : 'flex' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
          viewBox="0 0 90 90"
          width="36"
          height="36"
        >
          <path d="M90 43.841c0 24.213-19.779 43.841-44.182 43.841a44.256 44.256 0 0 1-21.357-5.455L0 90l7.975-23.522a43.38 43.38 0 0 1-6.34-22.637C1.635 19.628 21.416 0 45.818 0 70.223 0 90 19.628 90 43.841zM45.818 6.982c-20.484 0-37.146 16.535-37.146 36.859 0 8.065 2.629 15.534 7.076 21.61L11.107 79.14l14.275-4.537A37.122 37.122 0 0 0 45.819 80.7c20.481 0 37.146-16.533 37.146-36.857S66.301 6.982 45.818 6.982zm22.311 46.956c-.273-.447-.994-.717-2.076-1.254-1.084-.537-6.41-3.138-7.4-3.495-.993-.358-1.717-.538-2.438.537-.721 1.076-2.797 3.495-3.43 4.212-.632.719-1.263.809-2.347.271-1.082-.537-4.571-1.673-8.708-5.333-3.219-2.848-5.393-6.364-6.025-7.441-.631-1.075-.066-1.656.475-2.191.488-.482 1.084-1.255 1.625-1.882.543-.628.723-1.075 1.082-1.793.363-.717.182-1.344-.09-1.883-.27-.537-2.438-5.825-3.34-7.977-.902-2.15-1.803-1.792-2.436-1.792-.631 0-1.354-.09-2.076-.09s-1.896.269-2.889 1.344c-.992 1.076-3.789 3.676-3.789 8.963 0 5.288 3.879 10.397 4.422 11.113.541.716 7.49 11.92 18.5 16.223C58.2 65.771 58.2 64.336 60.186 64.156c1.984-.179 6.406-2.599 7.312-5.107.9-2.512.9-4.663.631-5.111z" />
        </svg>
      </button>
    </div>
  )
}
