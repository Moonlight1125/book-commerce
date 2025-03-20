import { NextResponse } from "next/server";
import prisma from '@/app/lib/prisma'
import Stripe from "stripe";

const stripe = new Stripe('sk_test_51R3SxbLUnc6ePoMLdmqN9tUGOwbs92t4FpX3FCtTqvHSV3kOYtKkCjacbkfKFApHT1uhTB0ErekuHxE3hF90LTvE00M2hwpR8u');
export const POST = async(req:Request)=>{
    const {sessionId} = await req.json();
    if(!sessionId){
        return NextResponse.json({error:'sessionId is missing'});
    }
    try{
        const sesion = await stripe.checkout.sessions.retrieve(sessionId);

        const existingPurchse = await prisma.purchase.findFirst({
            where:{
                userId:sesion.client_reference_id!,
                bookId:sesion.metadata?.bookId!,
            }
        })
        if(!existingPurchse){
            const purchaseHistory = await prisma.purchase.create({
                data:{
                    userId:sesion.client_reference_id!,
                    bookId:sesion.metadata?.bookId!,
                }
            })
            return NextResponse.json(purchaseHistory);
        }else{
            return NextResponse.json({messaage:"既に購入済みです。"});
        }
    }catch(err){
        return NextResponse.json({error:err});
    }
}