// GETではPOSTのようにbodyを送信できないから

import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server";

export const GET = async(req:Request,{params}:{params:{userid:string}})=>{
    const {userid} = await params;
    if(!userid){
        return NextResponse.json({error:'fetch failed'});
    }
    const data = await prisma.purchase.findMany({
        where:{
            userId:userid,
        }
    })
    return NextResponse.json(data);
}