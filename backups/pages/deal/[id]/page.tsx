"use client"

import { useState, useRef, useEffect } from 'react'
import AppLayout from '../../../components/layout/AppLayout'
import Link from 'next/link'

// SVG Icons
const ChevronLeftIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const SendIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

const AttachmentIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

const InfoIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

const EditIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="5" y2="19" />
    <line x1="5" x2="19" y1="12" y2="12" />
  </svg>
)

// Add a clock icon for scheduling
const ClockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

// Add new gradient icon - used in Telegram
const GradientIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="url(#paint0_linear)" />
    <defs>
      <linearGradient id="paint0_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4776E6" />
        <stop offset="1" stopColor="#8E54E9" />
      </linearGradient>
    </defs>
  </svg>
)

// Add reply icon for Telegram style
const ReplyIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 17l-5-5 5-5" />
    <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
)

// Add DeleteIcon for message options
const DeleteIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
)

const ForwardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 17l5-5-5-5" />
    <path d="M4 18v-2a4 4 0 014-4h12" />
  </svg>
)

// Add CopyTextIcon for message options
const CopyTextIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

const PinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L12 22" />
    <path d="M12 8C14.2091 8 16 6.20914 16 4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4C8 6.20914 9.79086 8 12 8Z" />
    <path d="M12 22C13.6569 22 15 20.6569 15 19C15 17.3431 13.6569 16 12 16C10.3431 16 9 17.3431 9 19C9 20.6569 10.3431 22 12 22Z" />
  </svg>
)

const SelectIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V16" />
    <path d="M9 15L15 9" />
    <path d="M14 9H15C16.1046 9 17 8.10457 17 7V5C17 3.89543 16.1046 3 15 3H13C11.8954 3 11 3.89543 11 5V6" />
  </svg>
)

// Add cross icon for removing items
const CrossIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
)

// Add these new icons for the value trend indicators
const TrendUpIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 7l-10 10M7 7h10v10" />
  </svg>
)

const TrendDownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17l10-10M17 17H7V7" />
  </svg>
)

const DurationIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

// Mock data for the deal
const dealData = {
  id: '123456',
  name: 'Acme Corp Website Redesign',
  company: 'Acme Corporation',
  stage: 'Negotiation',
  leadStage: 'Hot', 
  priority: 'High',
  value: 8500,
  valueTrend: 'up', // Add value trend: 'up', 'down', or 'stable'
  previousValue: 8000, // Previous value for comparison
  daysInCurrentStage: 12, // Days in current stage
  lastActivity: 'October 10, 2024',
  owner: 'Porag Chakma',
  tags: ['Wifey material', 'ENOC', 'High Value', 'Enterprise', 'Follow Up', 'Urgent'],
  stageDetails: 'Empty',
  teamMembers: [
    { id: 'tm1', name: 'Patrick Collison', avatarInitial: 'P', color: 'from-purple-500 to-indigo-600' },
    { id: 'tm2', name: 'Ashley Smith', avatarInitial: 'A', color: 'from-pink-500 to-rose-600' },
    { id: 'tm3', name: 'Tim Apple', avatarInitial: 'T', color: 'from-amber-500 to-orange-600' }
  ],
  contacts: [
    { id: 'c1', name: 'John Doe', position: 'CEO, Acme Corp', avatarInitial: 'J' },
    { id: 'c2', name: 'Jane Smith', position: 'CTO, Acme Corp', avatarInitial: 'J' }
  ],
  // Add a list of all people in the chat (combination of team members and contacts)
  chatParticipants: [
    { id: 'p1', name: 'Patrick Collison', avatarInitial: 'P', color: 'from-purple-500 to-indigo-600', role: 'Sales Rep', isTeamMember: true, lastActive: '2 min ago' },
    { id: 'p2', name: 'Ashley Smith', avatarInitial: 'A', color: 'from-pink-500 to-rose-600', role: 'Account Manager', isTeamMember: true, lastActive: '15 min ago' },
    { id: 'p3', name: 'Tim Apple', avatarInitial: 'T', color: 'from-amber-500 to-orange-600', role: 'Product Specialist', isTeamMember: true, lastActive: '1 hour ago' },
    { id: 'p4', name: 'John Doe', avatarInitial: 'J', color: 'from-gray-500 to-gray-600', role: 'CEO, Acme Corp', isTeamMember: false, lastActive: '3 hours ago' },
    { id: 'p5', name: 'Jane Smith', avatarInitial: 'J', color: 'from-teal-500 to-teal-600', role: 'CTO, Acme Corp', isTeamMember: false, lastActive: '2 hours ago' },
    { id: 'p6', name: 'Robert Johnson', avatarInitial: 'R', color: 'from-blue-500 to-blue-600', role: 'Developer, Acme Corp', isTeamMember: false, lastActive: '1 day ago' }
  ],
  tasks: [
    { id: 't1', title: 'Send proposal draft', status: 'completed', dueDate: 'Apr 10, 2023' },
    { id: 't2', title: 'Schedule follow-up call', status: 'upcoming', dueDate: 'Apr 15, 2023' },
    { id: 't3', title: 'Prepare contract', status: 'pending', dueDate: 'Apr 20, 2023' }
  ]
};

// Mock chat messages
const initialMessages: Message[] = [
  {
    id: 'm1',
    sender: 'John Doe',
    text: 'Hey team, I just reviewed the proposal you sent. It looks great overall, but I have a few questions about the timeline and budget.',
    timestamp: '3 hours ago',
    avatarInitial: 'J',
    isContact: true,
    replyTo: null,
    reactions: [
      { emoji: '👍', count: 2, userReacted: true },
      { emoji: '❤️', count: 1, userReacted: false }
    ]
  },
  {
    id: 'm2',
    sender: 'Patrick Collison',
    text: 'Thanks for the feedback, John! We can definitely clarify those points. For the timeline, we\'re flexible with the milestones but want to ensure delivery by end of Q2. As for the budget, we can break it down further if that helps.',
    timestamp: '2.5 hours ago',
    avatarInitial: 'P',
    isContact: false,
    replyTo: null
  },
  {
    id: 'm3',
    sender: 'Jane Smith',
    text: 'I\'m particularly interested in the technical specifications. Can you provide more details about the hosting requirements and expected traffic?',
    timestamp: '2 hours ago',
    avatarInitial: 'J',
    isContact: true,
    replyTo: null,
    reactions: [
      { emoji: '🔥', count: 1, userReacted: true }
    ]
  }
];

// Add interface for emoji reactions
interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

// Update Message interface to include reactions
interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  avatarInitial: string;
  isContact: boolean;
  replyTo?: string | null;
  reactions?: Reaction[];
}

// Format timestamp to show actual time in user's timezone with AM/PM - fixed for SSR
const formatMessageTime = (timestamp: string): string => {
  // For timestamps that are already in "just now" format, keep them as is
  if (timestamp === 'just now') return timestamp;
  
  // For demo messages, replace relative time strings with fixed time strings
  // Using fixed strings with AM/PM to avoid hydration errors
  if (timestamp.includes('3 hours ago')) {
    return '11:30 AM';
  } else if (timestamp.includes('2.5 hours ago')) {
    return '12:00 PM';
  } else if (timestamp.includes('2 hours ago')) {
    return '12:30 PM';
  } else if (timestamp.includes('minutes ago')) {
    return '01:00 PM';
  }
  
  // Default fallback
  return '02:00 PM';
};

// Add new icons for the deal details
const TagIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const NextActionIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const FunnelIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
)

const PriorityIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const LinkIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
)

const CategoryIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

// Lead stage emoji mapping
const getLeadStageEmoji = (stage: string) => {
  switch(stage) {
    case 'Hot':
      return '🔥'; // Fire emoji
    case 'Warm':
      return '🌡️'; // Thermometer emoji
    case 'Cold':
      return '❄️'; // Snowflake emoji
    case 'Dormant':
      return '💤'; // Sleeping emoji
    default:
      return '';
  }
};

// Get lead stage description for hover text
const getLeadStageDescription = (stage: string) => {
  return `${stage} Lead`;
};

// Archive icon
const ArchiveIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
)

// Stage icon
const StageIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// ChevronDown icon
const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// Create DealHeaderInfo component to display in the header
const DealHeaderInfo = ({ dealData }) => {
  return (
    <div className="flex items-center space-x-6">
      {/* Deal Value with trend indicator */}
      <div className="flex items-center bg-[#1a2335] px-4 py-2 rounded-md">
        <span className="text-sm text-gray-400 mr-2">Value:</span>
        <span className="text-base font-semibold text-white">${dealData.value.toLocaleString()}</span>
        {dealData.valueTrend === 'up' && (
          <span className="ml-1 text-green-400 flex items-center">
            <TrendUpIcon className="w-4 h-4" />
          </span>
        )}
        {dealData.valueTrend === 'down' && (
          <span className="ml-1 text-red-400 flex items-center">
            <TrendDownIcon className="w-4 h-4" />
          </span>
        )}
      </div>
      
      {/* Days in current stage */}
      <div className="flex items-center bg-[#291e3a] px-4 py-2 rounded-md">
        <DurationIcon className="w-4 h-4 text-purple-400 mr-2" />
        <span className="text-sm text-white">
          <span className="font-semibold">{dealData.daysInCurrentStage}</span> days in {dealData.stage}
        </span>
      </div>
    </div>
  );
};

export default function DealPage({ params }: { params: { id: string } }) {
  // State management
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // New state for message scheduling
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // State for context menu
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    messageId: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    messageId: ''
  });

  // State for editing owner
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  
  // State for editing tags
  const [isEditingTags, setIsEditingTags] = useState(false);
  
  // State for editing team member status
  const [chatParticipants, setChatParticipants] = useState(dealData.chatParticipants);

  // State for priority dropdown
  const [isOpenPriorityDropdown, setIsOpenPriorityDropdown] = useState(false);
  const [priority, setPriority] = useState(dealData.priority);

  // State for tags popup
  const [showAllTags, setShowAllTags] = useState(false);
  
  // Toggle all tags popup
  const toggleAllTags = () => {
    setShowAllTags(!showAllTags);
  };
  
  // Get tag color based on tag content
  const getTagColor = (tag: string) => {
    const colors = [
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30',
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/30',
      'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30',
      'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30',
      'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800/30',
      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30',
    ];
    
    // Create a simple hash based on the tag string
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  // Function to toggle team member status
  const toggleTeamMemberStatus = (participantId: string) => {
    setChatParticipants(prevParticipants => 
      prevParticipants.map(participant => 
        participant.id === participantId 
          ? { ...participant, isTeamMember: !participant.isTeamMember }
          : participant
      )
    );
  };
  
  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };
    
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Auto-scroll to bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Format date for display
  const formatScheduleDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Toggle schedule modal
  const toggleScheduleModal = () => {
    // Set default scheduled date to tomorrow
    if (!scheduledDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(tomorrow);
    }
    
    setIsScheduleModalOpen(!isScheduleModalOpen);
  };
  
  // Send message handler
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMessageObj = {
      id: `m${messages.length + 1}`,
      sender: 'Patrick Collison', // Current user
      text: newMessage,
      timestamp: 'just now', // Use static string
      avatarInitial: 'P',
      isContact: false,
      replyTo: replyingTo
    };
    
    setMessages([...messages, newMessageObj]);
    setNewMessage('');
    setReplyingTo(null);
  };
  
  // Handle reply to message
  const handleReplyToMessage = (messageId: string) => {
    setReplyingTo(messageId);
  };
  
  // Schedule message handler
  const handleScheduleMessage = () => {
    if (!newMessage.trim() || !scheduledDate) return;
    
    // In a real app, you would send this to your backend
    // For demo purposes, we'll just show an alert
    const formattedDate = formatScheduleDate(scheduledDate);
    alert(`Message scheduled for ${formattedDate} at ${scheduledTime}:\n\n${newMessage}`);
    
    // Close modal and clear message
    setIsScheduleModalOpen(false);
    setNewMessage('');
    setReplyingTo(null);
  };
  
  // Handle send on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Find message by ID
  const findMessageById = (id: string) => {
    return messages.find(message => message.id === id);
  };
  
  // Header back button component
  const headerBackButton = (
    <Link href="/pipeline" className="flex items-center font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
      <ChevronLeftIcon className="w-5 h-5 mr-1" />
      <span>Back to Pipeline</span>
    </Link>
  );
  
  // Header actions (empty to remove buttons from header)
  const headerActions = null;

  // Header right components - where we'll add the Deal Value and Days in Stage
  const headerRightComponents = (
    <DealHeaderInfo dealData={dealData} />
  );
  
  // Handle message right-click to show context menu
  const handleMessageContextMenu = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      messageId
    });
  };
  
  // Handle adding reaction to message
  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId) {
          const existingReactions = message.reactions || [];
          const existingReactionIndex = existingReactions.findIndex(r => r.emoji === emoji);
          
          let updatedReactions;
          
          if (existingReactionIndex >= 0) {
            const reaction = existingReactions[existingReactionIndex];
            // Toggle user reaction
            if (reaction.userReacted) {
              // Remove reaction if count is 1
              if (reaction.count === 1) {
                updatedReactions = existingReactions.filter(r => r.emoji !== emoji);
              } else {
                // Decrease count
                updatedReactions = existingReactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, count: r.count - 1, userReacted: false } 
                    : r
                );
              }
            } else {
              // Increase count and mark as reacted
              updatedReactions = existingReactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, userReacted: true } 
                  : r
              );
            }
          } else {
            // Add new reaction
            updatedReactions = [
              ...existingReactions,
              { emoji, count: 1, userReacted: true }
            ];
          }
          
          return {
            ...message,
            reactions: updatedReactions
          };
        }
        return message;
      })
    );
    
    // Close context menu
    setContextMenu(prev => ({ ...prev, visible: false }));
  };
  
  // Handle copy text
  const handleCopyText = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      navigator.clipboard.writeText(message.text);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  };
  
  // Get the active message from context menu
  const activeMessage = contextMenu.messageId 
    ? messages.find(m => m.id === contextMenu.messageId) 
    : null;
  
  const handleEditOwner = () => {
    setIsEditingOwner(true);
  };
  
  const handleCloseOwnerEdit = () => {
    setIsEditingOwner(false);
  };
  
  const handleEditTags = () => {
    setIsEditingTags(true);
  };
  
  const handleCloseTagsEdit = () => {
    setIsEditingTags(false);
  };
  
  const handleRemoveTags = () => {
    // Placeholder for removing tags functionality
    alert("Tags would be removed - this is a placeholder action");
  };
  
  // Toggle priority dropdown
  const togglePriorityDropdown = () => {
    setIsOpenPriorityDropdown(!isOpenPriorityDropdown);
  };

  // Update priority
  const updatePriority = (newPriority: string) => {
    setPriority(newPriority);
    setIsOpenPriorityDropdown(false);
  };

  // Handle move to next stage
  const handleMoveToNextStage = () => {
    // In a real implementation, this would update the stage in the database
    alert("Deal would move to the next stage");
  };

  // Handle archive
  const handleArchive = () => {
    // In a real implementation, this would move the deal to archive
    alert("Deal would be archived");
  };
  
  return (
    <AppLayout
      headerTitle={headerBackButton}
      headerActionComponent={headerActions}
      headerSearchComponent={headerRightComponents}
    >
      <div className="h-full flex flex-col lg:flex-row">
        {/* Main chat area - 60% on large screens */}
        <div className="flex-grow lg:w-3/5 flex flex-col h-full border-r border-gray-200 dark:border-gray-700">
          {/* Deal header - with lead stage emoji and action buttons */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex flex-col space-y-3">
              {/* Top row: Deal name and lead stage */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dealData.name}
                  </h1>
                  {/* Lead stage indicator with emoji */}
                  <div className="relative ml-2 cursor-pointer group">
                    <span className="text-xl" aria-label={getLeadStageDescription(dealData.leadStage)}>
                      {getLeadStageEmoji(dealData.leadStage)}
                    </span>
                    <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      {getLeadStageDescription(dealData.leadStage)}
                    </span>
                  </div>
                </div>
                
                {/* Action buttons in the right corner */}
                <div className="flex items-center space-x-2">
                  {/* Priority dropdown */}
                  <div className="relative">
                    <button 
                      onClick={togglePriorityDropdown}
                      className={`flex items-center px-3 py-1.5 rounded text-sm font-medium ${
                        priority === 'High' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : priority === 'Medium' 
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      <PriorityIcon className="w-4 h-4 mr-1.5" />
                      {priority}
                      <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </button>
                    
                    {isOpenPriorityDropdown && (
                      <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                        <ul className="py-1">
                          <li 
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-sm text-red-700 dark:text-red-400"
                            onClick={() => updatePriority('High')}
                          >
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            High
                          </li>
                          <li 
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-sm text-yellow-700 dark:text-yellow-400"
                            onClick={() => updatePriority('Medium')}
                          >
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            Medium
                          </li>
                          <li 
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center text-sm text-blue-700 dark:text-blue-400"
                            onClick={() => updatePriority('Low')}
                          >
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Low
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Move to Next Stage button */}
                  <button 
                    onClick={handleMoveToNextStage}
                    className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50"
                  >
                    <StageIcon className="w-4 h-4 mr-1.5" />
                    Move to Next Stage
                  </button>
                  
                  {/* Archive button */}
                  <div className="relative group">
                    <button 
                      onClick={handleArchive}
                      className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <ArchiveIcon className="w-5 h-5" />
                    </button>
                    <span className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      Archive
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat messages - Telegram style with dark mode support */}
          <div className="flex-grow overflow-y-auto bg-[#e6ebee] dark:bg-gray-900" 
            style={{
              backgroundImage: "var(--bg-pattern)",
              backgroundSize: "cover",
              backgroundRepeat: "repeat"
            }}>
            {/* Add custom CSS variable for background pattern */}
            <style jsx global>{`
              :root {
                --bg-pattern: url('https://raw.githubusercontent.com/telegramdesktop/tdesktop/dev/Telegram/Resources/art/bg_initial.jpg');
              }
              
              .dark {
                --bg-pattern: url('https://raw.githubusercontent.com/telegramdesktop/tdesktop/dev/Telegram/Resources/art/bg_pattern_dark.png');
              }
            `}</style>
            
            <div className="p-4 space-y-4">
              {/* Date divider */}
              <div className="flex justify-center">
                <div className="px-3 py-1 rounded-lg bg-white/80 dark:bg-gray-800/80 text-xs text-gray-600 dark:text-gray-400">
                  October 3, 2024
                </div>
              </div>
              
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col group">
                  {/* Reply info if present */}
                  {message.replyTo && (
                    <div className={`ml-12 mb-1 border-l-2 border-gray-400 pl-2 text-xs text-gray-600 dark:text-gray-400 ${message.isContact ? 'mr-12' : 'mr-auto'}`}>
                      <p className="font-semibold">{findMessageById(message.replyTo)?.sender || 'Unknown'}</p>
                      <p className="truncate">{findMessageById(message.replyTo)?.text.substring(0, 50) || 'Message not found'}</p>
                    </div>
                  )}
                  
                  <div className={`flex ${message.isContact ? 'justify-start' : 'justify-end'}`}>
                    {/* Avatar - only show for contact messages */}
                    {message.isContact && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center text-white text-sm mt-1">
                        {message.avatarInitial}
                      </div>
                    )}
                    
                    <div className={`relative max-w-[80%] group ${message.isContact ? 'ml-2' : 'mr-0'}`}>
                      {/* Sender name */}
                      {message.isContact && (
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 ml-2">
                          {message.sender}
                        </div>
                      )}
                      
                      {/* Message bubble */}
                      <div 
                        className={`px-3 py-2 rounded-lg ${
                          message.isContact 
                            ? 'bg-white dark:bg-gray-800 rounded-tl-none' 
                            : 'bg-[#ddfade] dark:bg-blue-900/30 rounded-tr-none'
                        }`}
                        onContextMenu={(e) => handleMessageContextMenu(e, message.id)}
                      >
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                          {message.text}
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatMessageTime(message.timestamp)}
                        </div>
                      </div>
                      
                      {/* Reactions display */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className={`flex mt-1 space-x-1 ${message.isContact ? 'justify-start ml-2' : 'justify-end mr-2'}`}>
                          {message.reactions.map((reaction, index) => (
                            <button 
                              key={index}
                              onClick={() => handleReaction(message.id, reaction.emoji)}
                              className={`text-xs rounded-full px-1.5 py-0.5 ${
                                reaction.userReacted 
                                  ? 'bg-blue-100 dark:bg-blue-900/30' 
                                  : 'bg-gray-100 dark:bg-gray-800'
                              }`}
                            >
                              <span>{reaction.emoji}</span>
                              {reaction.count > 1 && <span className="ml-1">{reaction.count}</span>}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Message actions on hover */}
                      <div className="absolute top-0 right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => handleReplyToMessage(message.id)}
                          className="p-1 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ReplyIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message input - Telegram style */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            {/* Reply indicator */}
            {replyingTo && (
              <div className="flex items-center justify-between mb-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-1 h-8 bg-blue-500 rounded-full mr-2"></div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {findMessageById(replyingTo)?.sender}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[300px]">
                      {findMessageById(replyingTo)?.text.substring(0, 50)}
                      {(findMessageById(replyingTo)?.text.length || 0) > 50 ? '...' : ''}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          
            <div className="flex items-end">
              <div className="flex-grow">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-3xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 min-h-[48px] max-h-[150px]"
                  placeholder="Type your message..."
                  rows={1}
                />
              </div>
              <div className="flex items-center ml-3">
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-2">
                  <AttachmentIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={toggleScheduleModal}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-2 relative group"
                  disabled={!newMessage.trim()}
                >
                  <ClockIcon className={`w-5 h-5 ${!newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''}`} />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Schedule for later
                  </span>
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    newMessage.trim()
                      ? 'bg-[#54b3e3] hover:bg-[#4a9fd3] text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right sidebar with details - 40% on large screens */}
        <div className="w-full lg:w-2/5 flex-shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          {/* Tabs at the top of right section */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === 'notes'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === 'tasks'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab('people')}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === 'people'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                People
              </button>
            </div>
          </div>
          
          {/* Tab content based on activeTab */}
          <div className="p-5">
            {activeTab === 'overview' && (
              <div>
                {/* Overview tab content */}
                <div className="space-y-6">
                  {/* Best Time to Respond - NEW SECTION */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Best Time to Respond</h3>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                        High Response Rate
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        9:00 AM - 11:00 AM
                      </div>
                      <button 
                        onClick={() => {
                          setNewMessage(prevMessage => prevMessage || "Hi team, I wanted to follow up on our previous discussion.");
                          const optimalTime = new Date();
                          optimalTime.setHours(9, 30, 0); // Set to 9:30 AM
                          optimalTime.setDate(optimalTime.getDate() + (optimalTime.getHours() >= 11 ? 1 : 0)); // Tomorrow if it's past 11 AM
                          setScheduledDate(optimalTime);
                          setScheduledTime('09:30');
                          setIsScheduleModalOpen(true);
                        }}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        <ClockIcon className="w-4 h-4 mr-1.5" />
                        Schedule for Optimal Time
                      </button>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Messages sent during this timeframe receive responses 3x faster on average.
                    </p>
                  </div>
                  
                  {/* Add In Chat section above Deal Details */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-3">
                      <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      In Chat
                    </h3>
                    <div className="flex -space-x-2 mb-2">
                      {dealData.teamMembers.map(member => (
                        <div 
                          key={member.id}
                          className={`w-8 h-8 rounded-full bg-gradient-to-tr ${member.color} flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white dark:ring-gray-800 relative group cursor-pointer`}
                        >
                          <span>{member.avatarInitial}</span>
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                            {member.name}
                          </span>
                        </div>
                      ))}
                      <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs ring-2 ring-white dark:ring-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600">
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Deal details - updated as requested */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-3">
                      <InfoIcon className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                      Deal Details
                    </h3>
                    <div className="space-y-3">
                      {/* Last Activity - moved above owner */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Last Activity</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{dealData.lastActivity}</span>
                      </div>
                      
                      {/* Current Stage - added after Last Activity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <StageIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Current Stage</span>
                        </div>
                        <span className="text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded">
                          {dealData.stage}
                        </span>
                      </div>
                      
                      {/* Owner - with edit button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Owner</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-amber-100 overflow-hidden mr-2 flex items-center justify-center">
                            <img src="https://placekitten.com/100/100" alt="Owner" className="object-cover" 
                                 onError={(e) => { 
                                   e.currentTarget.src = '';
                                   e.currentTarget.parentElement?.classList.add('bg-amber-400');
                                 }} />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">{dealData.owner}</span>
                          <button 
                            onClick={handleEditOwner}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Tags - with only edit button (removed cross button) */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TagIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Tags</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex flex-wrap justify-end gap-1 mr-2">
                            {dealData.tags.length > 3 && (
                              <button 
                                onClick={toggleAllTags}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                +{dealData.tags.length - 3}
                              </button>
                            )}
                            {dealData.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index} 
                                className={`px-2 py-1 text-xs font-medium rounded border ${getTagColor(tag)}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button 
                            onClick={handleEditTags}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* All tags popup */}
                      {showAllTags && (
                        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="all-tags-modal">
                          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={toggleAllTags}>
                              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                                  All Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {dealData.tags.map((tag, index) => (
                                    <span 
                                      key={index} 
                                      className={`px-2.5 py-1.5 text-sm font-medium rounded border ${getTagColor(tag)}`}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button 
                                  type="button" 
                                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                  onClick={toggleAllTags}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Add a property button */}
                      <button className="w-full flex items-center justify-center py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mt-2">
                        <PlusIcon className="w-4 h-4 mr-1.5" />
                        Add a property
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div>
                {/* Notes tab content */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-3">
                    <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Notes
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Client call - Oct 5
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Discussed potential increase in project scope. Client interested in adding mobile app development to the original web redesign.
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Added by Patrick
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <EditIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Budget considerations
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Client has a maximum budget of $10k. Need to adjust proposal to fit within constraints while meeting key requirements.
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Added by Tim
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <EditIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mt-2">
                      <PlusIcon className="w-4 h-4 mr-1.5" />
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'tasks' && (
              <div>
                {/* Tasks tab content */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-3">
                    <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                    Tasks
                  </h3>
                  
                  <div className="space-y-2">
                    {dealData.tasks.map(task => (
                      <div 
                        key={task.id}
                        className={`p-3 rounded-md border ${
                          task.status === 'completed'
                            ? 'border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10'
                            : task.status === 'upcoming'
                              ? 'border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <input 
                              type="checkbox" 
                              checked={task.status === 'completed'}
                              className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                              readOnly
                            />
                            <div className="ml-2">
                              <p className={`text-sm font-medium ${
                                task.status === 'completed'
                                  ? 'text-gray-500 dark:text-gray-400 line-through'
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {task.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Due: {task.dueDate}
                              </p>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <EditIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full flex items-center justify-center py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <PlusIcon className="w-4 h-4 mr-1.5" />
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'activity' && (
              <div>
                {/* Activity tab content */}
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-3">
                  Activity Log
                </h3>
                <div className="space-y-4">
                  <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 pb-5 relative">
                    <div className="absolute w-2 h-2 rounded-full bg-blue-600 left-[-4.5px] top-1.5"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Task completed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Send proposal draft</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Today, 10:23 AM</p>
                  </div>
                  
                  <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 pb-5 relative">
                    <div className="absolute w-2 h-2 rounded-full bg-green-600 left-[-4.5px] top-1.5"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Deal stage updated</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Changed from Qualified to Negotiation</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday, 2:34 PM</p>
                  </div>
                  
                  <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 pb-5 relative">
                    <div className="absolute w-2 h-2 rounded-full bg-purple-600 left-[-4.5px] top-1.5"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Contact added</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Jane Smith (CTO, Acme Corp)</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">April 15, 2023</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'templates' && (
              <div>
                {/* Templates tab content */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center mb-3">
                    <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="15" y1="3" x2="15" y2="21"></line>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="3" y1="15" x2="21" y2="15"></line>
                    </svg>
                    Message Templates
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Follow-up - No response
                        </p>
                        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                          Use
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Hi [Name], I wanted to follow up on our previous conversation. I haven't heard back and was wondering if you had any questions about our proposal?
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Meeting confirmation
                        </p>
                        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                          Use
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Hi [Name], I'm looking forward to our meeting on [Date] at [Time]. I'll send a calendar invite shortly. Please let me know if you need to reschedule.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Proposal submission
                        </p>
                        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                          Use
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Hi [Name], I've attached our proposal for the [Project Name]. Please review at your convenience and let me know if you have any questions or require clarification.
                      </p>
                    </div>

                    <button className="w-full flex items-center justify-center py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mt-2">
                      <PlusIcon className="w-4 h-4 mr-1.5" />
                      Add Template
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'people' && (
              <div>
                {/* People tab content */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      Chat Participants
                    </h3>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
                      {chatParticipants.length} people
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Team section */}
                    <div className="mb-4">
                      <h4 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-2">Team Members</h4>
                      <div className="space-y-2">
                        {chatParticipants.filter(p => p.isTeamMember).map(person => (
                          <div key={person.id} className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${person.color} flex items-center justify-center text-white text-sm font-semibold mr-3`}>
                                <span>{person.avatarInitial}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{person.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{person.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400 mr-3">{person.lastActive}</span>
                              <button 
                                onClick={() => toggleTeamMemberStatus(person.id)}
                                className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md"
                              >
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Contacts/non-team section */}
                    <div>
                      <h4 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-2">Other Participants</h4>
                      <div className="space-y-2">
                        {chatParticipants.filter(p => !p.isTeamMember).map(person => (
                          <div key={person.id} className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${person.color} flex items-center justify-center text-white text-sm font-semibold mr-3`}>
                                <span>{person.avatarInitial}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{person.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{person.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400 mr-3">{person.lastActive}</span>
                              <button 
                                onClick={() => toggleTeamMemberStatus(person.id)}
                                className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                              >
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 5v14M5 12h14" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-3">
                      <button className="w-full flex items-center justify-center py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <PlusIcon className="w-4 h-4 mr-1.5" />
                        Add Person
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Message Context Menu - Telegram style */}
      {contextMenu.visible && (
        <div 
          className="fixed z-50 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{ 
            top: `${contextMenu.y}px`, 
            left: `${contextMenu.x}px`,
            transform: 'translate(-50%, -100%)'
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Emoji reactions */}
          <div className="px-2 py-3 flex justify-around border-b border-gray-200 dark:border-gray-700">
            {['👍', '👎', '❤️', '🔥', '😊', '👏', '😮'].map(emoji => (
              <button 
                key={emoji}
                className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                onClick={() => handleReaction(contextMenu.messageId, emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          
          {/* Actions */}
          <div className="py-1">
            <button 
              className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
              onClick={() => {
                handleReplyToMessage(contextMenu.messageId);
                setContextMenu(prev => ({ ...prev, visible: false }));
              }}
            >
              <ReplyIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-800 dark:text-gray-200">Reply</span>
            </button>
            
            <button 
              className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
              onClick={() => handleCopyText(contextMenu.messageId)}
            >
              <CopyTextIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-800 dark:text-gray-200">Copy Text</span>
            </button>
            
            <button 
              className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
              onClick={() => setContextMenu(prev => ({ ...prev, visible: false }))}
            >
              <ForwardIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-800 dark:text-gray-200">Forward</span>
            </button>
            
            <button 
              className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
              onClick={() => setContextMenu(prev => ({ ...prev, visible: false }))}
            >
              <PinIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-800 dark:text-gray-200">Pin</span>
            </button>
            
            <button 
              className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
              onClick={() => setContextMenu(prev => ({ ...prev, visible: false }))}
            >
              <SelectIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-800 dark:text-gray-200">Select</span>
            </button>
            
            {/* Delete button with different styling */}
            <button 
              className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
              onClick={() => setContextMenu(prev => ({ ...prev, visible: false }))}
            >
              <DeleteIcon className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-500">Delete</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Schedule Message Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedule Message
              </h3>
              <button 
                onClick={toggleScheduleModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message Preview
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm max-h-24 overflow-y-auto break-words">
                  {newMessage}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
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
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={toggleScheduleModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-medium text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleScheduleMessage}
                  disabled={!scheduledDate}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm ${
                    !scheduledDate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  Schedule Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Owner selection modal */}
      {isEditingOwner && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseOwnerEdit}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      Change Owner
                    </h3>
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      {dealData.teamMembers.map(member => (
                        <div 
                          key={member.id}
                          className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                        >
                          <div 
                            className={`w-8 h-8 rounded-full bg-gradient-to-tr ${member.color} flex items-center justify-center text-white text-xs font-semibold mr-3`}
                          >
                            <span>{member.avatarInitial}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseOwnerEdit}
                >
                  Apply
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseOwnerEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tags editing modal - updated with delete button */}
      {isEditingTags && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseTagsEdit}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      Edit Tags
                    </h3>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {dealData.tags.map((tag, index) => (
                          <div key={index} className="flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                            {tag}
                            <button className="ml-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200">
                              <CrossIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex">
                        <input 
                          type="text" 
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          placeholder="Add new tag"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseTagsEdit}
                >
                  Apply
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseTagsEdit}
                >
                  Cancel
                </button>
                {/* Added Delete button */}
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleRemoveTags}
                >
                  Delete All Tags
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
} 