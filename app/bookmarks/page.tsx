'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { getFireStoreDataBookMarkToday } from '../firebase/(hooks)/getFirestoreSnapshot';
import { useAuth } from '@clerk/nextjs';
import BookmarkFeed from '@/components/bookmark-feed';



export default function page() {
  const {userId} = useAuth();
  const clerkId = userId || '';
  const [articles, setArticles] = useState<any[]>([]); // Initialize as empty array
  const { data, loading, error } = getFireStoreDataBookMarkToday('bookmarks', clerkId);
  console.log("Bookmark data:", data);
  console.log("userId:", clerkId);

   useEffect(() => {
          console.log("Raw Firestore data:", data);
      
          // Ensure that data exists and is properly structured (with docData and articles)
          if (data && data.docData) {
            let extractedArticles: any[] = [];
      
            // Check if docData has the articles array
            if (data.docData.articles && Array.isArray(data.docData.articles)) {
              extractedArticles = [...extractedArticles, ...data.docData.articles];
            }
      
            console.log("Extracted articles:", extractedArticles);
      
            if (extractedArticles.length > 0) {
              setArticles(extractedArticles); // Set the extracted articles
              console.log("Articles set successfully", extractedArticles);
            } else {
              console.log("No articles found in the data structure");
            }
          }
        }, [data]);
    
   
  return (
    <div>
       {loading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <div className="text-gray-700 mb-4">Loading</div>        
          </div>
       ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-red-500">{error}</p>
        </div>
       ) : (
        <BookmarkFeed articles={articles} id={clerkId} />
        // <p>testing</p>
     
  )}
  </div>
)}
