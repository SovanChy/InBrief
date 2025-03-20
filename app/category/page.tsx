'use client'
import React from 'react'
import { GetFirestoreData } from '@/app/firebase/(hooks)/getFirestoreData'
import {
    Card,
    CardContent,
  
    CardHeader,
    CardTitle,
 } from "@/components/ui/card";
import SidebarComponent from '@/components/sidebar';

const Category = () => {
    const {data} = GetFirestoreData('category')
  return (
 <div className="flex w-full h-screen">
        <SidebarComponent activeTab="categories" setActiveTab={() => {}} />           
    <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 ml-24 p-4">
        <h1>Category</h1>
        {data && data.map((item: any) => (
            <div key={item.id}>
            <Card>
                <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <h1>Source:</h1>
                    <ul>
                        {item.source.map((src: string, index: number) => (
                            <li key={index}>{src}</li>
                        ))}
                    </ul>
                    <h1>Exclude Keywords:</h1>
                    <ul>
                        {item.excludeKeyword.map((keyword: string, index: number) => (
                            <li key={index}>{keyword}</li>
                        ))}
                    </ul>
                    <h1>Include Keywords:</h1>
                    <ul>
                        {item.includeKeyword.map((keyword: string, index: number) => (
                            <li key={index}>{keyword}</li>
                        ))}
                    </ul>
                </CardContent>
         </Card>
            </div>
        ))}
    </main>

    
    </div>
  )
}

export default Category