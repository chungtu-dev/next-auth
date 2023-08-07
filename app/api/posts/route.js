import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const newPost = new Post(data)
        await connectMongoDB()
        await newPost.save();
        return new NextResponse("POST has been created successfully", { status: 200 })
    } catch (error) {
        return new NextResponse("Error POST status", { status: 500 })
    }
}

export const GET = async (req, res) => {
    try {
        const url = new URL(req.url)
        const username = url.searchParams.get('username')
        await connectMongoDB()
        const posts = await Post.find(username && { username })
        return new NextResponse(JSON.stringify(posts), { status: 200 })
    } catch (error) {
        return new NextResponse("Error GET post(s)", { status: 500 })
    }
}