import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <div className=' w-full bg-black text-white flex justify-between px-4 py-2 h-16 items-center'>
        <h1>PrepApp</h1>
        <div className=' flex justify-between gap-8 items-center'>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Home</a>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
                <Link href='/sign-in'>Sign In</Link>
                <Link href='/sign-up'>Sign Up</Link>
            </SignedOut>
        </div>
    </div>
  )
}

export default Header