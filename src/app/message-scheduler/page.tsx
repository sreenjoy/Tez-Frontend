"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Mock data for contacts - in a real app, this would come from an API
const MOCK_CONTACTS = [
  { id: '1', name: 'John Smith', telegramId: '12345678', phone: '+1234567890', lastActive: '2 hours ago' },
  { id: '2', name: 'Sarah Johnson', telegramId: '23456789', phone: '+2345678901', lastActive: '5 hours ago' },
  { id: '3', name: 'Michael Brown', telegramId: '34567890', phone: '+3456789012', lastActive: '1 day ago' },
  { id: '4', name: 'Emily Davis', telegramId: '45678901', phone: '+4567890123', lastActive: '3 days ago' },
  { id: '5', name: 'David Wilson', telegramId: '56789012', phone: '+5678901234', lastActive: 'Just now' },
  { id: '6', name: 'Jessica Taylor', telegramId: '67890123', phone: '+6789012345', lastActive: '1 hour ago' },
  { id: '7', name: 'Daniel Martinez', telegramId: '78901234', phone: '+7890123456', lastActive: '2 days ago' },
  { id: '8', name: 'Sophia Anderson', telegramId: '89012345', phone: '+8901234567', lastActive: '4 hours ago' },
  { id: '9', name: 'Matthew Thomas', telegramId: '90123456', phone: '+9012345678', lastActive: '6 hours ago' },
  { id: '10', name: 'Olivia Jackson', telegramId: '01234567', phone: '+0123456789', lastActive: '1 week ago' },
];

// Mock data for existing campaigns
const MOCK_CAMPAIGNS = [
  { 
    id: '1', 
    name: 'Product Launch', 
    status: 'scheduled', 
    recipientCount: 45, 
    scheduledFor: '2023-11-20T14:00:00Z',
    message: 'Exciting news! Our new product launches next week. Be the first to know!',
    interval: 60 // seconds
  },
  { 
    id: '2', 
    name: 'Follow-up Campaign', 
    status: 'completed', 
    recipientCount: 32, 
    scheduledFor: '2023-11-15T09:00:00Z',
    message: 'Just checking in to see if you had any questions about our previous conversation.',
    interval: 120 // seconds
  },
];

export default function MessageSchedulerPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' or 'create'
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [interval, setInterval] = useState(60); // seconds
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState('12:00');

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  // Handle contact selection
  const toggleContactSelection = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  // Select/deselect all contacts
  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  // Format date for display
  const formatScheduleDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Create new campaign
  const handleCreateCampaign = () => {
    if (!campaignName || !messageText || selectedContacts.length === 0 || !scheduledDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Combine date and time
    const scheduledDateTime = new Date(scheduledDate);
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    scheduledDateTime.setHours(hours, minutes);

    // In a real app, you would send this to your backend
    const newCampaign = {
      id: `${campaigns.length + 1}`,
      name: campaignName,
      status: 'scheduled',
      recipientCount: selectedContacts.length,
      scheduledFor: scheduledDateTime.toISOString(),
      message: messageText,
      interval
    };

    setCampaigns([newCampaign, ...campaigns]);
    
    // Reset form and go back to campaigns list
    setCampaignName('');
    setMessageText('');
    setSelectedContacts([]);
    setScheduledDate(null);
    setInterval(60);
    setActiveTab('campaigns');

    // Show success message
    alert('Campaign scheduled successfully!');
  };

  // Delete campaign
  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'campaigns'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('create')}
        >
          Create Campaign
        </button>
      </div>

      {/* Campaigns List */}
      {activeTab === 'campaigns' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Scheduled Campaigns</h2>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              Create New Campaign
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Scheduled For
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Interval
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          campaign.status === 'scheduled'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {campaign.status === 'scheduled' ? 'Scheduled' : 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {campaign.recipientCount} contacts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(campaign.scheduledFor).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {campaign.interval} seconds
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No campaigns found. Create your first campaign!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Campaign Form */}
      {activeTab === 'create' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Create New Campaign</h2>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Campaign Name*
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  placeholder="Enter campaign name"
                />
              </div>

              {/* Scheduled Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date*
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    value={scheduledDate ? scheduledDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (dateValue) {
                        setScheduledDate(new Date(dateValue));
                      } else {
                        setScheduledDate(null);
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time*
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Message Interval */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Interval Between Messages (seconds)*
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="10"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value))}
                  className="w-full mr-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 w-16">{interval}s</span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Telegram has rate limits to prevent spam. A longer interval reduces the risk of being flagged.
              </p>
            </div>

            {/* Message Content */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message Content*
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                placeholder="Enter your message here..."
              ></textarea>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                <span>Supports plain text only</span>
                <span>{messageText.length} characters</span>
              </div>
            </div>
          </div>

          {/* Contact Selection */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Select Recipients*
              </h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="selectAll" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Select All
                </label>
              </div>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              />
            </div>

            {/* Contacts List */}
            <div className="max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
              {filteredContacts.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredContacts.map((contact) => (
                    <li key={contact.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => toggleContactSelection(contact.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{contact.phone}</p>
                        </div>
                        <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                          Last active: {contact.lastActive}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No contacts found matching your search.
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {selectedContacts.length} contacts selected
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveTab('campaigns')}
                className="mr-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={!campaignName || !messageText || selectedContacts.length === 0 || !scheduledDate}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm ${
                  !campaignName || !messageText || selectedContacts.length === 0 || !scheduledDate
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                Schedule Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 