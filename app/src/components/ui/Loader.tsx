import { Loader as MantineLoader } from '@mantine/core'

export const Loader = () => (
  <div className='h-full w-full flex justify-center items-center'>
    <MantineLoader type='dots' color='#8279BD' />
  </div>
)
