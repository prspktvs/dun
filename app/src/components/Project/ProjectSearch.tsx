import React, { useState } from 'react'
import { Popover, Loader, Text, Stack, Box } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'

import { useSearch } from '../ui/Search'
import { ICard } from '../../types/Card'
import SearchBar from './SearchBar'
import { LinkIcon } from '../icons'

interface SearchBarProps {
  search: string
  setSearch: (value: string) => void
}

type SearchResultCard = ICard & { highlights?: { title?: string; content?: string } }

const formatHighlightedText = (text: string) => {
  return text.replace(/<mark>/g, '<span class="font-bold">').replace(/<\/mark>/g, '</span>')
}

const SearchResult = ({ card, onSelect }: { card: SearchResultCard; onSelect: () => void }) => {
  const { id: projectId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div
      className='grid grid-cols-7 justify-between items-center p-2 cursor-pointer'
      onClick={() => {
        navigate(`/${projectId}/cards/${card.id}`)
        onSelect() // Call onSelect when clicking a result
      }}
    >
      <Text size='md' fw={500} className='col-span-2 text-btnBg'>
        {card.highlights?.title ? (
          <span
            dangerouslySetInnerHTML={{
              __html: formatHighlightedText(card.highlights.title),
            }}
          />
        ) : (
          card.title || 'Untitled'
        )}
      </Text>
      {card.highlights?.content && (
        <Text size='xs' color='dimmed' lineClamp={2} className='col-span-4'>
          <span
            dangerouslySetInnerHTML={{
              __html: formatHighlightedText(card.highlights.content),
            }}
          />
        </Text>
      )}
      <div className='flex justify-end'>
        <LinkIcon />
      </div>
    </div>
  )
}

const ProjectSearch: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  const { id: projectId } = useParams<{ id: string }>()
  const { results, loading } = useSearch(search, projectId!)
  const [opened, setOpened] = useState(false)

  const handleResultSelect = () => {
    setOpened(false)
    setSearch('') // Optionally clear the search input
  }

  return (
    <Popover
      width='target'
      position='bottom'
      shadow='md'
      opened={search.length > 0 && opened}
      onChange={setOpened}
      withinPortal={true}
    >
      <Popover.Target>
        <div
          className={clsx(
            'relative flex items-center w-full  h-14',
            search.length > 0 && 'border-1 border-black',
          )}
        >
          <SearchBar
            search={search}
            setSearch={(value) => {
              setSearch(value)
              setOpened(true) // Open dropdown when typing
            }}
          />
        </div>
      </Popover.Target>

      <Popover.Dropdown className='rounded-none border-1 border-black bg-[#edebf3]'>
        <Stack>
          {loading ? (
            <Box p='md' style={{ display: 'flex', justifyContent: 'center' }}>
              <Loader size='sm' />
            </Box>
          ) : results.length > 0 ? (
            results.map((card) => (
              <SearchResult key={card.id} card={card} onSelect={handleResultSelect} />
            ))
          ) : (
            <Text color='dimmed' size='sm' p='md'>
              No results found
            </Text>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default ProjectSearch
