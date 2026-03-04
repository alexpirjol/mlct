import type { FieldHook } from 'payload'

/**
 * Payload beforeChange hook for richText fields.
 *
 * Lexical always leaves `{ root: { children: [{ type: 'paragraph', children: [] }] } }`
 * when the user clears all content instead of setting the value to null.
 * This hook normalises that back to null so that `{richText && …}` guards work correctly.
 */
export const normalizeRichText: FieldHook = ({ value }) => {
  if (!value) return null

  const children = value?.root?.children
  if (!Array.isArray(children) || children.length === 0) return null

  // Single childless paragraph = effectively empty
  if (
    children.length === 1 &&
    children[0].type === 'paragraph' &&
    Array.isArray(children[0].children) &&
    children[0].children.length === 0
  ) {
    return null
  }

  return value
}
