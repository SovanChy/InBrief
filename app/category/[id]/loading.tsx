// app/dashboard/loading.js
export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <div className="text-gray-700 mb-4">Loading</div>
        </div>
    )
  }