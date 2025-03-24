import { createClient } from 'microcms-js-sdk';
import { contents } from '../types/type';

export const client = createClient({
  serviceDomain:'fullstack',
  apiKey:'z2N3W2KSLismhpUJejDorhBQo2V1ESCymURQ',
});

export default async function getAllBooks(){
  const data = await client.getList<contents>({
    endpoint:'bookcommerce',
    customRequestInit:{
      next:{
        revalidate:3600,
      }
    },
  })
  return data;
}

export const getDetailBooks = async(contentId:string)=>{
  const data = await client.getListDetail<contents>({
    endpoint:'bookcommerce',
    contentId,
    customRequestInit:{
      cache:'no-store',
    },
  })
  return data;
}