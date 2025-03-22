// in GetFirestoreData.ts
import { collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestoreDb } from "../firebase";

export const getFirestoreSnapshot = (collectionName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading };
};