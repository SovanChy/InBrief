'use client'
import React from 'react'
import { Dispatch, SetStateAction } from 'react';
import { BookOpen, Clock } from "lucide-react";
import Link from 'next/link';

interface SidebarComponentProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export default function SidebarComponent({ activeTab, setActiveTab }: SidebarComponentProps) {
  return (
    <>
      {/* Sidebar - Fixed position */}
      <div className="w-24 bg-blue-950 text-white flex-shrink-0 h-screen fixed top-0 left-0">        
        <div className="flex justify-center pt-6 pb-8">
          <h1 className="text-xl font-bold">
            In<span className="text-blue-400">Brief</span>
          </h1>
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center space-y-8">
          <Link href="/news">
            <button
              className={`p-2 rounded-md ${activeTab === "home" ? "bg-blue-800" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              <BookOpen className="h-6 w-6" />
            </button>
          </Link>

          <Link href="/bookmarks">
            <button
              className={`p-2 rounded-md ${activeTab === "bookmarks" ? "bg-blue-800" : ""}`}
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
          </Link>

          <Link href="/history">
            <button
              className={`p-2 rounded-md ${activeTab === "history" ? "bg-blue-800" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <Clock className="h-6 w-6" />
            </button>
          </Link>

          <Link href="/category">
            <button
              className={`p-2 rounded-md ${activeTab === "categories" ? "bg-blue-800" : ""}`}
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
          </Link>
        </nav>
      </div>
    </>
  );
}
