'use client'
import React, { useEffect, useState } from 'react';
import getFireStoreDataToday from '../../firebase/(hooks)/getFireStoreDataToday';
import CategoryFeed from '@/components/category-feed';

import { Button } from '@/components/ui/button';

export default function Page() {
  const [articles, setArticles] = useState<any>(null);
  const { data } = getFireStoreDataToday('categoryNews');
  
  useEffect(() => {
    console.log("Raw Firestore data:", data);
    
    if (data && data.length > 0) {
      // Extract articles from the data structure
      let extractedArticles: any[] = [];
      
      // Loop through each document
      data.forEach((doc: any) => {
        // Check if it has the articles array
        if (doc.articles && Array.isArray(doc.articles)) {
          extractedArticles = [...extractedArticles, ...doc.articles];
        }
      });
      
      console.log("Extracted articles:", extractedArticles);
      
      if (extractedArticles.length > 0) {
        setArticles(extractedArticles);
        console.log("Articles set successfully");
      } else {
        console.log("No articles found in the data structure");
      }
    }
  }, [data]);

  return (
    <div>
      {articles ? (
        <CategoryFeed articles={articles} />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <div className="text-gray-700 mb-4">loading</div>
          <Button className="mt-4 border border-blue-500 bg-white text-blue-600 hover:bg-blue-50 relative z-10" onClick={() => window.location.href = '/newsfetchcategory'} style={{ marginTop: '20px' }}>Reload News</Button>
        </div>
      )}
    </div>
  );
}