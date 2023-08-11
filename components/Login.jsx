"use client"
import { signIn } from 'next-auth/react';
import React, { useState } from 'react'

const Login = () => {
    const [user, setUser] = useState({
        name: '',
        password: '',
    })

    const setData = (e) => {
        const { name, value } = e.target
        setUser((preval) => {
            return {
                ...preval,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const status = await signIn('credentials', {
                redirect: false,
                name: user.name,
                password: user.password,
                callbackUrl: '/'
            })
            if (status.ok) {
                status.url
            }
            console.log(status);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col m-5 p-5">
                <input
                    type="text"
                    onChange={setData}
                    value={user.name}
                    name='name'
                    placeholder='Tên đăng nhập'
                    className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
                />
                <input
                    type="text"
                    onChange={setData}
                    value={user.password}
                    name='password'
                    placeholder='Mật khẩu'
                    className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
                />
                <button className='bg-emerald-700 p-2 rounded text-emerald-200 font-bold'>Đăng nhập</button>
            </form>
        </div>
    )
}

export default Login