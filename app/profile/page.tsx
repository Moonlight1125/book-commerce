import { auth } from "@/auth";
import Image from "next/image";
import { contents, purchase } from "../lib/types/type";
import { getDetailBooks } from "../lib/microCMS/client";
import PurchaseProduct from "../components/PurchaseProduct";


export default async function ProfilePage() {
    const session = await auth();
    let purchasedBooks: contents[] = [];

    if (session?.user) {
        const req = await fetch(`https://book-commerce-sandy.vercel.app/api/purchase/${session?.user?.id}`)
            .then((res) => res.json());
        const books = await Promise.all(req.map(async (purchase: purchase) => {
            return await getDetailBooks(purchase.bookId);
        }))
        purchasedBooks = books;
    }
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">プロフィール</h1>

            <div className="bg-white shadow-md rounded p-4">
                <div className="flex items-center">
                    <Image
                        priority
                        src={session?.user?.image || "/default_icon.png"}
                        alt="user profile_icon"
                        width={60}
                        height={60}
                        className="rounded-t-md"
                    />
                    <h2 className="text-lg ml-4 font-semibold">お名前:{session?.user?.name}</h2>
                </div>
            </div>

            <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
            <div className="flex gap-6 items-stretch">                   
            {
                purchasedBooks?.map((book:contents) => (
                    <PurchaseProduct key={book.id} book={book}/>
                ))
            }
            </div>
        </div>
    );
}