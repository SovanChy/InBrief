'use client'
import { useState, useEffect } from 'react';
import { firestoreDb } from '../firebase';
import { collection, onSnapshot, getDocs, doc, query, orderBy, addDoc,  limit, where, DocumentData} from 'firebase/firestore';

// Original function without category filtering
export const getFirestoreSnapshot = (collectionName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestoreDb, collectionName),
      (snapshot) => {
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(fetchedData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        setError((error as Error).message)

      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
};


export const getFireStoreDataToday = (collectionName: string) => {
  const [data, setData] = useState<{ docData: DocumentData } | null>(null); // Define the state structure
  const [id, setId] = useState('');
  
  useEffect(() => {
    const docRef = collection(firestoreDb, collectionName);
    const q = query(docRef, orderBy("createdAt", "desc"), limit(1)); // Get the latest document

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]; // Get the first document from the query result
        const docId = doc.id; // Get the document ID
        const docData = doc.data(); // Get the document data

        console.log("Document ID:", docId);
        console.log("Document Data:", docData);

        // Set the state with the document ID and data
        setData({ docData });
        setId(docId);
      } else {
        console.log("No document found.");
        setData(null); // If no document matches the query, set state to null
      }
    }, (error) => {
      console.error("Error fetching data:", error);
      setData(null); // Set state to null on error
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName]); // Re-run when collectionName changes

  return { data, id }; // Return the data state
};


export const getFireStoreDataCategory = (collectionName: string, categoryNewsId: string) => {
  const [data, setData] = useState<{ docData: DocumentData } | null>(null); // Define the state structure
  const [id, setId] = useState('');

  useEffect(() => {
    const docRef = collection(firestoreDb, collectionName);
    const q = query(docRef, where("categoryNewsId", "==", categoryNewsId), limit(1)); // Query with real-time updates

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]; // Get the first document from the query result
        const docId = doc.id; // Get the document ID
        const docData = doc.data(); // Get the document data

        console.log("Document ID:", docId);
        console.log("Document Data:", docData);

        // Set the state with the document ID and data
        setData({ docData });
        setId(docId);
      } else {
        console.log("No document found.");
        setData(null); // If no document matches the query, set state to null
      }
    }, (error) => {
      console.error("Error fetching data:", error);
      setData(null); // Set state to null on error
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, categoryNewsId]); // Re-run when collectionName or categoryNewsId changes

  return { data, id }; // Return the data state
};
  

export const getFireStoreDataBookMarkToday = (collectionName: string, uid?: string) => {
  const [data, setData] = useState<{ docData: DocumentData } | null>(null); // Define the state structure
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const docRef = collection(firestoreDb, collectionName);
    const q = query(docRef, orderBy("createdAt", "asc"), where("uid", "==", uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]; // Get the first document from the query result
          const docId = doc.id; // Get the document ID
          const docData = doc.data(); // Get the document data
  
          console.log("Document ID:", docId);
          console.log("Document Data:", docData);
  
          // Set the state with the document ID and data
          setData({ docData });
        }
        setLoading(false);
        setError(null);
      }, 
      (error) => {
        console.error("Error fetching data:", error);
        setData(null);
        setLoading(false);
        setError(error.message); 
      }
    );

    return () => unsubscribe();
  }, [collectionName, uid]);

  return { data, loading, error };
};