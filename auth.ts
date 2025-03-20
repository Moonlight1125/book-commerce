import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter"
import  prisma from "./app/lib/prisma"

export const config:NextAuthConfig = {
    providers:[GitHub({
        clientId:process.env.GITHUB_ID,
        clientSecret:process.env.GITHUB_SECRET,
    })],
    callbacks:{
      session:({session,user})=>{
        return{
            ...session,
            user:{
                ...session.user,
                id:user.id,
            }
        }
        },
    },
    adapter: PrismaAdapter(prisma), 
    secret:process.env.AUTH_SECRET,
    basePath:"/api/auth",
    // pages:{
    //     signIn:"/login"
    // }
}

export const  {handlers,auth,signIn,signOut} = NextAuth(config);
