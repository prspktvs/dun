import { Menu, ActionIcon, Badge, Text, ScrollArea, Button, Group, Divider } from '@mantine/core'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'

import { useNotifications, INotification } from '../../context/NotificationContext'

function NotificationItem({ notification }: { notification: INotification }) {
  const { markAsRead, deleteNotification } = useNotifications()
  const navigate = useNavigate()

  const handleClick = async () => {
    if (!notification.isRead) {
      await markAsRead(notification.id)
    }

    if (notification.projectId && notification.cardId) {
      navigate(`/${notification.projectId}/cards/${notification.cardId}`)
    } else if (notification.projectId) {
      navigate(`/${notification.projectId}`)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteNotification(notification.id)
  }

  const formatTime = (dateString: string) => {
    try {
      if (!dateString) return 'Recently'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Recently'
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  return (
    <div
      className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 ${
        notification.isRead ? 'border-gray-200' : 'border-blue-500'
      }`}
      onClick={handleClick}
    >
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <Text size='sm' fw={notification.isRead ? 400 : 600}>
            {notification.title || 'Notification'}
          </Text>
          <Text size='xs' color='dimmed' className='mt-1'>
            {notification.message || 'No message'}
          </Text>
          <Text size='xs' color='dimmed' className='mt-2'>
            {formatTime(notification.createdAt)}
          </Text>
        </div>
        <ActionIcon size='sm' variant='light' color='red' onClick={handleDelete} className='ml-2'>
          <i className='ri-close-line' />
        </ActionIcon>
      </div>
    </div>
  )
}

export default function NotificationBell() {
  const { notifications, unreadCount, loading, markAllAsRead, fetchNotifications } =
    useNotifications()

  const handleMarkAllRead = async () => {
    await markAllAsRead()
  }

  const handleRefresh = () => {
    fetchNotifications()
  }

  return (
    <Menu shadow='md' width={400} position='bottom-end'>
      <Menu.Target>
        <ActionIcon variant='subtle' size='lg' className='relative'>
          <i className='ri-notification-3-line text-lg' />
          {unreadCount > 0 && (
            <Badge
              size='xs'
              variant='filled'
              color='red'
              className='absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center'
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown className='p-0'>
        <div className='p-4 bg-gray-50 border-b'>
          <Group justify='space-between'>
            <Text size='sm' fw={600}>
              Notifications
            </Text>
            <Group gap='xs'>
              <ActionIcon variant='subtle' size='sm' onClick={handleRefresh} loading={loading}>
                <i className='ri-refresh-line' />
              </ActionIcon>
              {unreadCount > 0 && (
                <Button variant='subtle' size='xs' onClick={handleMarkAllRead}>
                  Mark all read
                </Button>
              )}
            </Group>
          </Group>
        </div>

        <ScrollArea h={400}>
          {notifications.length === 0 ? (
            <div className='p-4 text-center'>
              <Text size='sm' color='dimmed'>
                No notifications yet
              </Text>
            </div>
          ) : (
            <div>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <NotificationItem notification={notification} />
                  {index < notifications.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  )
}
