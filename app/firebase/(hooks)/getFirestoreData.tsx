'use client'
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { doc, getDoc, DocumentData } from "firebase/firestore";

export function GetFirestoreData(collection: string) {
  const [data, setData] = useState<DocumentData | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, collection, "test1");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const documentData = docSnap.data();
          console.log('Document data:', documentData);
          setData(documentData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [collection]);

  return { data };
}