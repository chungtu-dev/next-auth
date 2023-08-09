"use client"
import Link from 'next/link'
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

const Navbar = () => {
    const { status } = useSession()
    return (
        <div className='p-2 m-2 rounded flex justify-between items-center' style={{backgroundColor:'rgb(139 172 225 / 49%)'}}>
            <Link className='font-bold text-lg text-blue-700' href={'/'}>
                <Image src="https://www.icegif.com/wp-content/uploads/2023/04/icegif-1428.gif" width={100} height={100} alt="logo duck"/>
            </Link>
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