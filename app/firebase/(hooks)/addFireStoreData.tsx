'use client'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestoreDb } from '../firebase';
import { useAuth } from '@clerk/nextjs'



export const AddFireStoreData = (collectionName: string) => {
    const { userId } = useAuth();


    const addData = async (document: any) => {
        try{
            const createdAt = serverTimestamp()
            const docRef = await addDoc(collection(firestoreDb, collectionName), {
                // id: userId,
                createdAt: createdAt,
                ...document,
            });
            console.log("Document written with ID: ", docRef.id);
        }catch(err){
            console.log(err)
        }
    }
    return {addData}
}
