'use client'

import '@fortawesome/fontawesome-free/css/all.min.css'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { $getNodeByKey } from 'lexical'
import React, { useCallback } from 'react'

import { EDIT_ICON_COMMAND } from '../../server/nodes/IconNode'
import { $isIconNode } from '../nodes/IconNode'

type Props = {
  iconClass: string
  size: string
  color: string
  bgColor: string
  fontSize: string
  nodeKey: string
}

export function IconComponent({ iconClass, size, color, bgColor, fontSize, nodeKey }: Props) {
  const [editor] = useLexicalComposerContext()

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      if (e.detail >= 2) {
        // Double-click: open edit dialog
        e.preventDefault()
        editor.dispatchCommand(EDIT_ICON_COMMAND, { nodeKey, iconClass, size })
        return
      }
      // Single click: place cursor before or after the icon depending on which
      // half was clicked, instead of letting Lexical create a NodeSelection.
      e.preventDefault()
      const rect = e.currentTarget.getBoundingClientRect()
      const isRightHalf = e.clientX > rect.left + rect.width / 2
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if (!$isIconNode(node)) return
        if (isRightHalf) {
          node.selectNext(0, 0)
        } else {
          node.selectPrevious()
        }
      })
    },
    [editor, nodeKey, iconClass, size, color, bgColor, fontSize],
  )

  const classNames = [iconClass, size].filter(Boolean).join(' ')

  const iconStyle: React.CSSProperties = {}
  if (color) iconStyle.color = color
  if (bgColor) iconStyle.backgroundColor = bgColor
  if (fontSize) iconStyle.fontSize = fontSize

  return (
    <span
      contentEditable={false}
      onMouseDown={handleMouseDown}
      title="Click to position cursor · Double-click to edit"
      style={{ cursor: 'default', userSelect: 'none', display: 'inline-block' }}
    >
      <i
        className={classNames}
        aria-hidden="true"
        style={Object.keys(iconStyle).length ? iconStyle : undefined}
      />
    </span>
  )
}
