import { BlockNoteEditor } from '@blocknote/core'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [editor, setEditor] = useState<BlockNoteEditor | undefined>(undefined)
  const contextValue: EditorContext = {
    editor,
    setEditor,
  }
  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>
}

export type EditorContext = {
  editor: BlockNoteEditor | undefined
  setEditor: (editor: BlockNoteEditor) => void
}

export const EditorContext = createContext<EditorContext | undefined>(undefined)

export const useEditor = (): EditorContext => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within a EditorProvider')
  }
  return context
}

interface UseHighlightBlockOptions {
  duration?: number
  color?: string
  behavior?: ScrollBehavior
}

const HIGHLIGHT_PLUGIN_KEY = new PluginKey('highlight-plugin')

type HighlightPluginState = {
  decorations: DecorationSet
}

export function useHighlightBlock(options: UseHighlightBlockOptions = {}) {
  const { editor } = useEditor()
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const { duration = 3000, color = 'rgba(255, 255, 0, 0.3)', behavior = 'smooth' } = options

  useEffect(() => {
    if (!editor) return

    const highlightPlugin = new Plugin<HighlightPluginState>({
      key: HIGHLIGHT_PLUGIN_KEY,
      state: {
        init() {
          return { decorations: DecorationSet.empty }
        },
        apply(tr, state) {
          const action = tr.getMeta(HIGHLIGHT_PLUGIN_KEY)

          if (!tr.docChanged && !action) {
            return state
          }

          const decorations: Decoration[] = []

          if (activeBlockId && tr.doc) {
            tr.doc.descendants((node, pos) => {
              if (node.attrs.id === activeBlockId) {
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    class: 'bn-highlight-animation active',
                  }),
                )
                return false
              }
            })
          }

          return {
            decorations: DecorationSet.create(tr.doc, decorations),
          }
        },
      },
      props: {
        decorations(state) {
          return HIGHLIGHT_PLUGIN_KEY.getState(state)?.decorations
        },
      },
    })

    try {
      if (editor.prosemirrorView?.state) {
        editor.prosemirrorView.updateState(
          editor.prosemirrorView.state.reconfigure({
            plugins: [...editor.prosemirrorView.state.plugins, highlightPlugin],
          }),
        )
      }
    } catch (e) {
      console.error('Error updating editor state:', e)
    }

    return () => {
      try {
        if (editor?.prosemirrorView?.state) {
          const plugins = editor.prosemirrorView.state.plugins.filter((p) => p !== highlightPlugin)
          editor.prosemirrorView.updateState(editor.prosemirrorView.state.reconfigure({ plugins }))
        }
      } catch (e) {
        console.error('Error cleaning up plugin:', e)
      }
    }
  }, [editor, activeBlockId, color])

  const highlight = useCallback(
    (blockId: string) => {
      if (!editor || !blockId) return

      setActiveBlockId(blockId)

      const doc = editor.prosemirrorView?.state.doc
      if (doc) {
        doc.descendants((node, pos) => {
          if (node.attrs.id === blockId) {
            editor.focus()
            const dom = editor.prosemirrorView?.nodeDOM(pos)
            if (dom instanceof HTMLElement) {
              // Находим родительский контейнер с скроллом
              const scrollContainer = dom.closest('section')
              if (scrollContainer) {
                // Получаем позицию элемента относительно контейнера
                const elementRect = dom.getBoundingClientRect()
                const containerRect = scrollContainer.getBoundingClientRect()

                // Рассчитываем позицию с учетом хедера (112px - высота хедера)
                const headerHeight = 112
                const scrollTop =
                  elementRect.top -
                  containerRect.top -
                  headerHeight -
                  (containerRect.height - elementRect.height) / 2

                // Плавно скроллим к элементу
                scrollContainer.scrollTo({
                  top: scrollTop + scrollContainer.scrollTop,
                  behavior,
                })
              }
            }
            return false
          }
        })
      }

      setTimeout(() => {
        setActiveBlockId(null)
      }, duration)
    },
    [editor, duration, behavior],
  )

  return highlight
}
