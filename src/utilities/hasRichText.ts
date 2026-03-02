import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type LexicalNode = {
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

/** Recursively check whether any node in the tree contains non-whitespace text. */
function nodeHasText(node: LexicalNode): boolean {
  if (typeof node.text === 'string' && node.text.trim().length > 0) return true
  if (Array.isArray(node.children)) {
    return node.children.some(nodeHasText)
  }
  return false
}

/**
 * Returns true when a Lexical editor state contains at least one non-empty text node.
 * Treats null / undefined / empty root children as "no content".
 */
export function hasRichText(data?: DefaultTypedEditorState | null): boolean {
  if (!data) return false
  const root = data.root
  if (!root || !Array.isArray(root.children) || root.children.length === 0) return false
  return root.children.some((child) => nodeHasText(child as LexicalNode))
}
