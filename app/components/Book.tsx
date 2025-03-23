"use client";

import Image from "next/image";
import Link from "next/link";
import { contents } from "../lib/types/type";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

interface booktype{
  book:contents,
  isPurchased:boolean,
}


// eslint-disable-next-line react/display-name
const Book = ({book,isPurchased}:booktype) => {
  const [modal,setModal] = useState<boolean>(false);
  const router = useRouter();
  const {data:session,status} = useSession();
  const isLogin = !!session?.user;
  useEffect(()=>{
    if(modal){
        document.body.style.overflow='hidden'
       
    }else{
        document.body.style.overflow='auto'
    }
  },[modal])

  const startCheckOut  = async ()=>{
    try{
      const req = await fetch(`https://book-commerce-sandy.vercel.app/api/checkout`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          title: book.title,
          price: book.price,
          bookId: book.id,
          userId:session?.user?.id
        })
      })
      const res = await req.json();
      if(res){
        router.push(res.checkout_url);
      }
    }catch(err){
      console.log(err)
    }
  }
  //userIdに@uniqueをつけて、二回目でデータベースに保存できなくなるのは、userIdが重複して一意制約違反になったから。
  const openModal = ()=>{
    if(isPurchased){
      setModal(false);
      Swal.fire("既に購入済みです!");
    }else{
      setModal(true);
    }
  }

  const handlePurchase = ()=>{
    if(isLogin){
      startCheckOut(); 
    }else{
      setModal(false);
      router.push('/login')
    }
  }
  return (
    <>
      {/* アニメーションスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col items-center m-4">
        <a onClick={openModal} className="h-full cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none">
          <Image
            priority
            src={book.tthumbnail.url}
            alt={book.title}
            width={450}
            height={250}
            className="h-[250px] rounded-t-md object-cover"
          />
          <div className="px-4 py-4 bg-slate-100 rounded-b-md">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="mt-2 text-lg text-slate-600">この本は○○...</p>
            <p className="mt-2 text-md text-slate-700">値段：{book.price}円</p>
          </div>
        </a>
        {modal &&
          <div className="modal fixed w-screen left-0 top-0 bg-black/30 bg-opacity-25 flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-xl mb-4">本を購入しますか？</h3>
              <button onClick={handlePurchase} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                購入する
              </button>
              <button onClick={() => setModal(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                キャンセル
              </button>
            </div>
          </div>
          }
      </div>
    </>
  );
};

export default Book;