const isPropertyExist = (marks, prop) => Boolean(marks?.find((mark) => mark.type === prop))

function parseContent(content, styles = {}) {
  switch (content.type) {
    case 'mention':
      const id = content.attrs.id
      const name = content.attrs.label
      return { type: 'mention', text: '@' + name, id, styles: {} }
    case 'text':
      const marks = content.marks
      const textColor = marks?.find((mark) => mark.type === 'textColor')?.attrs?.color || 'default'
      const bold = isPropertyExist(marks, 'bold')
      const italic = isPropertyExist(marks, 'italic')
      const underline = isPropertyExist(marks, 'underline')
      const strike = isPropertyExist(marks, 'strike')

      return {
        type: 'text',
        text: content.text,
        styles: {
          textColor,
          bold,
          italic,
          underline,
          strike,
        },
      }
    case 'link':
      const href = content.attrs.href
      return {
        type: 'link',
        href,
        content: [parseContent(content.content[0], styles)],
      }
    default:
      return
  }
}

function parseBlock(block, addMention) {
  const type = block.type
  const props = block.attrs
  const content = block?.content?.map((content) => parseContent(content)) ?? []

  return { type, props, content }
}

function parseContainer(container, addTask, addFile) {
  const blockId = container.attrs.id
  const blockBackground = container.attrs.backgroundColor
  const blockTextColor = container.attrs.textColor
  const children =
    container.content
      ?.filter((block) => block.type === 'blockGroup')[0]
      ?.content?.map((con) => parseContainer(con, addTask)) ?? []
  const block = container.content
    ?.filter((block) => block.type !== 'blockGroup')
    ?.map((block) => {
      const parsedBlock = parseBlock(block)

      switch (parsedBlock.type) {
        case 'task':
          addTask({
            id: blockId,
            isDone: parsedBlock.props.isDone,
            text: parsedBlock?.content
              ?.map((content) => {
                switch (content.type) {
                  case 'text':
                  case 'mention':
                    return content.text
                  case 'link':
                    return content.content.text
                  default:
                    return ''
                }
              })
              ?.join(''),
            users: parsedBlock?.content
              ?.filter((content) => content.type === 'mention')
              ?.map((mention) => mention.id),
          })
          break
        case 'image':
          addFile({
            id: blockId,
            type: 'image',
            url: parsedBlock.props.src,
          })
          break
        default:
          break
      }

      return {
        ...parsedBlock,
        id: blockId,
        props: {
          ...parsedBlock.props,
          backgroundColor: blockBackground,
          textColor: blockTextColor,
        },
      }
    })

  return { ...block[0], children }
}

function parseBlockGroup(block, addTask, addFile) {
  return block.content?.map((container) => parseContainer(container, addTask, addFile))
}

function parseBNXmlToBlocks(data) {
  const allTasks = []
  const allFiles = []
  const addTask = (task) => allTasks.push(task)
  const addFile = (file) => allFiles.push(file)

  const blocks = data.content?.map((block) => parseBlockGroup(block, addTask, addFile))

  const description = blocks[0]
    ?.filter((block) => block.type !== 'task')
    ?.map((block) =>
      block?.content
        ?.map((content) => {
          switch (content.type) {
            case 'text':
            case 'mention':
              return content.text
            case 'link':
              return content.content.text
            default:
              return ''
          }
        })
        ?.join(''),
    )
    ?.filter((line) => line !== '')
    ?.slice(0, 3)

  return { allTasks, allFiles, description }
}

export default parseBNXmlToBlocks
