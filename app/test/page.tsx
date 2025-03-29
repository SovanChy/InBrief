"use client";
import { useState } from 'react'
import axios from 'axios'

export default function NewsScraper() {
  const [article, setArticle] = useState<{
    title: string;
    url: string | null;
    textContent: string;
  } | null>(null);

  const [scrapedArticle, setScrapedArticle] = useState<{
    title: string;
    url: string;
    textContent: string;
  } | null>(null);

  const [preSummary, setPreSummary] = useState("")
  const [postSummary, setPostSummary] = useState("")

  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);


  async function askOpenAI() {
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: preSummary || "" }),
    });

    const postSummary = await res.json();
    setResponse(postSummary.message);
    console.log(postSummary)
  }

  async function sendScrapeRequest() {


    const url = "https://www.bbc.co.uk/programmes/p0kzm406" ;


    if (!url) {
      console.error("Article URL is missing or undefined!");
    } else {
      console.log("Article URL:", url);
    }
    

  
    try {
      const res = await fetch(`/api/scrape-news?link=${encodeURIComponent(url)}`, {
        method: "GET", // ✅ Use GET since we're passing the link in query params
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch article: ${res.statusText}`);
      }
  
      const data = await res.json();
      // const responseScraped = await axios.get('/api/scrape-news');

      setScrapedArticle(data)
      setPreSummary(data.textContent)
    } catch (error) {
      console.error('Error scraping article:', error);
    }
  }
  

  const scrapeArticle = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/scrape-news');
      setArticle(response.data);
    } catch (error) {
      console.error('Failed to fetch article', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={scrapeArticle} disabled={loading}>
        {loading ? 'Scraping...' : 'Scrape Latest Apple News'}
      </button>

      <br></br>

      <button onClick={sendScrapeRequest} disabled={loading}>
       Sent your url to chatgpt
      </button>

      <br></br>

    <button onClick={askOpenAI}>Ask OpenAI</button>
    <p>Response: {response}</p>

    <br></br>

    {scrapedArticle && (
      <div>
        <h3>{scrapedArticle.title}</h3>
        <a href={scrapedArticle.url} target="_blank" rel="noopener noreferrer">
          {scrapedArticle.url}
        </a>
        <p>{scrapedArticle.textContent}</p>
      </div>
    )}

{/*       
      {article && (
        <div>
          <h2>{article.title}</h2>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read Original Article
          </a>
          <p>{article.textContent}</p>
        </div>
      )} */}

{/* 
        {response && (
        <div>
          <h2>{article.title}</h2>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read Original Article
          </a>
          <p>{response.textContent}</p>
        </div>
      )} */}


    
    </div>
  );
}