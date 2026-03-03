'use client'

import { $applyNodeReplacement, type LexicalNode } from 'lexical'
import React from 'react'

import { IconServerNode, type SerializedIconNode } from '../../server/nodes/IconNode'
import { IconComponent } from '../components/IconComponent'

export class IconNode extends IconServerNode {
  static clone(node: IconNode): IconNode {
    return new IconNode(
      node.__iconClass,
      node.__size,
      node.__color,
      node.__bgColor,
      node.__fontSize,
      node.__key,
    )
  }

  static getType(): string {
    return super.getType()
  }

  static importJSON(serializedNode: SerializedIconNode): IconNode {
    return new IconNode(
      serializedNode.iconClass,
      serializedNode.size ?? '',
      serializedNode.color ?? '',
      serializedNode.bgColor ?? '',
      serializedNode.fontSize ?? '',
    )
  }

  exportJSON(): SerializedIconNode {
    return super.exportJSON()
  }

  decorate(): React.ReactElement {
    return (
      <IconComponent
        iconClass={this.__iconClass}
        size={this.__size}
        color={this.__color}
        bgColor={this.__bgColor}
        fontSize={this.__fontSize}
        nodeKey={this.__key}
      />
    )
  }
}

export function $createIconNode(
  iconClass: string,
  size = '',
  color = '',
  bgColor = '',
  fontSize = '',
): IconNode {
  return $applyNodeReplacement(new IconNode(iconClass, size, color, bgColor, fontSize))
}

export function $isIconNode(node: LexicalNode | null | undefined): node is IconNode {
  return node instanceof IconNode
}
