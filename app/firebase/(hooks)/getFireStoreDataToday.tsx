'use client'
import { useState, useEffect } from 'react';
import { firestoreDb } from '../firebase';
import { collection, getDocs, query, orderBy, addDoc,  limit, where, DocumentData} from 'firebase/firestore';



export default function getFireStoreDataToday(collectionName: string) {
  const [data, setData] = useState<DocumentData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
    try{
        const docRef = collection(firestoreDb, collectionName)
        const q = query(docRef, orderBy('createdAt', 'desc'), limit(20));
        const docSnap = await getDocs(q);
        const documentsData: DocumentData[] = [];
        docSnap.forEach((doc) => {
          documentsData.push({...doc.data(), id: doc.id});
        });
        console.log('Documents data:', documentsData);
        setData(documentsData);

    }catch(error){
        console.error("Error fetching document:", error);
    }

    }
    fetchData();
  }, [collectionName]);

  return { data };

}
  



// Function to fetch data from Firebase, ordered by timestamp, filtered for today
const fetchDataFromFirebase = async () => {
    // const todayTimestamp = getTodayTimestamp(); // Get today's timestamp
    
    const newsRef = collection(firestoreDb, "news");
    const q = query(
      newsRef,
      // where('timestamp', '>=', todayTimestamp), // Only articles from today
      orderBy('timestamp', 'desc'),
      limit(20) // Limit to the latest 20 articles from today
    );
  
    const querySnapshot = await getDocs(q);
    let newsData: any[] = [];
  
    querySnapshot.forEach((doc) => {
      newsData.push(doc.data());
    });
  
  
    return newsData;
  };