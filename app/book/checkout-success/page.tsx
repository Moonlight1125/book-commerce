'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PurchaseSuccess = () => {
  const [bookId,setBookid] = useState<string>("");
  const params =useSearchParams();
  const sessionId = params.get("session_id")
  const savePruchaseHistory = async()=>{
    try{
      const req = await fetch('https://book-commerce-sandy.vercel.app/api/checkout/success',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          sessionId:sessionId,
        })
      })
      const res = await req.json();
      setBookid(res.bookId)
      console.log(res)
    }catch(err){
      console.log(err);
    }
  }
  useEffect(()=>{
    if(sessionId){
      savePruchaseHistory();
    }else{
      alert("既に購入しています。")
    }
  },[])
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          購入ありがとうございます！
        </h1>
        <p className="text-center text-gray-600">
          ご購入いただいた内容の詳細は、登録されたメールアドレスに送信されます。
        </p>
        <div className="mt-6 text-center">
          {bookId&&
            <Link
              href={`/book/${bookId}`}
              className="text-indigo-600 hover:text-indigo-800 transition duration-300"
            >
              購入した記事を読む
            </Link>}
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;