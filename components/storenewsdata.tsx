'use client'
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router
import { AddFireStoreData } from '../app/firebase/(hooks)/addFireStoreData';

interface StoreNewsDataProps {
  newsData: {
    articles: Array<any>;
    [key: string]: any;  // Allow for other properties in newsData
  };
  redirectTo?: string;  // Make the redirect optional
}

export default function StoreNewsData({ newsData , redirectTo }: StoreNewsDataProps) {
  const { addData } = AddFireStoreData('news');
  const hasStored = useRef(false);
  const router = useRouter(); // Initialize the router
  
  useEffect(() => {
    async function storeAndRedirect() {
      if (newsData && !hasStored.current) {
        try {
          // Store the news data
          await addData({ articles: newsData.articles });
          console.log("News data stored successfully");
          hasStored.current = true;
          
          // Redirect to the news page
          if (redirectTo) {
            console.log(`Redirecting to ${redirectTo}`);
            router.push(redirectTo);
          }
        } catch (error) {
          console.error("Error storing news data:", error);
        }
      }
    }
    
    storeAndRedirect();
  }, [newsData, redirectTo, router]);
  
  // This component doesn't render anything visible
  return null;
}