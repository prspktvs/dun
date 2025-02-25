const isPropertyExist = (marks, prop) => Boolean(marks?.find((mark) => mark.type === prop))

function parseMention(content) {
  const id = content.attrs.id
  const name = content.attrs.label
  return { type: 'mention', text: '@' + name, id, styles: {} }
}

function parseText(content) {
  const marks = content.marks
  const links = marks?.filter((mark) => mark.type === 'link')
  const textColor = marks?.find((mark) => mark.type === 'textColor')?.attrs?.color || 'default'
  const bold = isPropertyExist(marks, 'bold')
  const italic = isPropertyExist(marks, 'italic')
  const underline = isPropertyExist(marks, 'underline')
  const strike = isPropertyExist(marks, 'strike')

  const isLinksExist = links && links.length > 0

  return {
    type: isLinksExist ? 'link' : 'text',
    text: content?.text,
    styles: {
      textColor,
      bold,
      italic,
      underline,
      strike,
    },
    ...(isLinksExist && { href: links[0].attrs.href }),
  }
}

function parseContent(content) {
  switch (content.type) {
    case 'mention':
      return parseMention(content)
    case 'text':
      return parseText(content)
    default:
      return {}
  }
}

function parseBlock(block) {
  const type = block.type
  const props = block.attrs
  const content = block?.content?.map(parseContent) ?? []

  return { type, props, content }
}

function handleTaskBlock(parsedBlock, blockId, addContent) {
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
          case 'link':
            return content.text
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
}

function handleFileBlock(parsedBlock, blockId, addContent, type) {
  addContent('files', {
    id: blockId,
    type,
    url: parsedBlock.props.src || parsedBlock.props.url,
  })
}

function handleDefaultBlock(parsedBlock, blockId, addContent) {
  parsedBlock?.content?.forEach((content) => {
    if (content?.type === 'mention') {
      addContent('mentions', {
        id: blockId,
        text: parsedBlock?.content
          ?.map((content) => {
            switch (content?.type) {
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
    } else if (content?.type === 'link') {
      addContent('files', {
        id: blockId,
        type: 'link',
        url: content.href,
      })
    }
  })
}

function parseContainer(container, addContent) {
  const blockId = container.attrs.id
  const blockBackground = container.attrs.backgroundColor
  const blockTextColor = container.attrs.textColor
  const innerBlocks = container.content?.filter((block) => block.type === 'blockGroup')
  const innerContent = innerBlocks?.flatMap((block) => parseBlockGroup(block, addContent))

  const block = container.content
    ?.filter((block) => block.type !== 'blockGroup')
    ?.map((block) => {
      const parsedBlock = parseBlock(block)
      console.log(parsedBlock)
      switch (parsedBlock.type) {
        case 'task':
          handleTaskBlock(parsedBlock, blockId, addContent)
          break
        case 'file':
        case 'audio':
        case 'video':
        case 'image':
          handleFileBlock(parsedBlock, blockId, addContent, parsedBlock.type)
          break
        default:
          handleDefaultBlock(parsedBlock, blockId, addContent)
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

  return { block, innerContent }
}

function parseBlockGroup(block, addContent) {
  return block.content?.map((container) => parseContainer(container, addContent))
}

function extractContentText(block) {
  const content = Array.isArray(block) ? block[0]?.content : block.content
  return content
    ?.map((contentItem) => {
      if (!contentItem) return ''
      switch (contentItem.type) {
        case 'text':
        case 'mention':
        case 'link':
          return contentItem.text
        default:
          return ''
      }
    })
    ?.join('')
}

function formatBlockText(block) {
  const contentText = extractContentText(block)
  switch (block?.type) {
    case 'bulletListItem':
      return `• ${contentText}`
    case 'numberedListItem':
      return `${block.props.index}. ${contentText}`
    default:
      return contentText
  }
}

function extractDescriptionAndSearchText(blocks) {
  const flattedBlocks = blocks?.flatMap(({ block, innerContent }) => [
    ...(block || []),
    ...innerContent.flatMap(({ block }) => block),
  ])

  const descriptionBlocks = flattedBlocks?.filter((block) =>
    Array.isArray(block) ? block[0]?.type !== 'task' : block.type !== 'task',
  )

  const description = descriptionBlocks
    ?.map(formatBlockText)
    ?.filter((line) => line !== '')
    ?.slice(0, 5)

  const searchText = flattedBlocks?.map(formatBlockText)

  return {
    description,
    searchText,
  }
}

function parseBNXmlToBlocks(data, cardId) {
  const content = {
    tasks: [],
    files: [],
    mentions: [],
  }
  const addContent = (type, data) => {
    const blockId = data.id
    data.id = `${cardId}_${blockId}`
    content[type].push(data)
  }

  const blocks = data.content?.map((block) => parseBlockGroup(block, addContent))
  const { description, searchText } = extractDescriptionAndSearchText(blocks[0])
  const text = searchText.filter((line) => Boolean(line)).join('\n') || ''

  return { ...content, description, text }
}

export default parseBNXmlToBlocks
