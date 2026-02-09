import React from 'react'

import type { Project, Category } from '@/payload-types'

import { Media } from '@/components/Media'

export const PostHero: React.FC<{
  project: Project | Category
}> = ({ project }) => {
  const { heroImage, title } = project

  if (!heroImage) {
    return null
  }

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8 hero-text">
        <div className="col-start-1 col-span-1  md:col-span-2">
          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16"></div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-linear-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
