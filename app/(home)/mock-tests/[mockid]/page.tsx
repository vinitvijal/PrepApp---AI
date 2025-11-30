'use server';

import { getMockData } from "@/app/server/db";



export default async function Profile({
  params,
}: {
  params: Promise<{ mockid: string }>
}) {
  const { mockid } = await params
  const mockData = await getMockData(mockid);
  console.log(mockData)
  
    return <div>Profile Page of {mockid}</div>
}