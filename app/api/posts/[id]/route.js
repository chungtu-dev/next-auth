import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export const GET = async (req, res, { params }) => {
    try {
        const { id } = params
        await connectMongoDB()
        const post = await Post.findById(id)
        return new NextResponse(JSON.stringify(post), { status: 200 })
    } catch (error) {
        return new NextResponse("Error GET Post", { error: 500 });
    }
}

export const PUT = async (req, { params }) => {
    const { id } = params;
    const {title, content, image } = await req.json();
    try {
        await connectMongoDB()
        const postToUpdate = await Post.findByIdAndUpdate(
            id,
            { title, content, image },
            { new: true }
        )
        return new NextResponse(JSON.stringify(postToUpdate), { status: 200 })
    } catch (error) {
        return new NextResponse("Error UPDATE Post", { error: 500 });
    }
}

export const DELETE = async (req, { params }) => {
    const { id } = params
    try {
        await connectMongoDB()
        await Post.findByIdAndDelete(id)
        return new NextResponse("Post has been deleted successfully", { status: 200 })
    } catch (error) {
        return new NextResponse("Error DELETE Post", { error: 500 });
    }
}