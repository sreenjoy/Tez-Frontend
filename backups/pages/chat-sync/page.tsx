'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatSyncPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Add debugging info on mount
  useEffect(() => {
    console.log("ChatSyncPage mounted - This message should appear in the console if the page loads");
  }, []);
  
  const openModal = () => {
    console.log("Opening modal");
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };
  
  console.log("ChatSyncPage rendering, isModalOpen:", isModalOpen);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Chat sync</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Sync your Telegram chats with CRMT by choosing folders that you want to track.
        </p>
        
        <div className="mt-8 flex justify-between">
          <button
            className="px-5 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            onClick={() => router.push('/pipeline')}
          >
            Continue without sync
          </button>
          <button
            className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            onClick={openModal}
          >
            Sync with CRMT
          </button>
        </div>
      </div>
      
      {/* Simple test modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl border-2 border-blue-400 dark:border-blue-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chat Sync Options</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Select which Telegram chat folders and individual chats you want to sync with CRMT.
            </p>
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Chat Folders</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="folder1" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="folder1" className="ml-2 text-gray-700 dark:text-gray-300">Work (12 chats)</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="folder2" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="folder2" className="ml-2 text-gray-700 dark:text-gray-300">Personal (8 chats)</label>
                </div>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Start Sync
            </button>
          </div>
        </div>
      )}
      
      {/* Debug section */}
      <div className="mt-8 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border-2 border-red-500">
        <h3 className="text-red-600 dark:text-red-400 font-medium mb-2">Debugging Tools</h3>
        <div className="text-sm mb-2 text-red-800 dark:text-red-300">
          Modal state: {isModalOpen ? 'OPEN' : 'CLOSED'}
        </div>
        <button 
          onClick={openModal}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Open Modal Directly (Debug)
        </button>
      </div>
    </div>
  );
} 