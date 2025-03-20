'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs'; // Import useUser from Clerk
import NewsFeed from '@/components/news-feed';
import { DocumentData } from "firebase/firestore";
import getFireStoreDataToday from '../firebase/(hooks)/getFireStoreDataToday';
import { useNewsData } from '../firebase/useNewsData';
import { AddFireStoreData } from '../firebase/(hooks)/addFireStoreData';



export default function Page() {
  const { isSignedIn, user } = useUser(); // This will tell us if the user is signed in

  const [articles, setArticles] = useState<any>(null);
  const { news: articlesFromAPI, loading, error } = useNewsData();
  const { addData } = AddFireStoreData('news');
  const { data } = getFireStoreDataToday('news');


  
  // Use the useUser hook to track if the user is signed in

  useEffect(() => {
    // Only fetch news if the user is signed in
    if (!isSignedIn) {
      return; // Do not load news data if the user is not signed in
    }

    // Proceed with news data fetching logic
    if (data && data.length > 0) {
      // Process data from Firestore
      const processedData: any[] = [];
      data.forEach((item: any) => {
        if (item.data && Array.isArray(item.data)) {
          processedData.push(...item.data);
        }
      });
      if (processedData.length > 0) {
        setArticles(processedData);
        console.log("this is processed data");
      } else if (articlesFromAPI) {
        setArticles(articlesFromAPI);
        console.log("this is from articles data", articles);
      }
    } else if (articlesFromAPI) {
      // No Firestore data, use API data
      setArticles(articlesFromAPI);

      // Instead of passing articlesFromAPI directly, create a properly structured object
      const formattedData = {
        data: articlesFromAPI
      };

      // Add the data only if it hasn't been added yet
      setTimeout(() => {
        addData(formattedData); // Pass the properly structured object
     // Mark data as added
      }, 0);

      console.log("this is from api data", articlesFromAPI);
    }
  }, [isSignedIn, data, articlesFromAPI]); // Ensure it triggers when isSignedIn or isDataAdded changes

  // Handle loading and error states
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
        <div>Loading news...</div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the news feed only if articles is not null
  return (
    <div>
      {articles ? <NewsFeed articles={articles} /> : <div>No articles available</div>}
    </div>
  );
}
