import { Loader as MantineLoader } from '@mantine/core'

export const Loader = ({ color = '#8279BD' }: { color?: string }) => (
  <div className='h-full w-full flex justify-center items-center'>
    <MantineLoader type='dots' color={color} />
  </div>
)
