import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

/**
 * Returns true when a Lexical editor state contains no meaningful content —
 * i.e. null/undefined, or the root has only a single empty paragraph
 * (Lexical's default empty state when a user clears all content).
 */
export function isEmptyLexical(data: DefaultTypedEditorState | null | undefined): boolean {
  if (!data) return true
  const children = data?.root?.children
  if (!children || children.length === 0) return true
  if (
    children.length === 1 &&
    children[0].type === 'paragraph' &&
    Array.isArray(children[0].children) &&
    children[0].children.length === 0
  ) {
    return true
  }
  return false
}
