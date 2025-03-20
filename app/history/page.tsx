'use client'
import React from 'react'
import SidebarComponent from '@/components/sidebar'

export default function page() {
  return (

    <div className="flex w-full h-screen">
        <SidebarComponent activeTab="history" setActiveTab={() => {}} />
                <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 ml-24 p-4">
                <h1>History</h1>
                </main>
            </div>
      

  )
}