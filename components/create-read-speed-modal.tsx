"use client"

import type React from 'react'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner' // Add this import
import { AddFireStoreData } from '@/app/firebase/(hooks)/addFireStoreData'
import { useAuth } from '@clerk/nextjs'
import Image from 'next/image'




interface CreateReadSpeedModalProps {
    isOpen: boolean 
    onClose: () => void 
  
}



export default function CreateReadSpeedModal({isOpen, onClose} : CreateReadSpeedModalProps)
{
    const { userId } = useAuth() || { userId: '' }
    const userIdString = userId || ''
    //Default reading speed is 250 words per minute
    const [readingSpeed, setReadingSpeed] = useState<number>()
   
    const {addReadSpeedData} = AddFireStoreData('userReading')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const readSpeed = {
                readingSpeed: readingSpeed ?? 250,
                uid: userIdString
            }
            
            await addReadSpeedData(readSpeed, userIdString)
            toast.success('Reading speed saved successfully!', {
                position: 'top-center',
                duration: 2000
            })
            // resetForm()
            onClose()
        } catch (error) {
            toast.error('Failed to save reading speed', {
                position: 'top-center'
            })
        }
    }

    // const resetForm = () => {
    //     setReadingSpeed(250)
    // }


    if(!isOpen) return null 

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-xl bg-blue-950 text-white rounded-lg overflow-hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 text-white hover:bg-blue-900/50"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center">Reading Speed</h2>
                    
                    <div className="flex justify-center my-4">
                        <Image
                            src="/images/book-icon.png"
                            alt="Book Icon"
                            width={50}
                            height={50}
                            className="mx-auto mt-2"
                        />
                    </div>
                    <p className="text-center text-gray-300 my-8 mb-2">
                        Input your reading speed in words per minute (WPM). This will help us tailor the content to your reading speed.
                    </p>
                    <p className="text-center text-gray-400 mb-6">
                        Default reading speed is 250 words per minute.
                     </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Input
                                type="number"
                                min="100" max="1000"
                                placeholder="Reading speed (e.g., 200...)"
                                className="bg-white text-gray-800 h-14 text-lg"
                                value={readingSpeed}
                                onChange={(e) => setReadingSpeed(Number(e.target.value))}
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                        <Button  className='bg-blue-950 border-2 ' type="submit">Add</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}