"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '../ThemeToggle'
import { createContext } from 'react'

// SVG Icons as components
const DashboardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const PipelineIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const InboxIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

const TasksIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8" />
    <path d="M4 10h16" />
    <path d="M2 19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9Z" />
    <path d="m7 15 2 2 6-6" />
  </svg>
)

const TeamIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const SettingsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const AnalyticsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
)

const AIAssistantIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M8 9h8" />
    <path d="M12 6h.01" />
  </svg>
)

const LogoutIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const ChevronLeftIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

// Add ChevronDownIcon for dropdown
const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// Tooltip component for sidebar hover
const Tooltip = ({ text, stats, visible, className = "" }) => {
  if (!visible) return null;
  
  return (
    <div className={`absolute left-16 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 w-64 transition-opacity duration-200 ${className} ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="font-medium text-gray-900 dark:text-white">{text}</div>
      {stats && <div className="text-xs text-green-600 dark:text-green-400 mt-1">{stats}</div>}
    </div>
  );
};

// Sidebar navigation items
const navigationItems = [
  { 
    name: 'Pipeline', 
    icon: PipelineIcon, 
    href: '/pipeline',
    description: 'Manage your sales pipeline',
    stats: '3 deals need attention'
  },
  { 
    name: 'Dashboard', 
    icon: DashboardIcon, 
    href: '/dashboard',
    description: 'Overview of your activities',
    stats: '12% more traffic this week'
  },
  { 
    name: 'Inbox', 
    icon: InboxIcon, 
    href: '/inbox',
    description: 'View and respond to messages',
    stats: '5 unread messages'
  },
  { 
    name: 'Tasks', 
    icon: TasksIcon, 
    href: '/tasks',
    description: 'Track your to-do list',
    stats: '2 tasks due today'
  },
  { 
    name: 'AI Assistant', 
    icon: AIAssistantIcon, 
    href: '/ai-assistant',
    description: 'Train your AI assistant',
    stats: 'Improve response quality'
  },
  { 
    name: 'Team', 
    icon: TeamIcon, 
    href: '/team',
    description: 'Manage team members',
    stats: '1 new team invitation'
  },
  { 
    name: 'Analytics', 
    icon: AnalyticsIcon, 
    href: '/analytics',
    description: 'View performance insights',
    stats: '+12% growth this month'
  },
  { 
    name: 'Settings', 
    icon: SettingsIcon, 
    href: '/settings',
    description: 'Configure your account',
    stats: 'Updated 2 days ago'
  }
];

// Logo component for the app
const LogoIcon = ({ className = "w-6 h-6", style = {} }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="12" fill="url(#paint0_linear)" />
    <path d="M12 6.5C8.96243 6.5 6.5 8.96243 6.5 12C6.5 15.0376 8.96243 17.5 12 17.5C15.0376 17.5 17.5 15.0376 17.5 12C17.5 8.96243 15.0376 6.5 12 6.5ZM9.5 12.75C9.08579 12.75 8.75 12.4142 8.75 12C8.75 11.5858 9.08579 11.25 9.5 11.25C9.91421 11.25 10.25 11.5858 10.25 12C10.25 12.4142 9.91421 12.75 9.5 12.75ZM12 14.5C11.5858 14.5 11.25 14.1642 11.25 13.75C11.25 13.3358 11.5858 13 12 13C12.4142 13 12.75 13.3358 12.75 13.75C12.75 14.1642 12.4142 14.5 12 14.5ZM14.5 12.75C14.0858 12.75 13.75 12.4142 13.75 12C13.75 11.5858 14.0858 11.25 14.5 11.25C14.9142 11.25 15.25 11.5858 15.25 12C15.25 12.4142 14.9142 12.75 14.5 12.75Z" fill="white" />
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
);

// Create a PipelineContext for sharing the selected pipeline across components
export const PipelineContext = createContext({
  selectedPipeline: "All Pipelines",
  setSelectedPipeline: (pipeline: string) => {}
});

interface AppLayoutProps {
  children: React.ReactNode;
  companyName?: string;
  companyLogo?: string;
  headerTitle?: React.ReactNode;
  headerSearchComponent?: React.ReactNode;
  headerActionComponent?: React.ReactNode;
}

export default function AppLayout({ 
  children, 
  companyName = "Intract", 
  companyLogo = null,
  headerTitle = null,
  headerSearchComponent = null,
  headerActionComponent = null
}: AppLayoutProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [pipelineDropdownOpen, setPipelineDropdownOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState("All Pipelines");
  const pathname = usePathname();

  // Mock pipeline data - in a real app, this would come from an API/context
  const pipelines = [
    { id: "all", name: "All Pipelines" },
    { id: "sales", name: "Sales Pipeline" },
    { id: "marketing", name: "Marketing Pipeline" },
    { id: "support", name: "Support Pipeline" }
  ];

  // Toggle the pipeline dropdown
  const togglePipelineDropdown = (e) => {
    e.stopPropagation();
    setPipelineDropdownOpen(!pipelineDropdownOpen);
  };

  // Select a pipeline and close the dropdown
  const selectPipeline = (pipeline) => {
    setSelectedPipeline(pipeline.name);
    setPipelineDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pipelineDropdownOpen) {
        setPipelineDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (pipelineDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pipelineDropdownOpen]);

  return (
    <PipelineContext.Provider value={{ selectedPipeline, setSelectedPipeline: (p) => setSelectedPipeline(p) }}>
      <div className="flex h-screen bg-gray-50 dark:bg-[#131823] text-gray-900 dark:text-gray-100">
        {/* Sidebar - always collapsed */}
        <div className="h-full bg-white dark:bg-[#1B2333] shadow-lg flex flex-col w-16">
          {/* Logo section */}
          <div className="pt-[0.83rem] px-3 mb-0">
            <Link
              href="/"
              className="relative flex items-center justify-center p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <LogoIcon className="w-6 h-6" />
              </div>
            </Link>
          </div>

          <div className="border-b border-gray-100 dark:border-[#1f293a] dark:border-opacity-20 mt-[0.86rem] mb-3"></div>

          {/* Navigation links */}
          <nav className="pt-2 pb-4 flex-1">
            <ul className="space-y-1 px-2">
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href}
                    className={`relative flex items-center justify-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      pathname === item.href ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <item.icon className="w-6 h-6" />
                    <Tooltip 
                      text={item.name} 
                      stats={item.stats}
                      visible={hoveredItem === index}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile */}
          <div className="px-2 mb-1">
            <div className="flex items-center justify-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
              {/* User avatar */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm">
                U
              </div>
              <Tooltip 
                text="Profile" 
                stats={null}
                visible={hoveredItem === -1}
              />
            </div>
          </div>

          {/* Logout button */}
          <div className="px-2 mb-4">
            <div 
              className="flex items-center justify-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              onMouseEnter={() => setHoveredItem(-2)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <LogoutIcon className="w-6 h-6" />
              <Tooltip 
                text="Log out" 
                stats={null}
                visible={hoveredItem === -2}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header className="bg-white dark:bg-[#1B2333] shadow-sm border-b border-gray-100 dark:border-[#1f293a] dark:border-opacity-20 py-[0.86rem] px-4 flex items-center">
            {headerTitle || (
              <div className="flex items-center">
                {/* Pipeline dropdown - always visible */}
                <div className="relative">
                  <button 
                    className="flex items-center px-3 py-1 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={togglePipelineDropdown}
                  >
                    {selectedPipeline}
                    <ChevronDownIcon className="ml-1 w-4 h-4" />
                  </button>
                  
                  {pipelineDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                      <ul className="py-1">
                        {pipelines.map((pipeline) => (
                          <li key={pipeline.id}>
                            <button
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                selectedPipeline === pipeline.name 
                                  ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' 
                                  : 'text-gray-900 dark:text-white'
                              }`}
                              onClick={() => selectPipeline(pipeline)}
                            >
                              {pipeline.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* This is where the Deal Value and Days in Stage will go */}
            <div className="flex-1 flex items-center justify-end">
              {headerSearchComponent}
            </div>
            
            {/* Action components */}
            <div className="flex items-center space-x-4 ml-4">
              {headerActionComponent}
              <ThemeToggle />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-x-auto overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </PipelineContext.Provider>
  )
} 