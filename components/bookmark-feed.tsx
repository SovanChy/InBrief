"use client";
import { useState, useEffect } from "react";
import { Clock, RefreshCw, Search, Share2, ThumbsUp } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import Image from "next/image";
import CreateCategoryModal from "./create-category-modal";
import CreateReadSpeedModal from "./create-read-speed-modal";
import SidebarComponent from "./sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import BookmarkModal from "./bookmark-modal";

interface Article {
  title: string;
  source: string;
  image: string;
  content?: string;
  timePosted: string;
  summary: string;
  like: number;
  readStatus: boolean;
  likesBy: string[] | null;
}

interface NewsFeedProps {
  articles: Article[];
  description?: string;
}

interface idProps {
  id: string;
}

export default function BookmarkFeed({
  articles,
  id,
}: NewsFeedProps & idProps) {
  const router = useRouter();

  // Article Modal
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isReadSpeedModalOpen, setIsReadSpeedModalOpen] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);

  //search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filter displayed articles (keep original implementation)
  const filteredArticles = articles.filter((article) => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      (article.content?.toLowerCase()?.includes(query) ?? false)
    );
  });

  //handle article click
  const handleArticleClick = (article: any) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleCreateCategory = (category: any) => {
    setCategories([...categories, category]);
    // Here you would typically save the category to your backend
    console.log("Created category:", category);
  };

  useEffect(() => {
    const handleArticleClickEvent = (e: any) => {
      handleArticleClick(e.detail);
    };

    document.addEventListener("articleClick", handleArticleClickEvent);

    return () => {
      document.removeEventListener("articleClick", handleArticleClickEvent);
    };
  }, []);
  return (
    <div className="flex w-full h-screen">
      <SidebarComponent activeTab="bookmarks" setActiveTab={() => {}} />{" "}
      {/* Main Content - Scrollable area */}
      <div className="flex-1 flex flex-col overflow-hidden ml-24 p-4">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <Button
            variant="default"
            className="bg-blue-950 hover:bg-blue-900"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Create Category
          </Button>

          {/* Update search input JSX */}
          <div className="relative w-full max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 bg-gray-100 dark:bg-gray-700 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              className="bg-blue-950 hover:bg-blue-900"
              onClick={() => setIsReadSpeedModalOpen(true)}
            >
              Add Reading Speed
            </Button>

            <SignedOut>
              <SignInButton>
                <Button className="bg-transparent border border-white-500 text-white hover:bg-white/50">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  variant="secondary"
                  className="bg-white text-black hover:bg-white/50"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>

        {/* Content - Independently scrollable */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-6">
          <div className="flex justify-between items-center mb-6 px-3">
            <div>
              <h2 className="text-2xl font-bold">Bookmark</h2>
            </div>
          </div>

          {/* Search results info */}
          {searchQuery && (
            <div className="px-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredArticles.length} results for "{searchQuery}"
            </div>
          )}

          {/* 
          {filteredArticles.map((article, index) => {
    const originalIndex = articles.findIndex(a => a.url === article.url);
    return (
      <ArticleCard
        key={originalIndex}
        id={id}
        arrayIndex={originalIndex}  // Pass original index
        summary={article.summary}
        image={article.urlToImage || "/placeholder.svg"}
        title={article.title}
        timePosted={new Date(article.publishedAt).toLocaleString()}
        readTime="Click to get read time"
        source={article.url}
        preview={article.description || "Click to read more..."}
        like={article.like}
        readStatus={article.readStatus}
        openAiCollectionName="news"
        likesBy={Array.isArray(article.likesBy) ? article.likesBy : null}
      />
    );
  })} */}

          {/* Trending Section */}
          <section className="mb-8">
            <div className="space-y-6">
              {articles && articles.length > 0 ? (
                filteredArticles.map((article, index) => {
                  const originalIndex = articles.findIndex(
                    (a) => a.source === article.source
                  );
                  return (
                    <ArticleCard
                      key={index}
                      id={id}
                      arrayIndex={index}
                      summary={article.summary}
                      image={article.image || "/placeholder.svg"}
                      title={article.title}
                      timePosted={new Date(article.timePosted).toLocaleString()}
                      readTime="Click to get read time"
                      source={article.source}
                      preview={article.content || "Click to read more..."}
                      like={article.like}
                      readStatus={article.readStatus}
                      openAiCollectionName="bookmarks"
                      likesBy={
                        Array.isArray(article.likesBy) ? article.likesBy : null
                      }
                    />
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p>No bookmarked articles found.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
      <BookmarkModal
        article={selectedArticle}
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        collectionName="bookmarks"
        categoryNewsId={null}
      />
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreateCategory={handleCreateCategory}
      />{" "}
      <CreateReadSpeedModal
        isOpen={isReadSpeedModalOpen}
        onClose={() => setIsReadSpeedModalOpen(false)}
      />{" "}
    </div>
  );
}

interface ArticleCardProps {
  id: string;
  summary: string;
  arrayIndex: number;
  image: string;
  title: string;
  timePosted: string;
  readTime: string;
  source: string;
  preview: string;
  like: number;
  readStatus: boolean;
  openAiCollectionName: string;
  likesBy: string[] | null;
}

function ArticleCard({
  arrayIndex,
  summary,
  image,
  title,
  timePosted,
  readTime,
  source,
  preview,
  like,
  id,
  openAiCollectionName,
  readStatus,
  likesBy,
}: ArticleCardProps & idProps) {
  const { userId } = useAuth();
  const handleClick = () => {
    // Get the parent component's handleArticleClick function
    const article = {
      id,
      arrayIndex,
      summary,
      title,
      timePosted,
      readTime,
      source,
      sourceUrl: `https://${source}`,
      image,
      preview,
      content: preview,
      like,
      readStatus,
      openAiCollectionName,
      likesBy,
    };
    // Find the NewsFeed component and call its handleArticleClick function
    const event = new CustomEvent("articleClick", { detail: article });
    document.dispatchEvent(event);
  };
  return (
    <div
      className="flex gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
      onClick={handleClick}
    >
      {" "}
      <div className="w-60 h-32 flex-shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={240}
          height={128}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-bold mb-1 pr-2">{title}</h4>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 flex-shrink-0"
            >
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

        <div className="flex items-center text-sm text-gray-500 mb-1">
          <span>Posted: {timePosted}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{readTime}</span>
        </div>

        <div className="text-sm text-gray-500 mb-2">
          Source:{" "}
          <a href={source} className="text-blue-500 hover:underline">
            {source}
          </a>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {preview}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {userId && likesBy?.includes(userId) ? (
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="h-4 w-4 fill-blue-500 stroke-blue-500" />
                {like}
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                {like}
              </Button>
            )}
          </div>

          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
