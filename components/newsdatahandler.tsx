// app/components/NewsDataHandler.tsx
'use client'

import { useEffect } from 'react'
import { AddFireStoreData } from "../app/firebase/(hooks)/addFireStoreData";

export default function NewsDataHandler({ newsData }: { newsData: any }) {
 
  const { addData } = AddFireStoreData('news')
  
  useEffect(() => {
    const handleAddData = async () => {
      const doc = {
        data: newsData
      }
      
      try {
        await addData(doc)
        alert('Data added successfully')
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
    
    handleAddData()
  }, [newsData, addData])
  
  // This component doesn't need to render anything
  return null
}