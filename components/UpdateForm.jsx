"use client"
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

const UpdateForm = ({ item }) => {
    const [newTitle, setNewTitle] = useState("")
    const [newContent, setNewContent] = useState("")

    const [attachment, setAttachment] = useState("");
    const [selectedImage, setSelectedImage] = useState();
    // console.log(item);

    /* #region choose image */
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setAttachment(base64);

        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage();
        setAttachment()
    };
    /* #endregion */

    /* #region handle Update */
    const handleSubmitUpdate = async (e) => {
        e.preventDefault()
        try {
            const newPost = {
                ...item,
                title: newTitle ? newTitle : item.title,
                content: newContent ? newContent : item.content,
                image: attachment ? attachment : item.image
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
    /* #endregion */

    return (
        <div className="flex flex-col align-center">
            <h3 className="font-bold text-sky-700">Cập nhật nội dung mới</h3>
            <form onSubmit={handleSubmitUpdate} className="flex flex-col justify-center m-1">
                <input type="text" onChange={(e) => setNewTitle(e.target.value)} value={newTitle} placeholder={item.title} className='m-1 p-1' />
                <input type="text" onChange={(e) => setNewContent(e.target.value)} value={newContent} placeholder={item.content} className='m-1 p-1' />

                <div className="w-2/4 h-full">
                    <img src={item.image} alt="img post to update" />
                </div>

                <div className="p-5 m-5">
                    <h3>Chọn ảnh mới</h3>
                    <input
                        className='absolute'
                        id='inpfile'
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            uploadImage(e);
                        }}
                    />
                    {
                        attachment && (
                            <div>
                                <img src={attachment} className='absolute hidden' alt="profile-img" />
                                {selectedImage && (
                                    <div>
                                        <img className="rounded shadow-xl"
                                            src={URL.createObjectURL(selectedImage)}
                                            alt="Thumb"
                                        />
                                        <button className='p-2 mt-2 bg-red-500' onClick={removeSelectedImage}>
                                            Xóa ảnh
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>

                <button type="submit" className="flex justify-center mt-4">
                    <Image src='https://img.icons8.com/cotton/64/save.png' width={30} height={30} alt="save" />
                </button>
            </form>
        </div>
    )
}

export default UpdateForm