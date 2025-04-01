'use client'
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router
import { AddFireStoreData } from '../app/firebase/(hooks)/addFireStoreData';
import { firestoreDb } from '@/app/firebase/firebase';
import { getDocs, getDoc, doc, updateDoc, setDoc, serverTimestamp, query, where, limit, collection } from 'firebase/firestore';
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

        const  createdAt = serverTimestamp()

        if (docSnap.exists()) {
          // Update the existing document
          await updateDoc(docSnap.ref, { articles: mergedArticles, createdAt });
        } else {
          // Create a new document
          await setDoc(docSnap.ref, { articles: mergedArticles, createdAt});
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

        //  Merge new articles at index 0, pushing older ones back
        const mergedArticles = [...newsData.articles, ...existingArticles];

        if (docSnap.exists()) {
          // Update the existing document
          await updateDoc(docSnap.ref, { articles: mergedArticles });
        } else {
          // Create a new document
          await setDoc(docSnap, { articles: mergedArticles, categoryNewsId });
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