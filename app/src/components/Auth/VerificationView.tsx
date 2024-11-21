import React from 'react'

interface VerificationViewProps {
  setTab: (tab: 'login' | 'signup' | 'verification' | 'forgot') => void
}

export function VerificationView({ setTab }: VerificationViewProps) {
  return (
    <>
      {/* Информационное сообщение */}
      <div className='flex flex-col items-center justify-center p-6 text-xs font-monaspace'>
        <div className='w-full h-full'>We sent an email to verify your account.</div>
        <div className='w-full mt-1'>Please click on the "Verify email" button to continue.</div>

        {/* Дополнительная информация */}
        <div className='mt-9'>
          <p className='mb-3 font-semibold'>Not seeing the email?</p>
          <p>Please check your spam folder or contact us at support@example.com</p>
        </div>
      </div>

      {/* Кнопка возврата */}
      <div className='p-1 border-t-1'>
        <button
          onClick={() => setTab('login')}
          className='h-[35px] w-full bg-[#8279BD] text-white font-monaspace'
        >
          Back to login
        </button>
      </div>
    </>
  )
}
