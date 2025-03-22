import StoreNewsData from "@/components/storenewsdata"

export default async function Page() {
    const API_KEY = process.env.NEWS_API_KEY
    const URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEY}`
    const response = await fetch(URL)
    const data = await response.json()
    console.log(data)
    console.log("success")
    
    return (
      <div>
         <h1>Fetching News</h1>
        {/* Client component to handle Firestore storage */}
        <StoreNewsData newsData={data} redirectTo="/news"  />        
      </div>
    )
  }
