'use client'

import { useLexicalDrawer } from '@payloadcms/richtext-lexical/client'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { Drawer } from '@payloadcms/ui'
import {
  $createRangeSelection,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import {
  EDIT_ICON_COMMAND,
  type EditIconPayload,
  INSERT_ICON_COMMAND,
} from '../../server/nodes/IconNode'
import { $createIconNode, $isIconNode } from '../nodes/IconNode'
import { IconPickerContent, type IconSelection } from '../components/IconPickerModal'

const ICON_DRAWER_SLUG = 'icon-picker-drawer'

type SavedPoint = { key: string; offset: number; type: 'element' | 'text' }

type DrawerState =
  | { mode: 'insert'; openKey: number }
  | { mode: 'edit'; nodeKey: string; iconClass: string; size: string; openKey: number }

export function IconPlugin() {
  const [editor] = useLexicalComposerContext()
  const { toggleDrawer, closeDrawer } = useLexicalDrawer(ICON_DRAWER_SLUG)
  const openCountRef = useRef(0)
  const savedAnchorRef = useRef<SavedPoint | null>(null)
  const [drawerState, setDrawerState] = useState<DrawerState>({ mode: 'insert', openKey: 0 })

  useEffect(() => {
    const unregisterInsert = editor.registerCommand(
      INSERT_ICON_COMMAND,
      () => {
        // Save selection point BEFORE the drawer opens and steals focus
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          savedAnchorRef.current = {
            key: selection.anchor.key,
            offset: selection.anchor.offset,
            type: selection.anchor.type,
          }
        } else {
          savedAnchorRef.current = null
        }
        openCountRef.current++
        setDrawerState({ mode: 'insert', openKey: openCountRef.current })
        toggleDrawer()
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )

    const unregisterEdit = editor.registerCommand(
      EDIT_ICON_COMMAND,
      (payload: EditIconPayload) => {
        openCountRef.current++
        setDrawerState({ mode: 'edit', openKey: openCountRef.current, ...payload })
        toggleDrawer()
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )

    return () => {
      unregisterInsert()
      unregisterEdit()
    }
  }, [editor, toggleDrawer])

  const handleConfirm = useCallback(
    (sel: IconSelection) => {
      editor.update(() => {
        if (drawerState.mode === 'insert') {
          const iconNode = $createIconNode(sel.iconClass, sel.size)
          const saved = savedAnchorRef.current
          if (saved) {
            // Restore saved selection so insertNodes lands at the right spot
            const restored = $createRangeSelection()
            restored.anchor.set(saved.key, saved.offset, saved.type)
            restored.focus.set(saved.key, saved.offset, saved.type)
            $setSelection(restored)
            restored.insertNodes([iconNode])
          } else {
            const current = $getSelection()
            if ($isRangeSelection(current)) current.insertNodes([iconNode])
          }
        } else if (drawerState.mode === 'edit') {
          const node = $getNodeByKey(drawerState.nodeKey)
          if ($isIconNode(node)) {
            const writable = node.getWritable()
            writable.__iconClass = sel.iconClass
            writable.__size = sel.size
          }
        }
      })
      closeDrawer()
    },
    [editor, drawerState, closeDrawer],
  )

  return (
    <Drawer slug={ICON_DRAWER_SLUG} title="Insert Icon" gutter={false}>
      <IconPickerContent
        key={drawerState.openKey}
        initialIconClass={drawerState.mode === 'edit' ? drawerState.iconClass : undefined}
        initialSize={drawerState.mode === 'edit' ? drawerState.size : undefined}
        isEditing={drawerState.mode === 'edit'}
        onConfirm={handleConfirm}
        onClose={closeDrawer}
      />
    </Drawer>
  )
}
