import axios from 'axios'
import React, { useState } from 'react'

const Regist = () => {
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

    const handleSubmitRegist = async (e) => {
        e.preventDefault()
        try {
            const info = {
                ...user,
            }
            const res = await axios.post(`/api/user`,info)
            .then((response) => console.log(response))
            console.log('regist ok');
            return res
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmitRegist}>
                <input type="text" onChange={setData} value={user.name} name='name' placeholder='Name' />
                <input type="text" onChange={setData} value={user.email} name='email' placeholder='Email' />
                <button type="submit">Regist</button>
            </form>
        </div>
    )
}

export default Regist