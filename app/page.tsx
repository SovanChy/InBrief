'use client';
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'


export default function Page() {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()
  
  // Routing Effect
  useEffect(() => {
    if (isLoaded) {
      if (!userId) {
        router.push('/home');
      } else {
        router.push('/news');
      }
    }
  }, [userId, isLoaded, router]);
  
  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }
  
  // This return is unlikely to be rendered due to redirects
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4 animate-pulse">Redirecting...</h1>
        <p className="text-lg text-white">Please wait while we take you to your destination.</p>
      </div>
    </div>
  );
}