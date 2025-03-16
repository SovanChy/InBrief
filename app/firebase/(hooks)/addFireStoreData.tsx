'use client'
import {doc, setDoc} from "firebase/firestore";
import { db, timestamp} from '../firebase';
import { useAuth } from '@clerk/nextjs'



export const AddFireStoreData = (collection: string) => {
    const { userId } = useAuth();


    const addData = async (document: any) => {
        try{
            const createdAt = timestamp.fromDate(new Date())
            const docRef = await setDoc(doc(db, collection), {
                ...document,
                id: userId,
                createdAt: createdAt
            });
            console.log("Document written with ID: ", docRef);
        }catch(err){
            console.log(err)
        }
    }
    return {addData}
}
