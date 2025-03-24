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
  collectionName: string;
}

interface StoreNewsDataCategoryProps {
  newsData: {
    articles: Array<any>;
    [key: string]: any;  // Allow for other properties in newsData
  };
  redirectTo?: string;  // Make the redirect optional
  collectionName: string;
}



export const StoreNewsData: React.FC<StoreNewsDataProps> = ({ newsData, redirectTo, collectionName }) => {
  const { addData } = AddFireStoreData(collectionName);
  const hasStored = useRef(false);
  const router = useRouter(); // Initialize the router
  
  useEffect(() => {
    async function storeAndRedirect() {
      if (newsData && !hasStored.current) {
        try {
          // Store the news data
          await addData({ articles: newsData.articles});
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

export const StoreNewsDataCategory: React.FC<StoreNewsDataCategoryProps & { categoryNewsId?: string }> = ({ newsData, redirectTo, collectionName, categoryNewsId }) => {
  const { addData } = AddFireStoreData(collectionName);
  const hasStored = useRef(false);
  const router = useRouter(); // Initialize the router
  
  useEffect(() => {
    async function storeAndRedirect() {
      if (newsData && !hasStored.current) {
        try {
          // Store the news data
          await addData({ articles: newsData.articles, categoryNewsId});
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
  }, [newsData, redirectTo, router, categoryNewsId]);
  
  // This component doesn't render anything visible
  return null;
}