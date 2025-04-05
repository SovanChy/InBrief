'use client'
import { collection, addDoc,arrayUnion,  serverTimestamp, doc, setDoc, deleteDoc, updateDoc, query, where, getDocs, getDoc} from "firebase/firestore";
import { firestoreDb } from '../firebase';
import { DocumentData } from "firebase/firestore";



export const AddFireStoreData = (collectionName: string) => {


    const addData = async (document: any) => {
        try{
            const createdAt = serverTimestamp()
            const docRef = await addDoc(collection(firestoreDb, collectionName), {
                createdAt: createdAt,
                ...document,
            });
            console.log("Document written with ID: ", docRef.id);
        }catch(err){
            console.log(err)
        }
    }


    const addReadSpeedData = async (document: any, id:string) => {
      try{
          const createdAt = serverTimestamp()
          const docRef = await setDoc(doc(firestoreDb, collectionName, id), {
              createdAt: createdAt,
              ...document,
          });
      }catch(err){
          console.log(err)
      }
  }

    const addDataBookMark = async (document: any, id: string) => {
      try {
      const createdAt = serverTimestamp();
      const docRef = doc(firestoreDb, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const updatedArticles = [document, ...(currentData.articles || [])]; // Add new document at index 0
        await setDoc(docRef, {
        articles: updatedArticles,
        createdAt: createdAt,
        uid: id,
        }, { merge: true });
      } else {
        await setDoc(docRef, {
        articles: [document], // Initialize with the new document
        createdAt: createdAt,
        uid: id,
        });
      }
      } catch (err) {
      console.log(err);
      }
    };

    const deleteDataBookMark = async (index: number, id: string) => {
      try {
        const docRef = doc(firestoreDb, collectionName, id);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const currentData = docSnap.data();
          const updatedArticles = [...currentData.articles]; // Create a copy
          updatedArticles.splice(index, 1); // Remove at index
    
          await updateDoc(docRef, {
            articles: updatedArticles // Replace the entire array
          });
        } else {
        }
      } catch (err) {
        console.error("Error removing bookmark:", err);
        alert("Failed to unbookmark");
      }
    };


    const deleteData = async (id: string) => {
        try{
            await deleteDoc(doc(firestoreDb, collectionName, id));

        } catch(err){
            console.log(err)
        }
    }

   // Function to delete documents from both collections with identical categoryNewsId
// Function to delete documents from both collections with identical categoryNewsId
const deleteDataWithCategoryNewsId = async (categoryNewsId: string) => {
    // References to the two collections
    const collection1Ref = collection(firestoreDb, "categoryPreferences"); // Replace with your first collection name
    const collection2Ref = collection(firestoreDb, "categoryNews"); // Replace with your second collection name
  
    try {
      // Query for documents in both collections where categoryNewsId matches
      const query1 = query(collection1Ref, where("categoryNewsId", "==", categoryNewsId));
      const query2 = query(collection2Ref, where("categoryNewsId", "==", categoryNewsId));
  
      // Get documents from the first collection
      const querySnapshot1 = await getDocs(query1);
      if (!querySnapshot1.empty) {
        querySnapshot1.forEach(async (docSnapshot) => {
          const docRef = doc(firestoreDb, "categoryPreferences", docSnapshot.id);
          await deleteDoc(docRef);  // Delete the document from the first collection
          console.log(`Document from collection1 with ID: ${docSnapshot.id} deleted`);
        });
      } else {
        console.log("No documents found in collection1 with the given categoryNewsId.");
      }
  
      // Get documents from the second collection
      const querySnapshot2 = await getDocs(query2);
      if (!querySnapshot2.empty) {
        querySnapshot2.forEach(async (docSnapshot) => {
          const docRef = doc(firestoreDb, "categoryNews", docSnapshot.id);
          await deleteDoc(docRef);  // Delete the document from the second collection
          console.log(`Document from collection2 with ID: ${docSnapshot.id} deleted`);
        });
      } else {
        console.log("No documents found in collection2 with the given categoryNewsId.");
      }
  
    } catch (error) {
      console.error("Error deleting documents: ", error);
    }
  };

  const updateData = async (docId: string, updatedData: Partial<DocumentData>) => {
    try {
      // Get the current document to retain unchanged values
      const docRef = doc(firestoreDb, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        
        // Create a new object with existing data
        const mergedData = { ...existingData };
        
        // Iterate through the keys in updatedData
        for (const [key, value] of Object.entries(updatedData)) {
          // If the value is null or undefined, remove the field
          if (value === null || value === undefined) {
            delete mergedData[key];
          } else {
            // Otherwise, update or add the field
            mergedData[key] = value;
          }
        }
        
        // Always add updatedAt timestamp
        mergedData.updatedAt = serverTimestamp();
        
        await updateDoc(docRef, mergedData);
        return { success: true, docId };
      } else {
        throw new Error("Document does not exist");
      }
    } catch (err) {
      console.error("Error updating document:", err);
      return { success: false, error: err };
    }
  };
  





    return {addData, addReadSpeedData, deleteData, deleteDataWithCategoryNewsId, updateData, addDataBookMark, deleteDataBookMark}


    
}
