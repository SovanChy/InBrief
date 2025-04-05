"use client"
import { Timestamp } from 'firebase/firestore'

import type React from 'react'
import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AddFireStoreData } from '@/app/firebase/(hooks)/addFireStoreData'
import { useAuth } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid';



interface CreateCategoryModalProps {
    isOpen: boolean 
    onClose: () => void 
    onCreateCategory: (category: {
        name: string
        uid: string
        categoryNewsId: string
        source: string[]
        includeKeyword: string[]
        excludeKeyword: string[]
        createdAt?: Timestamp
    }) => void
}

// Example news sources - replace with your actual sources
const availableSources = [
    { value: "cnn", label: "CNN" },
    { value: "bbc-news", label: "BBC" },
    { value: "the-washington-post", label: "Washington Post" },
    { value: "the-guardian-uk", label: "The Guardian" },
    { value: "bloomberg", label: "Bloomberg" },
    { value: "abc-news", label: "ABC News" },
    { value: "business-insider", label: "Business Insider" },
]

export default function CreateCategoryModal({isOpen, onClose, onCreateCategory} : CreateCategoryModalProps)
{
    const { userId } = useAuth() || { userId: '' }
    const userIdString = userId || ''
    const categoryNewsId = uuidv4()
    const [name, setName] = useState("")
    const [sourcesOpen, setSourcesOpen] = useState(false)
    const [selectedSources, setSelectedSources] = useState<string[]>([])
    const [includeKeyword, setIncludeKeyword] = useState<string>("")
    const [excludeKeyword, setExcludeKeyword] = useState<string>("")
    const [includeKeywords, setIncludeKeywords] = useState<string[]>([])
    const [excludeKeywords, setExcludeKeywords] = useState<string[]>([])
    const {addData} = AddFireStoreData('categoryPreferences')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const category = {
            name: name,
            uid: userIdString,
            categoryNewsId: categoryNewsId,
            source: selectedSources,
            includeKeyword: includeKeywords,
            excludeKeyword: excludeKeywords,
            Timestamp: Timestamp.now()
        }
        onCreateCategory(category)
        addData(category)
        resetForm()
        onClose()
    }

    const resetForm = () => {
        setName("")
        setSelectedSources([])
        setIncludeKeyword("")
        setExcludeKeyword("")
        setIncludeKeywords([])
        setExcludeKeywords([])
    }

    const toggleSource = (sourceValue: string) => {
        setSelectedSources(current => 
            current.includes(sourceValue)
                ? current.filter(item => item !== sourceValue)
                : [...current, sourceValue]
        )
    }

    const handleIncludeKeywordAdd = () => {
        if (includeKeyword.trim()) {
            setIncludeKeywords([...includeKeywords, includeKeyword.trim()])
            setIncludeKeyword("")
        }
    }

    const handleExcludeKeywordAdd = () => {
        if (excludeKeyword.trim()) {
            setExcludeKeywords([...excludeKeywords, excludeKeyword.trim()])
            setExcludeKeyword("")
        }
    }

    const removeSource = (sourceValue: string) => {
        setSelectedSources(current => current.filter(item => item !== sourceValue))
    }

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
                    <h2 className="text-3xl font-bold text-center mb-2">Category Name</h2>
                    <p className="text-center text-gray-300 mb-8">
                        Customize your news feed by creating a category based on your interests.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Input
                                type="text"
                                placeholder="Category Name"
                                className="bg-white text-gray-800 h-14 text-lg"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Popover open={sourcesOpen} onOpenChange={setSourcesOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={sourcesOpen}
                                        className="w-full justify-between bg-white text-gray-800 h-14 text-lg"
                                    >
                                        Select news sources...
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Search sources..." />
                                        <CommandList>
                                        <CommandEmpty>No source found.</CommandEmpty>
                                        <CommandGroup heading="available sources">
                                            {availableSources && availableSources.map((source) => (
                                                <CommandItem
                                                    key={source.value}
                                                    value={source.value}
                                                    onSelect={() => {
                                                        toggleSource(source.value)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedSources.includes(source.value) 
                                                                ? "opacity-100" 
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {source.label}
                                                </CommandItem>
                                            ))}
                                            {/* <CommandItem >
                                                <span>Hello</span>
                                            </CommandItem>
                                            <CommandItem >
                                                <span>Hello</span>
                                            </CommandItem>
                                            <CommandItem >
                                                <span>Hello</span>
                                            </CommandItem>               */}
                                        </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedSources.map((sourceValue) => {
                                    const source = availableSources.find(s => s.value === sourceValue)
                                    return (
                                        <Badge key={sourceValue} variant="secondary" className="px-3 py-1">
                                            {source?.label || sourceValue}
                                            <button 
                                                type="button"
                                                onClick={() => removeSource(sourceValue)} 
                                                className="ml-2 text-gray-600 hover:text-gray-900"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <Input
                                type="text"
                                placeholder="Include keywords"
                                className="bg-white text-gray-800 h-14 text-lg"
                                value={includeKeyword}
                                onChange={(e) => setIncludeKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleIncludeKeywordAdd())}
                            />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {includeKeywords.map((keyword, index) => (
                                    <Badge key={index} variant="secondary" className="px-3 py-1">
                                        {keyword}
                                        <button 
                                            type="button"
                                            onClick={() => setIncludeKeywords(keywords => 
                                                keywords.filter((_, i) => i !== index)
                                            )} 
                                            className="ml-2 text-gray-600 hover:text-gray-900"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Input
                                type="text"
                                placeholder="Exclude keywords"
                                className="bg-white text-gray-800 h-14 text-lg"
                                value={excludeKeyword}
                                onChange={(e) => setExcludeKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleExcludeKeywordAdd())}
                            />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {excludeKeywords.map((keyword, index) => (
                                    <Badge key={index} variant="secondary" className="px-3 py-1">
                                        {keyword}
                                        <button 
                                            type="button"
                                            onClick={() => setExcludeKeywords(keywords => 
                                                keywords.filter((_, i) => i !== index)
                                            )} 
                                            className="ml-2 text-gray-600 hover:text-gray-900"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                        <Button  className='bg-blue-950 border-2 ' type="submit">Create</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}