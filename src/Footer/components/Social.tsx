import type { Setting } from '@/payload-types'

export function Social({ data }: { data: Setting['social'] }) {
  return (
    <div className="footer-social-links flex gap-3 min-h-8">
      {data?.length
        ? data.map((item) => (
            <a
              key={item.id || item.page}
              href={item.page}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.type}
              className="footer-social-link text-xl"
            >
              <i className={item.icon || 'fas fa-share-alt'} aria-hidden="true" />
            </a>
          ))
        : null}
    </div>
  )
}
