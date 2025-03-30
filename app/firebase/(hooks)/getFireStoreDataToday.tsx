'use client'
import { useState, useEffect } from 'react';
import { firestoreDb } from '../firebase';
import { collection, getDocs, query, orderBy, addDoc,  limit, where, DocumentData} from 'firebase/firestore';



export default function getFireStoreDataToday(collectionName: string) {
  const [data, setData] = useState<{  docData: DocumentData } | null>(null); // Define the state structure
  const [id, setId] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = collection(firestoreDb, collectionName);
        const q = query(docRef, orderBy("createdAt", "desc"), limit(1)); // Get the latest document
        const docSnap = await getDocs(q);

        if (!docSnap.empty) {
          const doc = docSnap.docs[0]; // Get the first document from the query result
          const docId = doc.id; // 🔥 Get the document ID
          const docData = doc.data(); // 🔥 Get the document data

          console.log("Document ID:", docId);
          console.log("Document Data:", docData);

          // Set the state with the document ID and data
          setData({docData });
          setId(docId)
        } else {
          console.log("No document found.");
          setData(null); // If no document matches the query, set state to null
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null); // Set state to null on error
      }
    };

    fetchData();
  }, [collectionName]); // Re-run when collectionName changes

  return { data, id }; // Return the data state
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