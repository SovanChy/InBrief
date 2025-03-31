"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ThumbsUp, MessageSquare, Share2, MoreHorizontal, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tab"
import { firestoreDb } from "@/app/firebase/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore";
// import getFireStoreDataToday from '../app/firebase/(hooks)/getFireStoreDataToday';


interface ArticleModalProps {
  article: {
    id: string
    arrayIndex:number
    title: string
    timePosted: string
    readTime: string
    source: string
    sourceUrl: string
    image: string
    content: string
    preview: string
    summary: string
    likes: string
    comments: string
    tags: { label: string; color: string }[]
    openAiCollectionName: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export default function ArticleModal({ article, isOpen, onClose}: ArticleModalProps) {
  const [response, setResponse] = useState("")
  const [responseFromDatabase, setResponseFromDatabase] = useState("")
  const [loading, setLoading] = useState(false)
  
 


  //Scraping content
  async function sendScrapeRequest(index: number, collectionName: string) {
    if (!article?.source) {
      console.error('No article URL available to scrape.');
      return;
    }

     //Referencing the database
     const docRef = doc(firestoreDb, collectionName, article.id);
     const docSnap = await getDoc(docRef);
     if (!docSnap.exists()) {
       console.error("Document not found!");
       return;
     }
     let docData = docSnap.data() as { [key: string]: any }; // Replace with the actual type if known
     let articles = docData.articles || []; // Ensure it's an array

          // Check if the index is valid
    if (article.arrayIndex < 0 || article.arrayIndex >= articles.length) {
      console.error(`Index ${index} is out of bounds.`);
      return;
    }

    // Check if the value exists at that index
    if (!articles[article.arrayIndex]) {
      console.log(`No article found at index ${article.arrayIndex}.`);
      return;
    }

       // Check if the value exists at that index
       if (articles[article.arrayIndex].summary) {
        console.error(`summary already exist ${article.arrayIndex}.`);
        return;
      }

  if(!articles[article.arrayIndex].summary) {

    setLoading(true);

    try {
      // Initiate both fetch requests concurrently
      const scrapeResponse = fetch(`/api/scrape-news?link=${encodeURIComponent(article.source)}`, {
        method: "GET",
      });

      const [scrapeRes] = await Promise.all([scrapeResponse]);

      if (!scrapeRes.ok) {
        throw new Error(`Failed to fetch article: ${scrapeRes.statusText}`);
      }

      const scrapeData = await scrapeRes.json();
      const scrapedArticle = scrapeData.textContent;

      // Send the scraped content to OpenAI
      const summarizedContent = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: scrapedArticle || "" }),
      }).then((res) => res.json());


    articles[article.arrayIndex] = {
      ...articles[article.arrayIndex],
      summary: summarizedContent.message
    }

    await updateDoc(docRef,{articles});

    console.log(`Article at index ${article.arrayIndex} updated successfully!`);
    setResponse(summarizedContent.message);
  



    } catch (error) {
      setResponse("Summarization is not available for this article")
    } finally {
      setLoading(false);
    }
  }
  }

  





  if (!isOpen || !article) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl h-full overflow-auto animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">View Article</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
         
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{article.title}</h1>
            <div className="flex gap-2 ml-2 flex-shrink-0">
              {article.tags.map((tag, index) => (
                 
                 <div>
                <Badge
                  key={index}
                  variant={tag.color === "blue" ? "default" : "secondary"}
                  className={tag.color === "blue" ? (tag.label === "read" ? "bg-blue-900" : "bg-blue-950") : ""}
                >
                  {tag.label}
                </Badge>

              
                </div>
              ))}

              {/* <Button variant="ghost" size="icon" onClick={() => {console.log(article.arrayIndex)}}>test index</Button>
              <Button variant="ghost" size="icon" onClick={() => {console.log(article.id)}}>test article id</Button> */}


              <Button variant="ghost" size="icon" className="h-6 w-6">
               
            
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Posted {article.timePosted}</span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{article.readTime}</span>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            <span>
              Source:{" "}
              <a href={article.source} className="text-blue-500 hover:underline">
                {article.source}
              </a>
            </span>
          </div>

          <Tabs defaultValue="preview" className="mb-6">
            <TabsList className="bg-blue-900 dark:bg-gray-700">
              <TabsTrigger onClick={() => sendScrapeRequest(article.arrayIndex, article.openAiCollectionName)} value="summarization" className="text-gray-500">Summarization</TabsTrigger>
              <TabsTrigger value="preview" className="text-gray-500">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="summarization" className="bg-gray-200 p-4 mt-4 " >
                <p className="text-gray-800 dark:text-gray-300">
                {loading ? (
                  <div className="flex justify-center items-center">
                  <svg
                  className="animate-spin h-5 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  >
                  <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  ></circle>
                  <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                  </svg>
                  </div>
                ) :  article.summary ? (
                  <p>{article.summary}</p>
                ): response ? (
                  response.split('\n').map((point, index) => (
                  <p key={index}>{point}</p>
                  ))
                ) : (
                  <p> no summary found </p>
                )
              }
                </p>
            </TabsContent>
            
            <TabsContent value="preview" className="bg-gray-200 p-4 mt-4">
              <p className=" text-gray-700 dark:text-gray-300 ">
                {article.preview}
              
              </p>
            </TabsContent>
          </Tabs>

          <div className="mb-6">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              width={700}
              height={400}
              className="w-full h-auto rounded-md"
            />
          </div>

          <div className="flex items-center gap-4 py-4 border-t border-b mb-6">
            <Button variant="ghost" size="sm" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              {article.likes}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

         
        </div>
      </div>
    </div>
  )
}

