import 'payload'

declare module 'payload' {
  export interface RequestContext {
    /**
     * When set to true, prevents automatic revalidation of Next.js cache
     * after document changes. Useful for bulk operations or migrations.
     */
    disableRevalidate?: boolean
  }
}
