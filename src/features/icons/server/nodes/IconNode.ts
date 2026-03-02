import type { ReactElement } from 'react'
import {
  $applyNodeReplacement,
  createCommand,
  DecoratorNode,
  type DOMConversionMap,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical'

export const INSERT_ICON_COMMAND = createCommand<InsertIconPayload>('INSERT_ICON_COMMAND')
export const EDIT_ICON_COMMAND = createCommand<EditIconPayload>('EDIT_ICON_COMMAND')

export type InsertIconPayload = {
  iconClass: string
  size?: string
}

export type EditIconPayload = {
  nodeKey: string
  iconClass: string
  size: string
}

export type SerializedIconNode = Spread<
  {
    type: 'icon'
    iconClass: string
    size: string
  },
  SerializedLexicalNode
>

export class IconServerNode extends DecoratorNode<ReactElement | null> {
  __iconClass: string
  __size: string

  constructor(iconClass: string = '', size: string = '', key?: NodeKey) {
    super(key)
    this.__iconClass = iconClass
    this.__size = size
  }

  static clone(node: IconServerNode): IconServerNode {
    return new this(node.__iconClass, node.__size, node.__key)
  }

  static importJSON(serializedNode: SerializedIconNode): IconServerNode {
    return new this(serializedNode.iconClass, serializedNode.size ?? '')
  }

  static getType(): string {
    return 'icon'
  }

  // Allow DOM copy-paste of <i class="fa-..."> elements
  static importDOM(): DOMConversionMap | null {
    return {
      i: (el: HTMLElement) => {
        const cls = el.getAttribute('class') || ''
        if (cls.includes('fa-')) {
          return {
            conversion: () => ({
              node: new IconServerNode(cls, ''),
            }),
            priority: 1,
          }
        }
        return null
      },
    }
  }

  createDOM(): HTMLElement {
    return document.createElement('span')
  }

  updateDOM(): boolean {
    return false
  }

  isInline(): boolean {
    return true
  }

  isKeyboardSelectable(): boolean {
    return true
  }

  isIsolated(): boolean {
    return false
  }

  exportJSON(): SerializedIconNode {
    return {
      type: 'icon',
      version: 1,
      iconClass: this.__iconClass,
      size: this.__size,
    }
  }

  decorate(): ReactElement | null {
    return null
  }
}

export function $createIconServerNode(iconClass: string, size = ''): IconServerNode {
  return $applyNodeReplacement(new IconServerNode(iconClass, size))
}

export function $isIconServerNode(node: LexicalNode | null | undefined): node is IconServerNode {
  return node instanceof IconServerNode
}
