'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { CheckCircle } from 'lucide-react'
import SidebarComponent from '@/components/sidebar'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // You can add subscription validation logic here
  }, [])

  return (
    <div className="flex w-full h-screen">
      <SidebarComponent activeTab="payment" setActiveTab={() => {}} />
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for upgrading to Premium. Your subscription is now active.
            </p>
            <Button 
              onClick={() => router.push('/news')}
              className="bg-blue-950 hover:bg-blue-900"
            >
              Go to News
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}