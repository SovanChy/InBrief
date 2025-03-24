'use client'
import React, { useEffect, useState } from 'react';
import CategoryFeed from '@/components/category-feed';
import { useParams } from "next/navigation";
import { Button } from '@/components/ui/button';
import { getFirestoreSnapshotByCategory } from '@/app/firebase/(hooks)/getFirestoreSnapshot';

export default function Page() {
    const params = useParams(); 
    const categoryId = params.id; 
    const categoryNewsId = String(categoryId) || '';
    const [articles, setArticles] = useState<any>(null);
    const { data } = getFirestoreSnapshotByCategory('categoryNews', categoryNewsId);
  
    useEffect(() => {
        console.log("Raw Firestore data:", data);
        
        if (data && data.length > 0) {
            let extractedArticles: any[] = [];
            data.forEach((doc: any) => {
                if (doc.articles && Array.isArray(doc.articles)) {
                    extractedArticles = [...extractedArticles, ...doc.articles];
                }
            });
            
            if (extractedArticles.length > 0) {
                setArticles(extractedArticles);
                console.log("Articles set successfully");
            } else {
                console.log("No articles found in the data structure");
            }
        }
    }, [data]);

    // Automatically reload  if articles are not loaded
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!articles) {
                window.location.href = `/category/${categoryId}`;
            }
        }, 3000); // 5-second delay before reload

        return () => clearTimeout(timer); // Cleanup the timer
    }, [articles, categoryId]);

    return (
        <div>
            {articles ? (
                <CategoryFeed articles={articles} />
            ) : (
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <div className="text-gray-700 mb-4">loading</div>
                </div>
            )}
        </div>
    );
}