// app/error.tsx
'use client'
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Error occurred:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-500">Something went wrong!</h1>
      <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
        Try Again
      </button>
    </div>
  );
}
