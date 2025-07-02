import { Popover, Select } from '@mantine/core'

import { TaskPriority, TaskStatus } from '../../../../types/Task.d.ts'

export function TaskToolbar({
  anchorEl,
  status,
  priority,
  onStatusChange,
  onPriorityChange,
  opened,
}: {
  anchorEl: HTMLElement | null
  status: TaskStatus
  priority: TaskPriority
  onStatusChange: (status: TaskStatus) => void
  onPriorityChange: (priority: TaskPriority) => void
  opened: boolean
}) {
  if (!anchorEl) return null

  return (
    <Popover opened={opened} target={anchorEl} position='top' withArrow withinPortal shadow='md'>
      <div>TEST-TOOL</div>
      <Select
        label='Status'
        data={Object.values(TaskStatus)}
        value={status}
        onChange={onStatusChange}
        mb='sm'
      />
      <Select
        label='Priority'
        data={Object.values(TaskPriority)}
        value={priority}
        onChange={onPriorityChange}
      />
    </Popover>
  )
}
