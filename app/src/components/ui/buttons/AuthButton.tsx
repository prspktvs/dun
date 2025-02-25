interface AuthButtonProps {
  onClick: () => void
  children: React.ReactNode
  type?: 'button' | 'submit'
  icon?: React.ReactNode
  className?: string
}

export const AuthButton = ({
  onClick,
  children,
  type = 'button',
  icon,
  className = '',
}: AuthButtonProps) => {
  return (
    <div className='relative sm:row-start-5 h-14 w-full'>
      <div className='p-1'>
        <button
          type={type}
          onClick={onClick}
          className={`
              flex items-center justify-center w-full h-14 
              text-16 font-roboto px-4 py-2 border gap-[15px]
              ${className}
            `}
        >
          {icon}
          <span className='text-[#46434e]/80 text-[16px] font-medium'>{children}</span>
        </button>
      </div>
    </div>
  )
}
