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
  nodeKey: string
}

export function IconComponent({ iconClass, size, nodeKey }: Props) {
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
    [editor, nodeKey, iconClass, size],
  )

  const classNames = [iconClass, size].filter(Boolean).join(' ')

  return (
    <span
      contentEditable={false}
      onMouseDown={handleMouseDown}
      title="Click to position cursor · Double-click to edit"
      style={{ cursor: 'default', userSelect: 'none', display: 'inline-block' }}
    >
      <i className={classNames} aria-hidden="true" />
    </span>
  )
}
