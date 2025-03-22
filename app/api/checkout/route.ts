import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe('sk_test_51R3SxbLUnc6ePoMLdmqN9tUGOwbs92t4FpX3FCtTqvHSV3kOYtKkCjacbkfKFApHT1uhTB0ErekuHxE3hF90LTvE00M2hwpR8u');

export const POST = async (req:Request) => {
    const { title, price ,bookId,userId} = await req.json();
    if (!title || !price || !bookId || !userId) {
        return NextResponse.json({ error: "error:we need more info" });
    }
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            metadata:{
                bookId:bookId,
            },
            client_reference_id:userId,
            line_items: [
                {
                    price_data: {
                        currency: 'jpy',
                        product_data: {
                            name: title
                        },
                        unit_amount: price,
                    },
                    quantity:1,
                },
            ],
            mode:'payment',
            success_url:`https://book-commerce-sandy.vercel.app/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`https://book-commerce-sandy.vercel.app`,
        });
        return NextResponse.json({checkout_url:session.url});
    } catch(err:any){
        return NextResponse.json({error:err.message});
    }
}