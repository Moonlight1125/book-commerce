 export interface contents{
    content:string,
    createdAt:string,
    id:string,
    price:string,
    publishedAt:string,
    revisedAt:string,
    title:string,
    tthumbnail:{url:string,width:number,height:number},
    updatedAt:string,
  }

  export interface purchase{
    id:string,
    userId:string,
    bookId:string,
    createdAt:string,
  }
  

  export interface Session{
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
    expires?: string
  }
