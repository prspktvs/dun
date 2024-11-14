import { notifications } from '@mantine/notifications'

export const notifySuccess = (message: string) => {
  return notifications.show({
    message,
    autoClose: 5000,
    color: 'green',
  })
}

export const notifyError = (message: string) => {
  return notifications.show({
    message,
    autoClose: 5000,
    color: 'red',
  })
}