"use client"
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

const UpdateForm = ({ item }) => {
    const [newTitle, setNewTitle] = useState("")
    const [newContent, setNewContent] = useState("")
    // console.log(item);

    const handleSubmitUpdate = async (e) => {
        e.preventDefault()
        try {
            const newPost = {
                ...item,
                title: newTitle ? newTitle : item.title,
                content: newContent ? newContent : item.content,
            }
            await axios.put(`/api/posts/${item._id}`, newPost);
            Swal.fire({
                title: 'Đang cập nhật',
                text: 'Bấm dùm cái nút CÊ cái ní',
                imageUrl: 'https://www.icegif.com/wp-content/uploads/2023/02/icegif-519.gif',
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image',
                confirmButtonText: "CÊ"
            }).then((res) => {
                if (res.isConfirmed) {
                    Swal.fire(
                        'Gòi',
                        'Chờ xíu nghen ní',
                        'success'
                    )
                    location.reload()
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmitUpdate} className="flex flex-col justify-center m-1">
                <input type="text" onChange={(e) => setNewTitle(e.target.value)} value={newTitle} placeholder={item.title} className='m-1 p-1' />
                <input type="text" onChange={(e) => setNewContent(e.target.value)} value={newContent} placeholder={item.content} className='m-1 p-1' />
                <button type="submit" className="flex justify-center">
                    <Image src='https://img.icons8.com/cotton/64/save.png' width={30} height={30} alt="save" />
                </button>
            </form>
        </div>
    )
}

export default UpdateForm