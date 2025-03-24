import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = async () => {
  const session = await auth();
  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-bold">
          Book Commerce
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホーム
          </Link>
          {
            session?.user ?
              <form
                action={async()=>{
                  'use server'
                  await signOut({redirectTo:'/login'});
                }}
              >
                <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                ログアウト
                </button>
              </form> :
              <Link
                href='/login'
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                ログイン
              </Link>
          }

          <Link href={session?.user?`/profile`:''}>
            <Image
              width={50}
              height={50}
              className="rounded-[50%]"
              alt="profile_icon"
              src={session?.user?.image||"/BADHOP_.jpg"}
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;