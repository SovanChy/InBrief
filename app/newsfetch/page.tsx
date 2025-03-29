import { StoreNewsData } from "@/components/storenewsdata"
export default async function Page() {
    const API_KEY = process.env.NEWS_API_KEY
    const URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=10&apiKey=${API_KEY}`
    const response = await fetch(URL)
    const data = await response.json()
    console.log(data)
    console.log("success")
    
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <div className="text-gray-700 mb-4">Loading</div>        {/* Client component to handle Firestore storage */}
        <StoreNewsData newsData={data} collectionName="news" redirectTo="/news"  />        
      </div>
    )
  }
