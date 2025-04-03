import React, { useState } from 'react';

// Mock data for UI development
const MOCK_CHAT_FOLDERS = [
  { id: 'folder1', name: 'Work', count: 12 },
  { id: 'folder2', name: 'Family', count: 5 },
  { id: 'folder3', name: 'Friends', count: 8 },
  { id: 'folder4', name: 'Projects', count: 3 },
  { id: 'folder5', name: 'Important', count: 7 },
  { id: 'folder6', name: 'Archive', count: 15 },
  { id: 'folder7', name: 'Personal', count: 4 },
];

const MOCK_CHATS = [
  { id: 'chat1', name: 'PLG | Harsh', isGroup: false, lastActive: '2h ago' },
  { id: 'chat2', name: 'Marketing Team', isGroup: true, lastActive: '1d ago' },
  { id: 'chat3', name: 'John Doe', isGroup: false, lastActive: '5m ago' },
  { id: 'chat4', name: 'Project Alpha', isGroup: true, lastActive: '3d ago' },
  { id: 'chat5', name: 'Sarah Connor', isGroup: false, lastActive: '1h ago' },
  { id: 'chat6', name: 'Tech Support', isGroup: true, lastActive: '2d ago' },
  { id: 'chat7', name: 'Jane Smith', isGroup: false, lastActive: '30m ago' },
  { id: 'chat8', name: 'Design Team', isGroup: true, lastActive: '4h ago' },
  { id: 'chat9', name: 'Alex Johnson', isGroup: false, lastActive: '2d ago' },
  { id: 'chat10', name: 'Product Discussion', isGroup: true, lastActive: '1w ago' },
  { id: 'chat11', name: 'Customer Support', isGroup: true, lastActive: '6h ago' },
  { id: 'chat12', name: 'David Miller', isGroup: false, lastActive: '3h ago' },
];

interface ChatSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSync: (folders: string[], chats: string[]) => void;
}

const ChatSyncModal: React.FC<ChatSyncModalProps> = ({ isOpen, onClose, onSync }) => {
  const [selectedTab, setSelectedTab] = useState<'chat' | 'group'>('chat');
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [folderSearchQuery, setFolderSearchQuery] = useState('');
  
  const filteredChats = MOCK_CHATS.filter(chat => 
    searchQuery === '' || 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFolders = MOCK_CHAT_FOLDERS.filter(folder => 
    folderSearchQuery === '' || 
    folder.name.toLowerCase().includes(folderSearchQuery.toLowerCase())
  );
  
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolders(prev => {
      if (prev.includes(folderId)) {
        return prev.filter(id => id !== folderId);
      } else {
        return [...prev, folderId];
      }
    });
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChats(prev => {
      if (prev.includes(chatId)) {
        return prev.filter(id => id !== chatId);
      } else {
        return [...prev, chatId];
      }
    });
  };
  
  const handleSync = () => {
    onSync(selectedFolders, selectedChats);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sync Telegram Chats
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Select chat folders or individual chats to sync with CRMT. Synced chats will appear in your pipeline.
          </p>
          
          {/* Tabs for Chat/Groups */}
          <div className="mb-4 flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`border-b-2 px-4 py-2 text-sm font-medium ${
                selectedTab === 'chat'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setSelectedTab('chat')}
            >
              Chat
            </button>
            <button
              className={`border-b-2 px-4 py-2 text-sm font-medium ${
                selectedTab === 'group'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setSelectedTab('group')}
            >
              Groups
            </button>
          </div>
          
          {selectedTab === 'chat' ? (
            <>
              {/* Search for individual chats */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Individual chats list - Fixed height to fit 5 items */}
              <div className="h-[300px] overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                {filteredChats.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-4 text-center text-gray-500 dark:text-gray-400">
                    No chats found matching your search
                  </div>
                ) : (
                  filteredChats.map(chat => (
                    <div 
                      key={chat.id}
                      className="flex cursor-pointer items-center border-b border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 last:border-b-0"
                      onClick={() => handleChatSelect(chat.id)}
                    >
                      <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                        selectedChats.includes(chat.id) 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-700'
                      }`}>
                        {selectedChats.includes(chat.id) && (
                          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                        {chat.name.charAt(0)}
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {chat.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {chat.isGroup ? 'Group' : 'Contact'} • {chat.lastActive}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              {/* Search for folders */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search folders..."
                    value={folderSearchQuery}
                    onChange={(e) => setFolderSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Folder selection - Same fixed height as chat list */}
              <div className="h-[300px] overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
                {filteredFolders.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-4 text-center text-gray-500 dark:text-gray-400">
                    No folders found matching your search
                  </div>
                ) : (
                  filteredFolders.map(folder => (
                    <div 
                      key={folder.id}
                      className="flex cursor-pointer items-center border-b border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 last:border-b-0"
                      onClick={() => handleFolderSelect(folder.id)}
                    >
                      <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                        selectedFolders.includes(folder.id) 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-700'
                      }`}>
                        {selectedFolders.includes(folder.id) && (
                          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {folder.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Folder • {folder.count} chats
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
          
          {/* Summary and Action buttons */}
          <div className="mt-5 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
            <div>
              {selectedFolders.length > 0 || selectedChats.length > 0 ? (
                <span>
                  Selected: {selectedFolders.length > 0 && `${selectedFolders.length} folders`}
                  {selectedFolders.length > 0 && selectedChats.length > 0 && ' and '}
                  {selectedChats.length > 0 && `${selectedChats.length} chats`}
                </span>
              ) : (
                <span>No items selected</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleSync}
                disabled={selectedFolders.length === 0 && selectedChats.length === 0}
                className={`rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white ${
                  selectedFolders.length === 0 && selectedChats.length === 0
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-blue-700'
                }`}
              >
                Sync Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSyncModal; 