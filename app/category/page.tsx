"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarComponent from "@/components/sidebar";
import { useState } from "react";
import { Edit, MoreHorizontal, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Alert,
  AlertDescription
 } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import CreateCategoryModal from "@/components/create-category-modal";
import EditCategoryModal from "@/components/edit-category-modal";
import CreateReadSpeedModal from "@/components/create-read-speed-modal";
import { DocumentData } from "firebase/firestore";
import { AddFireStoreData } from "../firebase/(hooks)/addFireStoreData";
import { getFirestoreSnapshot } from "../firebase/(hooks)/getFirestoreSnapshot";

const Category = () => {
  const { data, loading, error} = getFirestoreSnapshot("categoryPreferences");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<DocumentData[]>([]);
  const [alert, setAlert] = useState(false);
  const {deleteDataWithCategoryNewsId} = AddFireStoreData("categoryPreferences");
  const [isReadSpeedModalOpen, setIsReadSpeedModalOpen] = useState(false);

  



  const handleCreateCategory = (category: any) => {
    setCategories([...categories, category]);
    // Here you would typically save the category to your backend
    console.log("Created category:", category);
  };

  const handleEditCategory = (category: any) => {
    setCategories([...categories, category]);
    // Here you would typically save the category to your backend
    console.log("Created category:", category);
  };

  const handleShareCategory = (categoryNewsId: string) => {
    const website = window.location.origin; // Gets the base URL dynamically
    const link = `${website}/category/${categoryNewsId}`;    
    navigator.clipboard.writeText(link).then(() => {
    console.log("Link copied to clipboard:", link);
    setAlert(true)
    setTimeout(() => setAlert(false), 1500)
    }).catch((err) => {
      console.error("Failed to copy link to clipboard:", err);
    });
  };

  const onDelete = (index: string) => {
    deleteDataWithCategoryNewsId(index)
  };
 

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setCategoriesData(data);
    }
  }, [data]);

  return (
    <div>
      { loading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <div className="text-gray-700 mb-4">Loading</div>
        </div>
      ) : (
    <div className="flex w-full h-screen">
      <SidebarComponent activeTab="categories" setActiveTab={() => {}} />
      <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 ml-24 p-4">
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
          <Button variant="default"  className="bg-blue-950 hover:bg-blue-900" 
            onClick={() => setIsReadSpeedModalOpen(true)}>
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
        <h1 className="text-2xl font-bold ml-3 mt-3 mb-3">Categories</h1>
        {categoriesData &&
          categoriesData.map((item: any) => (
            <div key={item.id}>
              <Card
                className="bg-blue-950 overflow-hidden transition-all hover:shadow-md mb-3"
               
              >
                <CardHeader className="dark:bg-gray-1000 ">
                  <div className="flex justify-between items-start">
                    <CardTitle
                      className="text-xl mt-3 mb-3 font-bold cursor-pointer"
                      onClick={() =>
                      router.push(`/newsfetchcategory/${item.categoryNewsId}`)
                      }
                    >
                    <div className="bg-white border border-gray-300 rounded-md px-4 py-2 w-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 shadow-sm hover:border-gray-400 transition-colors">
                      {item.name} 
                    </div>
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 "
                        >
                          <MoreHorizontal className="h-4 w-4" color="white"/>
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                          setCategoryId(item.id);
                          setIsEditCategoryModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            handleShareCategory(item.categoryNewsId)
                          }}
                        >
                        
                          <Edit className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => onDelete(item.categoryNewsId)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-200 dark:text-gray-400">
                        Source
                      </h3>
                      <p className="flex flex-wrap gap-1 mt-1">
                        {item.source.map((source: string, i: number) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:blue-green-300 dark:border-blue-800 "
                          >
                            {source}
                          </Badge>
                        ))}
                      </p>
                    </div>

                    {item.includeKeyword.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-200 dark:text-gray-400">
                          Include Keywords
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.includeKeyword.map(
                            (keyword: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                              >
                                {keyword}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {item.excludeKeyword.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-200 dark:text-gray-400">
                          Exclude Keywords
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.excludeKeyword.map(
                            (keyword: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                              >
                                {keyword}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          
        <CreateCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onCreateCategory={handleCreateCategory}
        />{" "}

    <EditCategoryModal
          isOpen={isEditCategoryModalOpen}
          onClose={() => setIsEditCategoryModalOpen(false)}
          onCreateCategory={handleEditCategory}
          id={categoryId || ""}
        />{" "}

             <CreateReadSpeedModal
                          isOpen={isReadSpeedModalOpen}
                          onClose={() => setIsReadSpeedModalOpen(false)}
                        />{" "}

        {/* Centered Alert */}
  {alert && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Alert className="relative w-full max-w-xl bg-white text-white rounded-lg overflow-hidden">
        <CheckCircle color="green" size={24} />
        <AlertDescription>Link is copied</AlertDescription>
      </Alert>
    </div>
  )}

      </main>
  </div>

) }
</div>)}


  

export default Category;
