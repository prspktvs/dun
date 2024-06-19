import { Tabs, Button, Textarea, TagsInput, em } from '@mantine/core'
import { useState } from 'react'
import Logo from '../../components/ui/Logo'
import { AppleLogo, GoogleLogo, HideIcon } from '../icons'
import clsx from 'clsx'

const CreateProject = () => {
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const toggleForm = () => {
    setIsSignUp(!isSignUp)
  }

  const handleContinue = () => {
    if (isSignUp && email && name && password) {
      setLoggedIn(true)
    } else if (!isSignUp && email && password) {
      setLoggedIn(true)
    }
  }

  return (
    <div className='h-screen w-screen grid grid-cols-8 grid-rows-4 divide-x-[1px] divide-y-[2px]'>
      <div />
      <div className='col-span-3' />
      <div className='col-span-3' />
      <div />
      <div className='row-span-2' />
      <div className='row-span-2' />
      <div />
      <div className='col-span-3' />
      <div className='col-span-3' />
      <div />
      <div />
      <div />
      <div />
      <div />

      <Tabs
        className='col-start-2 row-start-2 col-end-8 row-end-4 '
        color='gray'
        defaultValue='first'
        value={isSignUp ? 'signup' : 'login'}
      >
        <div className='w-full bg-[#EDEBF3] h-[55px] flex items-center pl-7 border-b-2 divide-gray-border'>
          <Logo />
        </div>
        <div className='flex h-fit'>
          <div className='flex flex-col flex-1 font-monaspace text-lg'>
            <div className='ml-8 mt-5'>
              <div>Hey there!</div>
              <div className='w-[400px] mt-6 h-[30px]'>
                {isSignUp
                  ? 'Awesome to have you here. Let’s get you signed up so the fun can begin. Ready?'
                  : 'Welcome back! Please log in to continue.'}
              </div>
              <div className='flex mt-40 font-medium'>
                <div>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</div>
                <div className='ml-5 text-[#8279BD] cursor-pointer' onClick={toggleForm}>
                  {isSignUp ? 'Log in' : 'Sign up'}
                </div>
              </div>
            </div>
          </div>
          <div className='flex-1  border-l-2 h-full'>
            <div className='w-full h-[65px] flex items-center text-xl pl-7 font-monospace border-b-2 divide-gray-border font-monaspace'>
              {loggedIn ? 'Email verification' : isSignUp ? 'Sign up' : 'Log in'}
            </div>
            {/* <Tabs.List grow>
          <Tabs.Tab value='first'>1</Tabs.Tab>
          <Tabs.Tab value='second'>2</Tabs.Tab>
        </Tabs.List> */}

        {/* <Tabs.Panel ba value='first' className='w-[600px] h-[300px] '> */}
        <Tabs.Panel value='first'>
          {/* <input
            className='block align-middle text-xl font-monaspace border-none w-full placeholder-slate-400 text-[#47444F]'
            placeholder='Type new project title'
            value={title}
            name='title'
            // onChange={(e) => setTitle(e.target.value)}
            onChange={handleInputChange}
          /> */}

          {/* <textarea
            className='block resize-none align-middle text-xl font-monaspace border-none w-full placeholder-slate-400 text-[#47444F]'
            placeholder='Type new project title'
            value={title}
            name='title'
            // onChange={(e) => setTitle(e.target.value)}
            onChange={handleInputChange}
          ></textarea> */}

          {/* <textarea
            className='resize-none mt-6 text-sm font-monaspace border-none w-full h-[188px] placeholder-slate-400 text-[#47444F] leading-tight'
            placeholder='Description'
            value={description}
            name='description'
            // onChange={(e) => setDescription(e.target.value)}
            onChange={handleInputChange}
          ></textarea> */}
          {/* <Button
            className=' font-monaspace font-thin text-[#A3A1A7] h-12'
            fullWidth
            radius={0}
            variant='filled'
            color='#343434'
            onClick={onCreate}
            disabled={isTitleEmpty}
          >
            Create
          </Button> */}
        </Tabs.Panel>

        {/* <Tabs.Panel value='second' className='w-[600px] h-[300px]'>
          <TagsInput
            className='font-monaspace mt-5'
            label='Add tags'
            value={tags}
            onChange={setTags}
            placeholder='Enter tag'
          />

          <Button
            className='mt-10 font-thin font-monaspace'
            fullWidth
            radius={0}
            variant='filled'
            color='#464646'
            onClick={onCreate}
          
          >
            Dun
          </Button>
        </Tabs.Panel> */}

            {loggedIn ? (
              <>
                <div className='flex flex-col justify-center items-center p-6  font-monaspace text-xs'>
                  <div className='w-full h-full'>
                    We sent an email to <span className='text-[#8379BD]'>{email}</span> to verify.
                  </div>
                  <div className='w-full mt-1'>
                    Please click on the "Verify email" button to continue.
                  </div>
                  <div className='mt-9'>
                    <p className='font-semibold mb-3'> Not seeing the email? </p>
                    <p>
                      Please check your spam folder, resend email or contact us at dun@gmail.co.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='flex border-b-2 font-monaspace'>
                  <div>
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className='ml-7 my-2 outline-none'
                      placeholder='Email'
                      type='email'
                    />
                  </div>
                  {isSignUp && (
                    <div className='border-l-2'>
                      <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className='ml-7 my-2 outline-none'
                        placeholder='Name'
                      />
                    </div>
                  )}
                </div>
                <div className='flex items-center'>
                  <input
                    className='ml-7 my-3 outline-none w-full font-monaspace'
                    placeholder='Password'
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <div className='mr-12 flex items-center'>
                    <HideIcon />
                  </div>
                </div>
              </>
            )}

            <div className='p-1 border-t-2 divide-gray-border'>
              <button
                onClick={handleContinue}
                className='h-[35px] w-full bg-[#8279BD] text-white font-monaspace'
              >
                {loggedIn ? `DUN` : isSignUp ? 'Continue' : 'Log in'}
              </button>
            </div>
            {loggedIn ? (
              ''
            ) : (
              <>
                <div className='flex w-full items-center justify-center border-t-2 divide-gray-border '>
                  or
                </div>
                <div className='flex justify-center gap-x-3 mb-4 font-medium text-[#47444F] my-5'>
                  <button className='flex px-4 py-2 border bg-white justify-center items-center gap-x-2 '>
                    <GoogleLogo />
                    Continue with Google
                  </button>
                  <button className='px-4 bg-white border flex justify-center items-center gap-x-2'>
                    <AppleLogo />
                    Continue with Apple
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}

export default CreateProject
