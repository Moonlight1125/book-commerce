import { NextResponse } from "next/server";
import prisma from '@/app/lib/prisma'
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
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
        return NextResponse.json(err);
    }
}