import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { isEmptyLexical } from '@/utilities/isEmptyLexical'

export const LowImpactHero: React.FC<
  Partial<NonNullable<Page['hero']>> & { children?: React.ReactNode }
> = ({ children, richText }) => {
  return (
    <div className="container mt-16 hero-text">
      <div className="max-w-[48rem]">
        {children ||
          (!isEmptyLexical(richText) && <RichText data={richText!} enableGutter={false} />)}
      </div>
    </div>
  )
}
