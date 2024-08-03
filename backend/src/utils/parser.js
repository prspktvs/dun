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

function parseBlock(block) {
  const type = block.type
  const props = block.attrs
  const content = block?.content?.map((content) => parseContent(content)) ?? []

  return { type, props, content }
}

function parseContainer(container, addContent) {
  const blockId = container.attrs.id
  const blockBackground = container.attrs.backgroundColor
  const blockTextColor = container.attrs.textColor
  const children =
    container.content
      ?.filter((block) => block.type === 'blockGroup')[0]
      ?.content?.map((con) => parseContainer(con, addContent)) ?? []
  const block = container.content
    ?.filter((block) => block.type !== 'blockGroup')
    ?.map((block) => {
      const parsedBlock = parseBlock(block)
      switch (parsedBlock.type) {
        case 'task':
          addContent('tasks', {
            id: blockId,
            isDone: parsedBlock.props.isDone,
            priority: parsedBlock.props.priority,
            status: parsedBlock.props.status,
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
            author: parsedBlock.props.author,
            users: parsedBlock?.content
              ?.filter((content) => content.type === 'mention')
              ?.map((mention) => mention.id),
          })
          break
        case 'image':
          addContent('files', {
            id: blockId,
            type: 'image',
            url: parsedBlock.props.src || parsedBlock.props.url,
          })
          break
        default:
          parsedBlock?.content?.forEach((content) => {
            if (content.type === 'mention') {
              addContent('mentions', {
                id: blockId,
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
                user: content.id,
              })
            }
          })
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
}

function parseBlockGroup(block, addContent) {
  return block.content?.map((container) => parseContainer(container, addContent))
}

function getContentText(blocks) {
  return blocks.map(b => {
    return [
      getContentText(b.content || []).flat().join(' '),
      b.text,
      b.attrs?.label ? '@'+b.attrs?.label : '',
    ].filter(Boolean)
  })
}

function parseBNXmlToBlocks(data) {
  const content = {
    tasks: [],
    files: [],
    mentions: [],
  }
  const addContent = (type, data) => content[type].push(data)

  const blocks = data.content?.map((block) => parseBlockGroup(block, addContent))
  // const description = blocks
  //   ?.filter((block) => block && block.type !== 'task')
  //   ?.map((block) =>
  //     block?.content
  //       ?.map((content) => {
  //         if (!content) return ''
  //         switch (content.type) {
  //           case 'text':
  //           case 'mention':
  //             return content.text
  //           case 'link':
  //             return content.content.text
  //           default:
  //             return ''
  //         }
  //       })
  //       ?.join(''),
  //   )
  //   ?.filter((line) => line !== '')
  //   ?.slice(0, 3)
  const description =  data.content?.map((b) => getContentText(b.content).join('\n'))
  const text = description.join('\n')

  return { ...content, description, text }
}

export default parseBNXmlToBlocks
