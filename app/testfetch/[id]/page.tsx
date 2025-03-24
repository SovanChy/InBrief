import React from 'react'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from "firebase-admin/firestore";

function initFirebase() {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '', 'base64').toString('utf-8')
    )
    initializeApp({
      credential: cert(serviceAccount)
    })
  }
  return { auth: getAuth(), db: getFirestore() };
}

interface CategoryPreference {
  id: string;
  categoryNewsId: string;
  name: string;
  includeKeyword: string[];
  excludeKeyword: string[];
  source: string[];
}

interface NewsArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export default async function Page({ params }: { params: { id: string } }) {
  const { db } = initFirebase();
  const categoryNewsId = params?.id;
  
  // Fetch data from Firestore
  const newsSnapshot = await db
    .collection("categoryPreferences")
    .where("categoryNewsId", "==", categoryNewsId)
    .get();
  
  const categoryPreferences: CategoryPreference[] = newsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<CategoryPreference, 'id'>),
  }));
  
  // If we have valid preferences, fetch news from NewsAPI
  let newsArticles: NewsArticle[] = [];
  
  if (categoryPreferences.length > 0) {
    const pref = categoryPreferences[0];
    
    // Build the query string for NewsAPI
    // 1. Positive keywords with OR between them
    const positiveKeywords = pref.includeKeyword.length > 0 
    ? pref.includeKeyword.join(" OR ") 
    : "";
  
  // Negative keywords should only have `-` before them, NOT `AND`
  const negativeKeywords = pref.excludeKeyword.length > 0 
    ? pref.excludeKeyword.map(kw => `-${kw}`).join(" ") 
    : "";
  
  // Combine positive and negative keywords
  let queryString = positiveKeywords.trim();
  
  if (positiveKeywords && negativeKeywords) {
    queryString += " "; // Ensure proper spacing
  }
  
  queryString += negativeKeywords;
    
    // 4. Format sources (if any)
    const sourcesParam = pref.source.length > 0 
      ? `sources=${pref.source.join(",")}` 
      : "";
    
    // Build the final URL for NewsAPI
    const apiKey = process.env.NEWS_API_KEY || "";
    // const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(queryString)}&sources=cnn,bbc-news&apiKey=${apiKey}`;
    const apiUrl = `https://newsapi.org/v2/top-headlines?${queryString}&${sourcesParam}&language=en&apiKey=${apiKey}`;

    console.log(apiUrl)
    
    try {
      // Fetch news articles
      const response = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Cache for 1 hour
      const data = await response.json();
      
      if (data.status === "ok") {
        newsArticles = data.articles;
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }
  
  return (
    <div key={categoryNewsId}>
      <h1>{categoryPreferences[0]?.name || "News Category"}</h1>
      
      <h2>Category Preferences</h2>
      {categoryPreferences.length > 0 && (
        <div>
          <p><strong>Included Keywords:</strong> {categoryPreferences[0].includeKeyword.join(", ") || "None"}</p>
          <p><strong>Excluded Keywords:</strong> {categoryPreferences[0].excludeKeyword.join(", ") || "None"}</p>
          <p><strong>Sources:</strong> {categoryPreferences[0].source.join(", ") || "All sources"}</p>
        </div>
      )}
      
      <h2>News Articles</h2>
      {newsArticles.length > 0 ? (
        <div className="news-grid">
          {newsArticles.map((article, index) => (
            <div key={`article-${index}`} className="news-card">
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} />
              )}
              <h3><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h3>
              <p>{article.description}</p>
              <div className="news-meta">
                <span>{article.source.name}</span> • <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No news articles found. Try adjusting your search preferences.</p>
      )}
    </div>
  );
}