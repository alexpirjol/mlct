import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  console.log('context.disableRevalidate', context.disableRevalidate)
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating settings`)

    revalidateTag('global_setting')
  }

  return doc
}
