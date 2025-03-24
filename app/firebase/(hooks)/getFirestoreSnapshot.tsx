import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestoreDb } from "../firebase";

// Original function without category filtering
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

// New function with category filtering
export const getFirestoreSnapshotByCategory = (collectionName: string, categoryNewsId: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a query to filter documents where category field equals categoryId
    const q = query(
      collection(firestoreDb, collectionName),
      where("categoryNewsId", "==", categoryNewsId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(fetchedData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data by category:", error);
        setLoading(false);
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [collectionName, categoryNewsId]);

  return { data, loading };
};
