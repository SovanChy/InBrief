"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ThumbsUp, MessageSquare, Share2, MoreHorizontal, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tab"
import { firestoreDb } from "@/app/firebase/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore";

interface Comment {
  id: string
  author: string
  content: string
  likes: string
  replies: string
}

interface ArticleModalProps {
  article: {
    title: string
    timePosted: string
    readTime: string
    source: string
    sourceUrl: string
    image: string
    content: string
    summarization: string
    likes: string
    comments: string
    tags: { label: string; color: string }[]
  } | null
  isOpen: boolean
  onClose: () => void
}

export default function ArticleModal({ article, isOpen, onClose}: ArticleModalProps) {
  const [showComments, setShowComments] = useState(true)
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  // const [scrapedArticle, setScrapedArticle] = useState<{
  //   title: string;
  //   url: string;
  //   textContent: string;
  // } | null>(null);



  //sending request to openai

  // async function askOpenAI() {
  //   const res = await fetch("/api/openai", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ prompt: scrapedArticle?.textContent || "" }),
  //   });

  //   const data = await res.json();
  //   setResponse(data.message);
  //   console.log(data)
  // }

  //Scraping content
  async function sendScrapeRequest() {
    if (!article?.source) {
      console.error('No article URL available to scrape.');
      return;
    }

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

      setResponse(summarizedContent.message);
      console.log('Scraped article:', summarizedContent);

      // const docRef = doc(firestoreDb, "news", id)
      


    } catch (error) {
      setResponse("Summarization is not available for this article")
    } finally {
      setLoading(false);
    }
  }




  // Sample comments data
  const comments: Comment[] = [
    {
      id: "1",
      author: "Josh",
      content: "I agree with some of the information, but maybe, it will go the opposite way",
      likes: "24K",
      replies: "300",
    },
    {
      id: "2",
      author: "Lisa",
      content: "We need to debate about this topic.",
      likes: "400",
      replies: "10",
    },
  ]

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
                <Badge
                  key={index}
                  variant={tag.color === "blue" ? "default" : "secondary"}
                  className={tag.color === "blue" ? (tag.label === "read" ? "bg-blue-900" : "bg-blue-950") : ""}
                >
                  {tag.label}
                </Badge>
              ))}
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

          <Tabs defaultValue="summary" className="mb-6">
            <TabsList className="bg-blue-900 dark:bg-gray-700">
              <TabsTrigger onClick={() => sendScrapeRequest()} value="bullet-points" className="text-gray-500">Bullet points</TabsTrigger>
              <TabsTrigger value="summary" className="text-gray-500">Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="bullet-points" className="bg-gray-200 p-4 mt-4 " >
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
                ) : (
                  response &&
                  response.split('\n').map((point, index) => (
                  <p key={index}>{point}</p>
                  ))
                )}
                </p>
            </TabsContent>
            <TabsContent value="summary" className="bg-gray-200 p-4 mt-4">
              <p className=" text-gray-700 dark:text-gray-300 ">
               {response &&  <p>{response}</p>}
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
              <MessageSquare className="h-4 w-4" />
              {article.comments}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                onClick={() => setShowComments(!showComments)}
                className="px-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showComments ? "Hide Comments" : "Show Comments"}
              </Button>
              <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1 mx-4"></div>
            </div>

            {showComments && (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                          {comment.author.charAt(0)}
                        </div>
                        <span className="font-medium">{comment.author}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300 pl-11">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2 pl-11">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 px-1">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {comment.likes}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                        {comment.replies} replies
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

