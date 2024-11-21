import React from 'react'

import { LeftTab } from './LeftTab'
import { AuthForm } from './AuthForm'
import { VerificationView } from './VerificationView'
import { ForgotPasswordView } from './ForgotPasswordView'

// Типы для пропсов
interface IAuthTabsProps {
  tab: 'login' | 'signup' | 'verification' | 'forgot'
  setTab: React.Dispatch<React.SetStateAction<'login' | 'signup' | 'verification' | 'forgot'>>
}

export default function AuthTabs({ tab, setTab }: IAuthTabsProps) {
  // Главный компонент отвечает только за:
  // 1. Отображение правильного заголовка
  // 2. Выбор нужного компонента для текущего tab
  return (
    <div className='h-full'>
      <div className='flex h-full'>
        {/* Левая панель с приветствием */}
        <LeftTab isSignUp={tab === 'signup' || tab === 'verification'} setTab={setTab} />

        {/* Правая панель с формами */}
        <div className='flex-1 h-full border-l-1'>
          {/* Заголовок */}
          <div className='w-full h-[54px] flex items-center justify-center text-xl px-7 font-monospace sm:border-b divide-gray-border font-monaspace my-[40px] sm:my-0'>
            {tab === 'verification' && 'Email verification'}
            {tab === 'signup' && 'Create account'}
            {tab === 'forgot' && 'Forgot password'}
            {tab === 'login' && 'Log in'}
          </div>

          {/* Отображение нужной формы в зависимости от tab */}
          {tab === 'verification' && <VerificationView setTab={setTab} />}
          {tab === 'forgot' && <ForgotPasswordView setTab={setTab} />}
          {(tab === 'login' || tab === 'signup') && <AuthForm tab={tab} setTab={setTab} />}
        </div>
      </div>
    </div>
  )
}
