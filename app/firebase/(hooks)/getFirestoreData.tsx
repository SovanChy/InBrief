'use client'
import { useEffect, useState } from 'react'
import { firestoreDb } from '../firebase'
import { collection, getDocs, DocumentData } from "firebase/firestore";

export function GetFirestoreData(collectionName: string) {
  const [data, setData] = useState<DocumentData | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = collection(firestoreDb, collectionName)
        const docSnap = await getDocs(docRef);
        
        const documentsData: DocumentData[] = [];
        docSnap.forEach((doc) => {
          documentsData.push({...doc.data(), id: doc.id});
        });
        console.log('Documents data:', documentsData);
        setData(documentsData);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [collectionName]);

  return { data };
}