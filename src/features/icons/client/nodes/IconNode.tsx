'use client'

import { $applyNodeReplacement, type LexicalNode } from 'lexical'
import React from 'react'

import { IconServerNode, type SerializedIconNode } from '../../server/nodes/IconNode'
import { IconComponent } from '../components/IconComponent'

export class IconNode extends IconServerNode {
  static clone(node: IconNode): IconNode {
    return new IconNode(node.__iconClass, node.__size, node.__key)
  }

  static getType(): string {
    return super.getType()
  }

  static importJSON(serializedNode: SerializedIconNode): IconNode {
    return new IconNode(serializedNode.iconClass, serializedNode.size ?? '')
  }

  exportJSON(): SerializedIconNode {
    return super.exportJSON()
  }

  decorate(): React.ReactElement {
    return <IconComponent iconClass={this.__iconClass} size={this.__size} nodeKey={this.__key} />
  }
}

export function $createIconNode(iconClass: string, size = ''): IconNode {
  return $applyNodeReplacement(new IconNode(iconClass, size))
}

export function $isIconNode(node: LexicalNode | null | undefined): node is IconNode {
  return node instanceof IconNode
}
