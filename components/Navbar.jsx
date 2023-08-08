"use client"
import Link from 'next/link'
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

const Navbar = () => {
    const { status } = useSession()
    return (
        <div className='p-4 flex justify-between items-center shadow-md'>
            <Link className='font-bold text-lg text-blue-700' href={'/'}>Next Auth</Link>
            {
                status === 'authenticated' ? (
                    <button onClick={() => signOut()} className='bg-slate-900 text-white px-6 py-2 rounded-md'>Đăng xuất</button>
                ) : (
                    <button onClick={() => signIn('google')} className='bg-slate-900 text-white px-6 py-2 rounded-md'>Đăng nhập</button>
                )
            }
        </div>
    )
}

export default Navbar