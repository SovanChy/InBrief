// app/page.tsx

export default async function Page() {
  const API_KEY = process.env.NEWS_API_KEY
  const URL = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEY}`
  const response = await fetch(URL)
  const data = await response.json()
  console.log(data)
  
  return (
    <div>
      <h1>Top Technology News</h1>
      <ul>
        {data.articles.map((article: any) => (
          <li key={article.title}>
            <ul>
              <a href={article.url}>{article.title}</a>
            </ul>
            <ul><img src={article.urlToImage} alt={article.title} /></ul>
          </li>
        ))}
      </ul>
    </div>
  )
}