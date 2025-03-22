import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
            success_url:`${process.env.NEXT_PUBLIC_HOME_URL}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.NEXT_PUBLIC_HOME_URL}}`,
        });
        return NextResponse.json({checkout_url:session.url});
    } catch(err:any){
        return NextResponse.json({error:err.message});
    }
}