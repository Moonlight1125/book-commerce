import { SessionProvider } from "next-auth/react";
import Book from "./components/Book";
import getAllBooks from "./lib/microCMS/client";
import { contents, purchase } from "./lib/types/type";
import { auth } from "@/auth";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  const {contents} = await getAllBooks();
  const session = await auth();

  let isPurchased:string[] = [];

  if(session?.user){
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchase/${session?.user?.id}`)
    .then((res)=>res.json());
    const purchasedId = req.map((res:purchase)=>res.bookId)
    isPurchased=purchasedId;
  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-stretch md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {contents.map((book:contents) => (
          <SessionProvider key={book.id}>
            <Book book={book} isPurchased={isPurchased.includes(book.id)}/>
          </SessionProvider>
        ))}
      </main>
    </>
  );
}