import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name:"Credentials",
            async authorize(credentials, req){
                await connectMongoDB()

                //check user existance
                const userResult = await User.findOne({email: credentials.email, name: credentials.name})
                if(!userResult){
                    console.log("No user found!");
                }

                //compare password
                const checkPassword = await compare(credentials.password, userResult.password)

                //incorrect password
                if(!checkPassword || userResult.email !== credentials.email){
                    console.log("Username or Password not match");
                }

                return userResult
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                const { name, email } = user;
                try {
                    await connectMongoDB();
                    const userExists = await User.findOne({ email });

                    if (!userExists) {
                        const res = await fetch("http://localhost:3000/api/user", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name,
                                email,
                            }),
                        });

                        if (res.ok) {
                            return user;
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            return user;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };