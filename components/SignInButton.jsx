"use client"
import Image from 'next/image'
import React from 'react'
import { signIn } from 'next-auth/react'

const SignInButton = () => {
    return (
        <button onClick={() => signIn('google')} className='flex items-center gap-4 shadow-xl rounded-lg'>
            <Image width={50} height={50} alt="Google icon" src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" />
            <span className="bg-blue-500 text-white px-4 py-3">Sign In With Google</span>
        </button>
    )
}

export default SignInButton