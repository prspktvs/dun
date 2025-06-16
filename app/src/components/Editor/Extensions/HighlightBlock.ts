import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export interface HighlightBlockOptions {
  duration: number
  color: string
  behavior: ScrollBehavior
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlightBlock: {
      highlightBlock: (blockId: string) => ReturnType
    }
  }
}

const HIGHLIGHT_PLUGIN_KEY = new PluginKey('highlight-block')

type HighlightState = {
  decorations: DecorationSet
  activeBlockId: string | null
}

export const HighlightBlockExtension = Extension.create<HighlightBlockOptions>({
  name: 'highlightBlock',

  addOptions() {
    return {
      duration: 3000,
      color: 'rgba(255, 255, 0, 0.3)',
      behavior: 'smooth' as ScrollBehavior,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['*'],
        attributes: {
          'data-highlight-active': {
            default: null,
            renderHTML: (attributes) => {
              if (attributes['data-highlight-active']) {
                return {
                  'data-highlight-active': 'true',
                  style: `background-color: ${this.options.color}; transition: background-color 0.3s ease;`
                }
              }
              return {}
            },
          },
        },
      },
    ]
  },

  addCommands() {
    const extensionThis = this
    
    return {
      highlightBlock:
        (blockId: string) =>
        ({ tr, dispatch, state, editor }) => {
          if (!dispatch) return false

          const newTr = tr.setMeta(HIGHLIGHT_PLUGIN_KEY, {
            type: 'SET_ACTIVE_BLOCK',
            blockId,
          })

          dispatch(newTr)

          scrollToBlock(editor, blockId, extensionThis.options.behavior)

          setTimeout(() => {
            const currentState = editor.state
            const clearTr = currentState.tr.setMeta(HIGHLIGHT_PLUGIN_KEY, {
              type: 'CLEAR_HIGHLIGHT',
            })
            editor.view.dispatch(clearTr)
          }, extensionThis.options.duration)

          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const options = this.options
    
    return [
      new Plugin<HighlightState>({
        key: HIGHLIGHT_PLUGIN_KEY,
        
        state: {
          init(): HighlightState {
            return {
              decorations: DecorationSet.empty,
              activeBlockId: null,
            }
          },

          apply(tr, state): HighlightState {
            const action = tr.getMeta(HIGHLIGHT_PLUGIN_KEY)
            
            let newActiveBlockId = state.activeBlockId
            
            if (action?.type === 'SET_ACTIVE_BLOCK') {
              newActiveBlockId = action.blockId
            }

            if (action?.type === 'CLEAR_HIGHLIGHT') {
              newActiveBlockId = null
            }
            
            const decorations: Decoration[] = []

            if (newActiveBlockId) {
              tr.doc.descendants((node, pos) => {
 
                if (node.attrs?.id === newActiveBlockId && node.type.name === 'blockContainer') {                  
                  decorations.push(
                    Decoration.node(pos, pos + node.nodeSize, {
                      class: 'bn-highlight-block-active',
                    })
                  )
                  return false
                }
              })
            }

            return {
              decorations: DecorationSet.create(tr.doc, decorations),
              activeBlockId: newActiveBlockId,
            }
          },
        },

        props: {
          decorations(state) {
            return HIGHLIGHT_PLUGIN_KEY.getState(state)?.decorations || DecorationSet.empty
          },
        },
      }),
    ]
  },
})

function scrollToBlock(editor, blockId: string, behavior: ScrollBehavior) {
  const doc = editor.state.doc
  
  doc.descendants((node, pos) => {
    if (node.attrs.id === blockId) {
      const dom = editor.view.nodeDOM(pos)
      
      if (dom instanceof HTMLElement) {
        const scrollContainer = dom.closest('section') || document.documentElement
        const elementRect = dom.getBoundingClientRect()
        const containerRect = scrollContainer.getBoundingClientRect()

        const headerHeight = 112
        const scrollTop = elementRect.top - containerRect.top - headerHeight - 
          (containerRect.height - elementRect.height) / 2

        scrollContainer.scrollTo({
          top: scrollTop + scrollContainer.scrollTop,
          behavior: behavior,
        })
      }
      
      return false
    }
  })
}