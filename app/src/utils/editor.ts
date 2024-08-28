import { BlockNoteEditor, BlockSchema, PartialBlock } from '@blocknote/core'

export function insertOrUpdateBlock<BSchema extends BlockSchema>(
  editor: BlockNoteEditor<BSchema>,
  block: PartialBlock<BSchema>,
) {
  try {
    const currentBlock = editor?.getTextCursorPosition()?.block
    if (
      (currentBlock?.content?.length === 1 &&
        currentBlock?.content?.[0]?.type === 'text' &&
        currentBlock?.content?.[0]?.text === '/') ||
      currentBlock?.content?.length === 0
    ) {
      editor.updateBlock(currentBlock, block)
    } else {
      editor.insertBlocks([block], currentBlock, 'after')
      editor.setTextCursorPosition(editor.getTextCursorPosition().nextBlock!)
    }
  } catch (error) {
    console.error('Error inserting block', error)
  }
}
