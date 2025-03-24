'use client'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestoreDb } from '../firebase';



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
    return {addData}
}
