'use client';

import { useState } from 'react';

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock inbox data
  const messages = [
    { id: 1, sender: 'John Doe', subject: 'GlobalTech Proposal', preview: 'I\'ve reviewed the proposal and have a few suggestions...', date: '2 hours ago', read: false },
    { id: 2, sender: 'Sarah Johnson', subject: 'Meeting Recap', preview: 'Here are the action items from our call today...', date: '5 hours ago', read: true },
    { id: 3, sender: 'Michael Smith', subject: 'Contract Review', preview: 'Please find attached the revised contract for EduLearn...', date: '1 day ago', read: true },
    { id: 4, sender: 'Lisa Garcia', subject: 'New Lead Opportunity', preview: 'We have a potential new client interested in our services...', date: '2 days ago', read: false },
    { id: 5, sender: 'David Wilson', subject: 'Sunshine Cafe Implementation', preview: 'The implementation is on track. We need to schedule a call to...', date: '3 days ago', read: true },
  ];
  
  const unreadCount = messages.filter(msg => !msg.read).length;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Inbox header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">Inbox</h2>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30">
              Compose
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'unread'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('unread')}
          >
            Unread <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">{unreadCount}</span>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'important'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('important')}
          >
            Important
          </button>
        </div>
      </div>
      
      {/* Message list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {messages
          .filter(msg => activeTab === 'all' || (activeTab === 'unread' && !msg.read))
          .map(message => (
            <div 
              key={message.id} 
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!message.read ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                  {message.sender.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className={`text-sm font-medium ${!message.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {message.sender}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{message.date}</span>
                  </div>
                  <p className={`text-sm truncate ${!message.read ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                    {message.subject}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {message.preview}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      
      {/* Empty state */}
      {messages.filter(msg => activeTab === 'all' || (activeTab === 'unread' && !msg.read)).length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No messages found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-md text-center mt-1">
            There are no messages in this category right now.
          </p>
        </div>
      )}
    </div>
  );
}
