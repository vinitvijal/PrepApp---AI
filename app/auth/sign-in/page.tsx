'use client'
import { signIn } from '@/app/server/auth'
import React, { useState } from 'react'

function page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignIn = async () => {
        console.log({ email, password })
        await signIn(email, password)
    }




    return (
        <div>
            <h1>Sign In Page</h1>
            <p>This is the sign in page.</p>
            <input type="text" placeholder='Enter your email' className='border border-gray-300 rounded-md p-2 w-full mb-4' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Enter your password' className='border border-gray-300 rounded-md p-2 w-full mb-4' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='bg-blue-500 text-white rounded-md p-2 w-full' onClick={handleSignIn}>Sign In</button>
    </div>
  )
}

export default page
