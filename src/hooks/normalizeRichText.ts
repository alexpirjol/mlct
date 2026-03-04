import type { FieldHook } from 'payload'

const emptyLexical = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}

/**
 * Payload beforeChange hook for richText fields.
 *
 * Returning null crashes Payload's afterRead traversal, so we normalise
 * empty/null content to a safe empty-paragraph structure before saving.
 * The frontend uses isEmptyLexical() to detect and hide this state at render time.
 */
export const normalizeRichText: FieldHook = ({ value }) => {
  if (!value) return emptyLexical

  const children = value?.root?.children
  if (!Array.isArray(children) || children.length === 0) return emptyLexical

  if (
    children.length === 1 &&
    children[0].type === 'paragraph' &&
    Array.isArray(children[0].children) &&
    children[0].children.length === 0
  ) {
    return emptyLexical
  }

  return value
}
