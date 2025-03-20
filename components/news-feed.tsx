"use client";
import { useState, useEffect } from "react";

import {
  Bell,
  BookOpen,
  Clock,
  Filter,
  MessageSquare,
  RefreshCw,
  Search,
  Share2,
  ThumbsUp,
} from "lucide-react";
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
import ArticleModal from "./article-modal";
import CreateCategoryModal from "./create-category-modal";

interface Article {
  title: string;
  url: string;
  urlToImage: string;
  description?: string;
  publishedAt: string;
}

interface NewsFeedProps {
  articles: Article[];
  description?: string;
}

export default function NewsFeed({ articles }: NewsFeedProps) {
  const [activeTab, setActiveTab] = useState("home");
  const [like, setLike] = useState(0);
  const [comment, setComment] = useState(0);
  const [view, setView] = useState(0);

  // Article Modal
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
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
      {/* Sidebar - Fixed position */}
      <div className="w-24 bg-blue-950 text-white flex-shrink-0 h-screen">
        {/* Logo */}
        <div className="flex justify-center pt-6 pb-8">
          <h1 className="text-xl font-bold">
            In<span className="text-blue-400">Brief</span>
          </h1>
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center space-y-8">
          <button
            className={`p-2 rounded-md ${
              activeTab === "home" ? "bg-blue-800" : ""
            }`}
            onClick={() => setActiveTab("home")}
          >
            <BookOpen className="h-6 w-6" />
          </button>
          <button
            className={`p-2 rounded-md ${
              activeTab === "bookmarks" ? "bg-blue-800" : ""
            }`}
            onClick={() => setActiveTab("bookmarks")}
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
              className="h-6 w-6"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </button>
          <button
            className={`p-2 rounded-md ${
              activeTab === "history" ? "bg-blue-800" : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            <Clock className="h-6 w-6" />
          </button>
          <button
            className={`p-2 rounded-md ${
              activeTab === "categories" ? "bg-blue-800" : ""
            }`}
            onClick={() => setActiveTab("categories")}
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
              className="h-6 w-6"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </button>
        </nav>
      </div>
      {/* Main Content - Scrollable area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <Button
            variant="default"
            className="bg-blue-950 hover:bg-blue-900"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Create Category
          </Button>

          <div className="relative w-full max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 bg-gray-100 dark:bg-gray-700 border-none"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Explore</h2>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Trending Section */}
          <section className="mb-8">
            <h3 className="text-xl text-gray-500 mb-4">Latest</h3>

            <div className="space-y-6">
              {articles.map((article, index) => (
                <ArticleCard
                  key={index}
                  image={article.urlToImage || "/placeholder.svg"}
                  title={article.title}
                  timePosted={new Date(article.publishedAt).toLocaleString()}
                  readTime="5 min"
                  source={article.url}
                  preview={article.description || "Click to read more..."}
                  likes="0"
                  comments="0"
                  tags={[{ label: "unread", color: "blue" }]}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
      <ArticleModal
        article={selectedArticle}
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
      />
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreateCategory={handleCreateCategory}
      />{" "}
    </div>
  );
}

interface ArticleCardProps {
  image: string;
  title: string;
  timePosted: string;
  readTime: string;
  source: string;
  preview: string;
  likes: string;
  comments: string;
  tags: { label: string; color: string }[];
}

function ArticleCard({
  image,
  title,
  timePosted,
  readTime,
  source,
  preview,
  likes,
  comments,
  tags,
}: ArticleCardProps) {
  const handleClick = () => {
    // Get the parent component's handleArticleClick function
    const article = {
      title,
      timePosted,
      readTime,
      source,
      sourceUrl: `https://${source}`,
      image,
      content: preview,
      likes,
      comments,
      tags,
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
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant={tag.color === "blue" ? "default" : "secondary"}
                className={`inline-flex items-center h-6 px-2 text-xs ${
                  tag.color === "blue"
                    ? tag.label === "read"
                      ? "bg-blue-900"
                      : "bg-blue-950"
                    : ""
                }`}
              >
                {tag.label}
              </Badge>
            ))}
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
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {likes}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <MessageSquare className="h-4 w-4 mr-1" />
              {comments}
            </Button>
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
