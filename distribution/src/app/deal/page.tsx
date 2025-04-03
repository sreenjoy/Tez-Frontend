"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DealRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first deal
    router.push('/deal/123456');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading deal...</p>
      </div>
    </div>
  );
} 