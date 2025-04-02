'use client'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router
import { AddFireStoreData } from '../app/firebase/(hooks)/addFireStoreData';
import { firestoreDb } from '@/app/firebase/firebase';
import { getDocs,addDoc, getDoc, doc, updateDoc, setDoc, serverTimestamp, query, where, limit, collection } from 'firebase/firestore';
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
          const docRef = doc(firestoreDb, collectionName, "qxWoi5EEWe9y38CtA8gF")
          const docSnap = await getDoc(docRef)

          let existingArticles: any[] = [];

          if (docSnap.exists()){
            existingArticles = docSnap.data().articles || [];
          }

               //  Merge new articles at index 0, pushing older ones back
        const mergedArticles = [...newsData.articles, ...existingArticles];

        const  createdAt = serverTimestamp(); 
        const like = 0; 
        const readStatus = false; 

        if (docSnap.exists()) {
          // Update the existing document
          const updatedArticles = mergedArticles.map(article => ({
            ...article,
            like,
            readStatus,
            }));
          await updateDoc(docSnap.ref, { articles: updatedArticles, createdAt });
        } else {
          // Create a new document
            const updatedArticles = mergedArticles.map(article => ({
            ...article,
            like,
            readStatus,
            }));
            await setDoc(docSnap.ref, { articles: updatedArticles, createdAt });
        }

        console.log("News data stored successfully");
        hasStored.current = true;



         

          // await addData({ articles: newsData.articles});
          // console.log("News data stored successfully");
          
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
          const createdAt = serverTimestamp(); 
          const like = 0; 
          const readStatus = false; 

          const mergedArticles = newsData.articles.map((article: any) => ({
            ...article,
            like,
            readStatus
          }));
          // Store the news data
          await addData({ articles: mergedArticles, categoryNewsId, createdAt});
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


export const UpdateNewsDataCategory: React.FC<StoreNewsDataCategoryProps & { categoryNewsId?: string }> = ({ newsData, redirectTo, collectionName, categoryNewsId }) => {
  const hasStored = useRef(false);
  const router = useRouter();


  useEffect(() => {
    async function storeAndRedirect() {
      if (!newsData || hasStored.current || !categoryNewsId) return;
      try {
        const collectionRef = collection(firestoreDb, collectionName);
        const q = query(collectionRef, where("categoryNewsId", "==", categoryNewsId), limit(1)); // Get the latest document
        
        const querySnapshot = await getDocs(q);
        const docSnap = querySnapshot.docs[0]; // Get the first document if it exists

        let existingArticles: any[] = [];

        if (docSnap.exists()) {
          existingArticles = docSnap.data().articles || [];
        }
        
        const like = 0; 
        const readStatus = false; 
        const mergedArticles = newsData.articles.map((article: any) => ({
          ...article,
          like,
          readStatus
        }));

        //  Merge new articles at index 0, pushing older ones back
        const updatedArticles = [...mergedArticles, ...existingArticles];

      
        if (docSnap.exists()) {
          // Update the existing document
          await updateDoc(docSnap.ref, { articles: updatedArticles });
        } else {
          // Create a new document
          await addDoc(docSnap, { articles: updatedArticles, categoryNewsId });
        }

        console.log("News data stored successfully");
        hasStored.current = true;

        // 🔹 Redirect if a URL is provided
        if (redirectTo) {
          console.log(`Redirecting to ${redirectTo}`);
          router.push(redirectTo);
        }
      } catch (error) {
        console.error("Error storing news data:", error);
      }
    }

    storeAndRedirect();
  }, [newsData, redirectTo, router, categoryNewsId]);

  return null;
};