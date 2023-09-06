import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

const Regist = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
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

    const handleSubmitRegist = async (e) => {
        e.preventDefault()
        try {
            const info = {
                ...user,
            }
            const res = await axios.post(`/api/user`, info)
                .then((response) => console.log(response))
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Đăng kí User thành công',
                showConfirmButton: false,
                timer: 1500
            })
            return res
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <span className='text-center text-cyan-600 font-bold'>Đăng kí tài khoản</span>
            <form onSubmit={handleSubmitRegist} className="flex flex-col m-5">
                <input className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" onChange={setData} value={user.name} name='name' id='name' placeholder='Tên' />

                <input className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" onChange={setData} value={user.email} name='email' placeholder='Email' />

                <input className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" onChange={setData} value={user.password} name='password' placeholder='Mật khẩu' />

                <button className='bg-cyan-900 p-2 rounded text-cyan-200 font-bold' type="submit">Đăng kí</button>
            </form>
        </div>
    )
}

export default Regist