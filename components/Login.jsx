"use client"
import { signIn } from 'next-auth/react';
import React, { useState } from 'react'
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        email: '',
        password: '',
    })
    // const [email, setEmail] = useState('a@gmail.com')
    // const [password, setPassword] = useState('111111')

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
                email: user.email,
                password: user.password
            })
            if (status.ok) {
                console.log('oke');
                status.url
                router.replace("/");
            }
            console.log(status);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <span className='text-center text-cyan-600 font-bold'>Đăng nhập bằng tài khoản</span>
            <form onSubmit={handleSubmit} className="flex flex-col m-3">
                <input
                    type="text"
                    onChange={setData}
                    value={user.email}
                    // onChange={(e) => setEmail(e.target.value)}
                    // value={email}
                    name='email'
                    placeholder='Tên đăng nhập'
                    className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
                />
                <input
                    type="text"
                    onChange={setData}
                    value={user.password}
                    // onChange={(e) => setPassword(e.target.value)}
                    // value={password}
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