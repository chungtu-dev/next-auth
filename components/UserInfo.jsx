"use client"
import React, { useEffect, useState } from 'react'
import SignInButton from './SignInButton'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import useSWR from "swr";
import UpdateForm from './UpdateForm'
import moment from 'moment/moment'
import axios from 'axios'

const UserInfo = () => {
    const { status, data: session } = useSession()
    const [activeUpdate, setActiveUpdate] = useState(false)
    const [itemToUpdate, setItemToUpdate] = useState([])
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const author = session?.user?.name

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, mutate, error, isLoading } = useSWR(
        `/api/posts?username=${session?.user?.name}`,
        fetcher
    );

    const getPosts = async () => {
        const res = await axios.get(`/api/posts`).then((response) => (
            setPosts(response.data)
            // console.log(response.data)
        ))
        return res
    }

    useEffect(() => {
        getPosts()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = e.target[0].value;
        const content = e.target[1].value;
        setLoading(true)
        try {
            await fetch("/api/posts", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    content,
                    username: session?.user?.name
                }),
            });
            mutate()
            e.target.reset()
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log(err);
        }
    };

    const handleUpdate = (id) => {
        const handlerItemUpdate = data.filter((i) => i._id === id)
        setItemToUpdate(handlerItemUpdate)
        setActiveUpdate(true)
    }

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            })
            mutate()
        } catch (error) {
            console.log(error);
        }
    }

    if (status === 'authenticated') {
        return (
            <div className="flex flex-row justify-between w-full">

                <div>
                    <div className='flex flex-row'>
                        <h2 className="m-4 text-blue-400">Chuyện của Bạn và mấy khứa kia</h2>
                        <Image src="https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png" width={70} height={70} alt="troll-face" />
                    </div>
                    {
                        posts?.map((item) => (
                            <div key={item._id} className="flex flex-col m-4 p-3 bg-gray-100 rounded">
                                <ul>
                                    <li>
                                    <small>{item.username === author ? "Bạn: " : 'Khứa: '}</small>
                                        {item.username}
                                    </li>
                                    <li>
                                        <small>Nó đang nghĩ:</small> {item.title}
                                    </li>
                                    <li>
                                        <small>Chuyện là vầy:</small> {item.content}
                                    </li>
                                </ul>
                                <small>Đăng hồi: {item.updatedAt}</small>
                            </div>
                        ))
                    }
                </div>

                <div className="relative overflow-y-auto">
                    <div className='shadow-xl p-8 rounded-md flex flex-col gap-3 bg-yellow-200'>
                        <Image className='rounded-full' src={session?.user?.image} width={60} height={60} alt="user img" />
                        <div>
                            Name: <span className='font-bold'>{session?.user?.name}</span>
                        </div>
                        <div>
                            Email: <span className='font-bold'>{session?.user?.email}</span>
                        </div>
                    </div>

                    {
                        loading
                            ? "Loading..."
                            : <form onSubmit={handleSubmit} className='flex flex-col'>
                                <h1 className='text-center m-3 font-bold text-red-400'>Add New Post</h1>
                                <input className='border-none bg-slate-300 p-3 m-2' type="text" placeholder="Title" />
                                <input className='border-none bg-slate-300 p-3 m-2' type="text" placeholder="Content" />
                                <button className='bg-green-300 rounded p-3 mt-3 font-bold'>Send</button>
                            </form>
                    }
                    {
                        isLoading
                            ? "Loading Post(s)..."
                            : <div className='flex flex-col'>
                                <div className="absolute flex flex-col w-full">
                                    {
                                        data?.map((post) => (
                                            <div key={post._id} className='flex flex-col bg-gray-100 m-1 p-1 rounded'>
                                                <ul className="text-gray-400">
                                                    <li>Tiêu đề: <span className="text-gray-950">{post.title}</span></li>
                                                    <li>Nội dung: <span className="text-gray-950">{post.content}</span></li>
                                                    <li>Tác giả: <span className="text-gray-950">{post.username}</span></li>
                                                </ul>
                                                <small>{moment(post.updatedAt).format('HH:MM MMM DD,YYYY')}</small>
                                                <div className="flex flex-row bg-gray-200">
                                                    <button className='p-1 m-1' onClick={() => handleDelete(post._id)}>
                                                        <Image src='https://img.icons8.com/cotton/64/cancel--v4.png' width={30} height={30} alt="delete" />
                                                    </button>
                                                    <button className='p-1 m-1' onClick={() => handleUpdate(post._id)}>
                                                        <Image src='https://img.icons8.com/cotton/64/create-new--v3.png' width={30} height={30} alt="edit" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        activeUpdate &&
                                        <div className='m-1 bg-rose-200 rounded'>
                                            <div className='flex flex-row justify-end m-2'>
                                                <button className='m-1' onClick={() => setActiveUpdate(!activeUpdate)}>
                                                    <Image src='https://img.icons8.com/cotton/64/cancel-2--v2.png' width={30} height={30} alt="cancel" />
                                                </button>
                                            </div>
                                            {
                                                itemToUpdate?.map((item) => (
                                                    <UpdateForm item={item} key={item._id} />
                                                ))
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    } else {
        return (
            <SignInButton />
        )
    }
}

export default UserInfo