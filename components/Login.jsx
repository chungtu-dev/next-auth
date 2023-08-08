"use client"
import axios from 'axios';
import React, { useState } from 'react'

const Login = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
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

    const handleSubmit = (e) => {
        e.preventDefault()
        const res = axios.get(`/api/user`)
        .then((response) => console.log(response))
        const info = {
            ...user
        }
        console.log(info);
        return res
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    onChange={setData}
                    value={user.name}
                    name='name'
                    placeholder='name'
                />
                <input
                    type="text"
                    onChange={setData}
                    value={user.email}
                    name='email'
                    placeholder='email'
                />
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login