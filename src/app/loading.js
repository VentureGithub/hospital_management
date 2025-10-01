// export default function Loading() {
//     // Or a custom loading skeleton component
//     return <p>Loading...</p>
//   }

export default function Loading() {
  // Or a custom loading skeleton component
  return<div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="flex space-x-2">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="flex flex-col justify-center">
        <span className="text-lg font-semibold text-blue-600">Loading...</span>
      </div>
    </div>
    </div>
  }