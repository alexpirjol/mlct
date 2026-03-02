'use client'

import '@fortawesome/fontawesome-free/css/all.min.css'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import React, { useCallback } from 'react'

import { EDIT_ICON_COMMAND } from '../../server/nodes/IconNode'

type Props = {
  iconClass: string
  size: string
  nodeKey: string
}

export function IconComponent({ iconClass, size, nodeKey }: Props) {
  const [editor] = useLexicalComposerContext()

  const handleDoubleClick = useCallback(() => {
    editor.dispatchCommand(EDIT_ICON_COMMAND, { nodeKey, iconClass, size })
  }, [editor, nodeKey, iconClass, size])

  const classNames = [iconClass, size].filter(Boolean).join(' ')

  return (
    <span
      contentEditable={false}
      className="inline-flex items-baseline"
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit icon"
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <i className={classNames} aria-hidden="true" />
    </span>
  )
}
