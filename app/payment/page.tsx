'use client'
import React from 'react'
import SidebarComponent from '@/components/sidebar'
import { useState } from 'react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Check } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PlanFeature {
  name: string
  premium: boolean
  freemium: boolean
}

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "freemium" | null>(null)

  const Free_features: PlanFeature[] = [
    { name: "Create up to 3 categories", premium: false, freemium: true },
    { name: "5 AI summarization", premium: false, freemium: true },
    { name: "10 bookmarks for saved articles", premium: false, freemium: true },
    { name: "", premium: true, freemium: true },
    { name: "", premium: true, freemium: false },
  ]

  const Premium_features: PlanFeature[] = [
    { name: "Unlimited category creation", premium: true, freemium: false },
    { name: "Unlimited AI-powered news summarization", premium: true, freemium: true },
    { name: "Unlimited bookmarks", premium: true, freemium: true },
    { name: "", premium: true, freemium: true },
    { name: "", premium: true, freemium: false },
  ]

  const handleSelectPlan = (plan: "premium" | "freemium") => {
    setSelectedPlan(plan)
  }

  return (
    <div className="flex w-full h-screen">
      <SidebarComponent activeTab="payment" setActiveTab={() => {}} />
      

        {/* Main Content - Premium Plans */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4">
          <div className="w-full max-w-6xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">CHOOSE YOUR PLAN</h1>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Upgrade your experience with our premium plans to unlock additional features.
              </p>
            </div>
      
            <div className="flex flex-col md:flex-row gap-8 justify-center">
             
              {/* Freemium Plan */}
              <Card
                className={`w-full max-w-md border-2 transition-all ${
                  selectedPlan === "freemium" ? "border-blue-600 shadow-lg" : "border-gray-200"
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">Free-Tier</CardTitle>
                  {selectedPlan === "freemium" && <Badge className="bg-blue-600 absolute top-4 right-4">Selected</Badge>}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 mb-6 mx-6 px-6">
                    {Free_features.map((feature, index) => (
                      <div key={index} className="flex items-center mx-6 px-6">
                        <span className="flex-1">
                          {feature.name}
                          {feature.name === "Portfolio Posting" && feature.freemium && (
                            <span className="text-gray-500 font-medium"> (Limited)</span>
                          )}
                          {feature.name === "Article Posting" && feature.freemium && (
                            <span className="text-gray-500 font-medium"> (Limited)</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
      
                  <div className="text-center my-6">
                    <div className="text-3xl font-bold">Free</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                  <Button
                    variant="outline"
                    className="border-blue-950 text-blue-950 hover:bg-blue-50 px-8 py-6 h-auto text-lg font-medium rounded-full"
                    onClick={() => handleSelectPlan("freemium")}
                  >
                    Continue with Free
                  </Button>
                </CardFooter>
              </Card>

               {/* Premium Plan */}
               <Card
                className={`w-full max-w-md border-2 transition-all ${
                  selectedPlan === "premium" ? "border-blue-600 shadow-lg" : "border-gray-200"
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">Paid-tier</CardTitle>
                  {selectedPlan === "premium" && <Badge className="bg-blue-600 absolute top-4 right-4">Selected</Badge>}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 mb-6">
                    {Premium_features.map((feature, index) => (
                      <div key={index} className="flex items-center mx-6 px-5">
                        <span className="flex-1 mx-6 px-6">
                          {feature.name}
                          {feature.name === "Portfolio Posting" && (
                            <span className="text-blue-600 font-medium"> (Unlimited)</span>
                          )}
                          {feature.name === "Article Posting" && (
                            <span className="text-blue-600 font-medium"> (Unlimited)</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
      
                  <div className="text-center my-6">
                    <div className="text-3xl font-bold">
                      $14.90<span className="text-lg font-normal text-gray-500">/Month</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                  <Button
                    className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-6 h-auto text-lg font-medium rounded-full"
                    onClick={() => handleSelectPlan("premium")}
                  >
                    Get Premium
                  </Button>
                </CardFooter>
              </Card>
            </div>
      
            <div className="mt-12 text-center text-sm text-gray-500">
              <p className="mt-2">Need help? Contact our support team at support@inbrief.com</p>
            </div>
          </div>
        </main>
      </div>
  )
}