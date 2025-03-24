import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { StoreNewsDataCategory } from "@/components/storenewsdata";

function initFirebase() {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(
      Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "",
        "base64"
      ).toString("utf-8")
    );

    initializeApp({
      credential: cert(serviceAccount),
    });
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
  const API_KEY = process.env.NEWS_API_KEY || "";
  let data: any = null;
let loading = true;  // Add a loading state
let error = null;    // Add an error state

// Check if data already exists in Firestore
const storedNewsSnapshot = await db
  .collection("categoryNews")
  .where("categoryNewsId", "==", categoryNewsId)
  .get();

if (!storedNewsSnapshot.empty) {
  // If data already exists, use it
  data = storedNewsSnapshot.docs.map(doc => doc.data());
  loading = false;  // No need to fetch from API
} else {
  // Fetch category preferences from Firestore
  const newsSnapshot = await db
    .collection("categoryPreferences")
    .where("categoryNewsId", "==", categoryNewsId)
    .get();

  if (!newsSnapshot.empty) {
    const categoryPreferences: CategoryPreference[] = newsSnapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<CategoryPreference, "id">),
      })
    );

    if (categoryPreferences.length > 0) {
      const pref = categoryPreferences[0];

      // Build the query string for NewsAPI
      let queryString = "";
      const positiveKeywords = pref.includeKeyword.length > 0 ? pref.includeKeyword.join(" OR ") : "the";
      const negativeKeywords = pref.excludeKeyword
        .map((kw) => `-${kw}`)
        .join(" ");

      if (positiveKeywords || negativeKeywords) {
        queryString = `&q=${[positiveKeywords, negativeKeywords]
          .filter((kw) => kw.trim() !== "")
          .join(" ")}`;
      }

      const sourcesParam = 
        pref.source.length > 0 ? `&sources=${pref.source.join(",")}` : "";

      const URL = `https://newsapi.org/v2/everything?language=en${queryString}${sourcesParam}&apiKey=${API_KEY}`;

      try {
        const response = await fetch(URL);
        const result = await response.json();

        if (result.status === "ok" && result.articles.length > 0) {
          data = result;
          loading = false;  // Set loading to false once data is fetched
        } else {
          error = "No articles found with the current keywords or sources. Please try adjusting your search parameters.";
          loading = false;
        }
      } catch (fetchError) {
        error = "Error fetching data from NewsAPI. Please check your network connection or try using different keywords or sources.";
        loading = false;  // Set loading to false to avoid continuous fetching
      }
    }
  }
}

// Now handle the component's rendering logic based on the loading state, data, and error state
return (
  <div className="flex flex-col justify-center items-center h-screen">
    {loading ? (
      <>
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <div className="text-gray-700 mb-4">Loading...</div>
      </>
    ) : error ? (
      <div className="text-red-500 mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 mb-2">Oops! Something went wrong.</p>
          <p className="text-sm text-gray-700">Try changing your keywords or sources to get more results.</p>
        </div>
      </div>
    ) : (
      <StoreNewsDataCategory
        newsData={data}
        collectionName="categoryNews"
        categoryNewsId={categoryNewsId}
        redirectTo={`/category/${categoryNewsId}`}
      />
    )}
  </div>
);
}

//   let data: any = null;

//   // Check if data already exists in Firestore
//   const storedNewsSnapshot = await db
//     .collection("categoryNews")
//     .where("categoryNewsId", "==", categoryNewsId)
//     .get();

//   if (!storedNewsSnapshot.empty) {
//     // If data already exists, use it
//     data = storedNewsSnapshot.docs.map(doc => doc.data());
//   } else {
//     // Fetch category preferences from Firestore
//     const newsSnapshot = await db
//       .collection("categoryPreferences")
//       .where("categoryNewsId", "==", categoryNewsId)
//       .get();

//     if (!newsSnapshot.empty) {
//       const categoryPreferences: CategoryPreference[] = newsSnapshot.docs.map(
//         (doc) => ({
//           id: doc.id,
//           ...(doc.data() as Omit<CategoryPreference, "id">),
//         })
//       );

//       if (categoryPreferences.length > 0) {
//         const pref = categoryPreferences[0];

//         // Build the query string for NewsAPI
//         let queryString = "";
//         // Handle generic positive term if no positive keyword exists
//         const positiveKeywords = pref.includeKeyword.length > 0 ? pref.includeKeyword.join(" OR ") : "the";
//         const negativeKeywords = pref.excludeKeyword
//           .map((kw) => `-${kw}`)
//           .join(" ");

//           if (positiveKeywords || negativeKeywords) {
//             queryString = `&q=${[positiveKeywords, negativeKeywords]
//               .filter((kw) => kw.trim() !== "")
//               .join(" ")}`;
//           }
  
//           const sourcesParam = 
//             pref.source.length > 0 ? `&sources=${pref.source.join(",")}` : "";
  
//           const URL = `https://newsapi.org/v2/everything?language=en${queryString}${sourcesParam}&apiKey=${API_KEY}`;
//           console.log(URL)

//         try {
//           const response = await fetch(URL);
//           data = await response.json();
//           console.log(data.status)
//         } catch (error) {
//           console.log("Error fetching data from NewsAPI:", error);
//         }
//       }
//     }
//   }

//   return (
//     <div className="flex flex-col justify-center items-center h-screen">
//       <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
//       <div className="text-gray-700 mb-4">Loading</div>
//       <StoreNewsDataCategory
//         newsData={data}
//         collectionName="categoryNews"
//         categoryNewsId={categoryNewsId}
//         redirectTo={`/category/${categoryNewsId}`}
//       />
//     </div>
//   );
// }
