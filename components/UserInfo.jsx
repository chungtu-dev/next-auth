"use client"
import React, { useEffect, useState } from 'react'
import SignInButton from './SignInButton'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import useSWR from "swr";
import UpdateForm from './UpdateForm'
import moment from 'moment/moment'
import axios from 'axios'
import Regist from './Regist'
import Login from './Login'
import Swal from 'sweetalert2'

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
        try {
            const res = await axios.get(`/api/posts`).then((response) => (
                setPosts(response.data)
                // console.log(response.data)
            ))
            return res
        } catch (error) {
            console.log(error);
        }
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
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Đăng bài thành gòi nhe!!',
                showConfirmButton: false,
                timer: 1500
            })
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
        setActiveUpdate(false)
        try {
            Swal.fire({
                title: 'Chắc chưa?',
                text: "Xóa nghen!!!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Hoy',
                confirmButtonText: 'Ừa! xóa mịe đi'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Dồi ok',
                        'Xóa òi nghen',
                        'success'
                    )
                    const res = fetch(`/api/posts/${id}`, {
                        method: "DELETE",
                    })
                    mutate()
                    return res
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    if (status === 'authenticated') {
        return (
            <div className="flex flex-row justify-between w-full absolute pt-20 m-30">

                <div className='w-3/5'>
                    <div className='flex flex-row justify-center m-2'>
                        <h2 className="m-4 text-blue-400 font-bold">Chuyện của Bạn và mấy khứa kia</h2>
                        <Image src="https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png" width={70} height={70} alt="troll-face" />
                    </div>
                    {
                        loading
                            ? "Chờ xíu"
                            : <>
                                {
                                    posts?.map((item) => (
                                        <div key={item._id} className={item.username === author ? "flex flex-col m-4 p-3 bg-lime-200 rounded" : "flex flex-col m-4 p-3 bg-emerald-100 rounded"}>
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
                            </>
                    }
                </div>

                <div className="relative overflow-y-auto w-2/5 m-10">
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
                                <h1 className='text-center m-3 font-bold text-red-400'>Bạn đang nghĩ gì...</h1>
                                <input className='border-solid border-2 border-sky-500 bg-slate-200 p-3 m-2 rounded' type="text" placeholder="Ngắn gọn" />
                                <input className='border-solid border-2 border-sky-500 bg-slate-200 p-3 m-2 rounded' type="text" placeholder="Nghĩ gì đừng ngại" />
                                <button className='bg-teal-600 text-white rounded p-3 mt-3 font-bold'>Đăng bài</button>
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
            <>
                <SignInButton />
                {/* <Regist />
                <Login/> */}
            </>
        )
    }
}

export default UserInfo