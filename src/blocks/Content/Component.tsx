import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import { isEmptyLexical } from '@/utilities/isEmptyLexical'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<
  ContentBlockProps & { noHorizontalSpacing?: boolean | null }
> = (props) => {
  const { columns, noHorizontalSpacing } = props

  const colsSpanClasses = {
    quarter: '3',
    oneThird: '4',
    half: '6',
    twoThirds: '8',
    threeQuarters: '9',
    full: '12',
  }

  return (
    <div className={noHorizontalSpacing ? undefined : 'container'}>
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size, borderColor } = col

            const borderStyle =
              borderColor && borderColor !== 'none'
                ? { border: `2px solid ${borderColor}`, padding: '1rem' }
                : undefined

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                style={borderStyle}
                key={index}
              >
                {!isEmptyLexical(richText) && <RichText data={richText!} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
