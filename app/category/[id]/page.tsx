'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { DocumentData } from "firebase/firestore";
import getFireStoreDataToday from '../../firebase/(hooks)/getFireStoreDataToday';
import CategoryFeed from '@/components/category-feed';

import { Button } from '@/components/ui/button';

export default function Page() {
  const [articles, setArticles] = useState<any>(null);
  const { data } = getFireStoreDataToday('news');
  
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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="spinner"></div>
          <div>No news available</div>
          <Button onClick={() => window.location.href = '/newsfetch'} style={{ marginTop: '20px' }}>Try Fetching News</Button>
        </div>
      )}
    </div>
  );
}