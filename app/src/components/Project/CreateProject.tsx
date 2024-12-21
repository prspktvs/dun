import { useBreakpoint } from '../../hooks/useBreakpoint'
import CreateProjectMobile from './CreateProjectMobile'
import CreateProjectDesktop from './CreateProjectDesktop'

interface ICreateProjectProps {
  projectId: string
}

const CreateProject = (props: ICreateProjectProps) => {
  const { isMobile } = useBreakpoint()

  return isMobile ? <CreateProjectMobile {...props} /> : <CreateProjectDesktop {...props} />
}

export default CreateProject
