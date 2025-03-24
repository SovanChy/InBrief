import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from "firebase-admin/firestore";
import { StoreNewsDataCategory } from '@/components/storenewsdata';


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

export default async function Page({ params }: { params: { id: string } }) {
  const { db } = initFirebase();
  const categoryNewsId = params?.id;
  const API_KEY = process.env.NEWS_API_KEY;
  let data: any = null;

  // Check if data already exists in Firestore
  const storedNewsSnapshot = await db
    .collection("categoryNews")
    .doc(categoryNewsId)
    .get();

  if (storedNewsSnapshot.exists) {
    // If data already exists, use it
    data = storedNewsSnapshot.data();
  } else {
    // Fetch category preferences from Firestore
    const newsSnapshot = await db
      .collection("categoryPreferences")
      .where("categoryNewsId", "==", categoryNewsId)
      .get();

    if (!newsSnapshot.empty) {
      const categoryPreferences: CategoryPreference[] = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<CategoryPreference, "id">),
      }));

      const pref = categoryPreferences[0];

      // Build the query string for NewsAPI
      const positiveKeywords = pref.includeKeyword.length > 0 ? pref.includeKeyword.join(" OR ") : "";
      const negativeKeywords = pref.excludeKeyword.length > 0 ? pref.excludeKeyword.map((kw) => `-${kw}`).join(" ") : "";
      let queryString = positiveKeywords;
      if (positiveKeywords && negativeKeywords) {
        queryString += " ";
      }
      queryString += negativeKeywords;

      const sourcesParam = pref.source.length > 0 ? `&sources=${pref.source.join(",")}` : "";

      const URL = `https://newsapi.org/v2/everything?q=${queryString}${sourcesParam}&language=en&apiKey=${API_KEY}`;
      const response = await fetch(URL);
      data = await response.json();

      // Store fetched data in Firestore
      await db.collection("categoryNews").doc(categoryNewsId).set(data);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <div className="text-gray-700 mb-4">Loading</div>
      <StoreNewsDataCategory 
        newsData={data} 
        collectionName="categoryNews" 
        categoryNewsId={categoryNewsId} 
        redirectTo={`/category/${categoryNewsId}`} 
      />
    </div>
  );
}
