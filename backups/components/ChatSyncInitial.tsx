import React, { useState, useEffect } from 'react';
import ChatSyncModal from './ChatSyncModal';

interface ChatSyncInitialProps {
  onContinueWithoutSync?: () => void;
}

const ChatSyncInitial: React.FC<ChatSyncInitialProps> = ({ onContinueWithoutSync }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'chat' | 'groups'>('chat');
  const [searchQuery, setSearchQuery] = useState('');

  // Debug log for rendering and state changes
  useEffect(() => {
    console.log("ChatSyncInitial rendered, isModalOpen:", isModalOpen);
  }, [isModalOpen]);

  const handleSyncButtonClick = () => {
    console.log("Sync button clicked, setting modal to open");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    console.log("Modal close requested");
    setIsModalOpen(false);
  };

  const handleSync = (selectedFolders: string[], selectedChats: string[]) => {
    console.log("Syncing folders:", selectedFolders);
    console.log("Syncing chats:", selectedChats);
    // Here you would implement the actual syncing logic
    // After syncing is complete, you might want to redirect or show a success message
    
    if (onContinueWithoutSync) {
      onContinueWithoutSync();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Chat sync</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sync your Telegram chats with CRMT by choosing folders 
          that you want to track.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search groups / chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
        <button
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedType === 'chat'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          onClick={() => setSelectedType('chat')}
        >
          Chat
        </button>
        <button
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedType === 'groups'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          onClick={() => setSelectedType('groups')}
        >
          Groups
        </button>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
        {/* Sample chat items */}
        {['PLG | Harsh', 'PLG | Harsh', 'PLG | Harsh', 'PLG | Harsh', 'PLG | Harsh'].map((name, index) => (
          <div key={index} className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className={`w-6 h-6 rounded-full ${index % 2 === 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'} flex items-center justify-center mr-4`}>
              {index % 2 === 1 && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-gray-900 dark:text-white font-medium">{name}</span>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We don't have access to your messages. CRMT is a Telegram client
              which displays messages served from Telegram servers and use
              local cache to enable CRM functionality (like "unanswered"). Only
              synced chats appear in CRMT.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          className="px-5 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          onClick={onContinueWithoutSync}
        >
          Continue without sync
        </button>
        <button
          className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          onClick={handleSyncButtonClick}
        >
          Sync with CRMT
        </button>
      </div>

      <ChatSyncModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSync={handleSync}
      />
    </div>
  );
};

export default ChatSyncInitial; 