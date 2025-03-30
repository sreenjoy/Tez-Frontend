"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import '../../app/pipeline/pipeline.css'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

// SVG Icons
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const FilterIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

const DotsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
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

const MessageIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const LabelIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z" />
    <path d="M6 9.01V9" />
  </svg>
)

const EditIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

// Add an @ icon
const AtMentionIcon = ({ className = "w-5 h-5" }) => (
  <span className={`${className} flex items-center justify-center font-semibold`}>@</span>
)

// Add a task/clock icon
const TaskIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

// Activity icon (similar to current TaskIcon)
const ActivityIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m7 10 3 3 7-7" />
  </svg>
)

// ChevronDown icon
const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// Add a small logo component for groups
const GroupLogo = ({ name }: { name: string }) => {
  const letter = name.charAt(0).toUpperCase()
  
  // Generate a consistent color based on the name
  const generateColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash % 360)
    return `hsl(${hue}, 70%, 60%)`
  }
  
  const backgroundColor = generateColor(name)
  
  return (
    <div 
      className="w-4 h-4 flex items-center justify-center rounded-full text-white text-xs font-semibold"
      style={{ backgroundColor, marginRight: '4px' }}
    >
      {letter}
    </div>
  )
}

// Sample pipelines data
const pipelines = [
  { id: "main", name: "Main Pipeline" },
  { id: "sales", name: "Sales Pipeline" },
  { id: "marketing", name: "Marketing Pipeline" },
  { id: "support", name: "Support Pipeline" }
];

// Initial data structure
const initialColumns = {
  'lead': {
    id: 'lead',
    title: "Lead",
    color: "blue",
    count: 2,
    cards: [
      { 
        id: 'card-1', 
        title: "Acme Corp Website Redesign", 
        company: "Stripe <> Happy",
        contact: "Patrick Collison",
        tags: ["Wifey material", "ENOC", "From conference"], 
        messages: 5,
        status: null, 
        value: 2800 
      },
      { 
        id: 'card-2', 
        title: "TechStart Mobile App", 
        company: "Nvidia <> Happy",
        contact: "Jensen | GPU boy",
        tags: ["Wifey material", "From conference"], 
        messages: 1,
        status: null, 
        value: 1500 
      }
    ]
  },
  'contacted': {
    id: 'contacted',
    title: "Contacted",
    color: "indigo",
    count: 2,
    cards: [
      { 
        id: 'card-3', 
        title: "GlobalTech CRM Integration", 
        company: "Apple <> Happy",
        contact: "Tim Apple",
        tags: ["Wifey material", "From conference"], 
        messages: 1,
        status: null, 
        value: 12000 
      },
      { 
        id: 'card-4', 
        title: "Sunshine Cafe Online Ordering", 
        company: "Binance <> Happy",
        contact: "Ashley :)",
        tags: ["Wifey material", "From conference"], 
        messages: 1,
        status: "Invoice paid", 
        value: 3200 
      }
    ]
  },
  'negotiation': {
    id: 'negotiation',
    title: "Negotiation",
    color: "purple",
    count: 1,
    cards: [
      { 
        id: 'card-5', 
        title: "FitLife Membership Portal", 
        company: "Coinbase <> Happy",
        contact: "Josh | Happy",
        tags: ["Wifey material"], 
        messages: 1,
        status: "Invoice sent", 
        value: 8500 
      }
    ]
  },
  'ready': {
    id: 'ready',
    title: "Ready to start",
    color: "green",
    count: 1,
    cards: [
      { 
        id: 'card-6', 
        title: "EduLearn LMS Platform", 
        company: "Happy <> Lockheed Mart",
        contact: "Leyla | Happy",
        tags: ["No money", "Wifey material"], 
        messages: 4,
        status: "Offline meeting", 
        value: 12000 
      }
    ]
  },
  'archive': {
    id: 'archive',
    title: "Archive",
    color: "gray",
    count: 1,
    cards: [
      { 
        id: 'card-7', 
        title: "Legacy Project Archive", 
        company: "FTX <> Happy",
        contact: "Sam Bankman-Fried",
        tags: ["Crypto", "No money"], 
        messages: 3,
        status: "Let him cook", 
        value: 0 
      }
    ]
  }
};

const columnOrder = ['lead', 'contacted', 'negotiation', 'ready', 'archive'];

// Pipeline dropdown component with proper click-outside behavior
const PipelineDropdown = ({ pipelines, activePipeline, setActivePipeline, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Select pipeline
  const selectPipeline = (pipeline) => {
    setActivePipeline(pipeline);
    setIsOpen(false);
    // In a real app, you would load the selected pipeline data here
    console.log(`Selected pipeline: ${pipeline.name}`);
  };
  
  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 h-9"
      >
        {activePipeline.name}
        <ChevronDownIcon className="ml-1 w-5 h-5 text-gray-500" />
      </button>
      
      <button 
        onClick={onEdit}
        className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        title="Edit pipeline"
      >
        <EditIcon className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[200px]">
          <ul className="py-1">
            {pipelines.map(pipeline => (
              <li key={pipeline.id}>
                <button
                  onClick={() => selectPipeline(pipeline)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    activePipeline.id === pipeline.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {pipeline.name}
                  {activePipeline.id === pipeline.id && (
                    <CheckIcon className="inline-block ml-2 w-4 h-4" />
                  )}
                </button>
              </li>
            ))}
            <li className="border-t border-gray-200 dark:border-gray-700 mt-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                + Create new pipeline
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

// Completely rewritten PriorityDropdown to match the pattern of the working PipelineDropdown
const PriorityDropdown = ({ selectedPriority, onSelectPriority }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Priority items
  const priorityItems = [
    { id: "priority-high", name: "High", count: 8 },
    { id: "priority-medium", name: "Medium", count: 12 },
    { id: "priority-low", name: "Low", count: 5 }
  ];
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Select priority
  const selectPriority = (priorityId) => {
    onSelectPriority(priorityId);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 text-sm rounded-t-md flex items-center whitespace-nowrap ${
          selectedPriority
            ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
        }`}
      >
        {selectedPriority 
          ? priorityItems.find(item => item.id === selectedPriority)?.name 
          : 'Priority'
        }
        <ChevronDownIcon className="ml-1 w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[140px]">
          <ul className="py-1">
            {priorityItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => selectPriority(item.id)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center ${
                    selectedPriority === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item.name}
                  {item.count !== null && (
                    <span className={`ml-auto px-1.5 py-0.5 rounded-full text-xs ${
                      selectedPriority === item.id
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Create a standalone Activity dropdown component that follows the same pattern as PipelineDropdown
const ActivityDropdown = ({ activityItems, selectedActivity, onSelectActivity }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Select activity
  const selectActivity = (activityId) => {
    onSelectActivity(activityId);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 text-sm rounded-t-md flex items-center whitespace-nowrap ${
          selectedActivity
            ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
        }`}
      >
        <ActivityIcon className="w-4 h-4 mr-1.5" />
        {selectedActivity 
          ? activityItems.find(item => item.id === selectedActivity)?.name 
          : 'Activity'
        }
        <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {activityItems.reduce((total, item) => total + (item.count || 0), 0)}
        </span>
        <ChevronDownIcon className="ml-1 w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[180px]">
          <ul className="py-1">
            {activityItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => selectActivity(item.id)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center ${
                    selectedActivity === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                  {item.count && (
                    <span className={`ml-auto px-1.5 py-0.5 rounded-full text-xs ${
                      selectedActivity === item.id
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Add toggle icons
const KanbanIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const ListIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)

export default function PipelinePage() {
  // Core state management
  const [columns, setColumns] = useState(initialColumns);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [activePipeline, setActivePipeline] = useState(pipelines[0]);
  const [showPipelineEditor, setShowPipelineEditor] = useState(false);
  const [editingPipelineName, setEditingPipelineName] = useState('');
  const [editingStages, setEditingStages] = useState([]);
  const [newStageName, setNewStageName] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  
  // Main tabs
  const mainTabs = [
    { id: "all", name: "All Chats", count: null, icon: null },
    { id: "unread", name: "Unread", count: 7, icon: null },
    { id: "unanswered", name: "Unanswered", count: 3, icon: null },
    { id: "followup", name: "Follow up", count: 5, icon: null }
  ];

  // Right side tabs
  const rightTabs = [
    { id: "mentions", name: "mentions", icon: AtMentionIcon, count: 3, active: false },
    { id: "filter", name: "Filter", icon: FilterIcon, count: null, active: false }
  ];

  // Activity dropdown items
  const activityItems = [
    { id: "tasks", name: "Active Tasks", count: 17, icon: TaskIcon },
    { id: "team", name: "Team Activity", count: 1, icon: TeamIcon }
  ];

  // Priority items for dropdown
  const priorityItems = [
    { id: "priority-high", name: "High", count: 8 },
    { id: "priority-medium", name: "Medium", count: 12 },
    { id: "priority-low", name: "Low", count: 5 }
  ];
  
  // When a priority is selected, update the active tab
  useEffect(() => {
    if (selectedPriority) {
      setActiveTab(selectedPriority);
    }
  }, [selectedPriority]);
  
  // When an activity is selected, update the active tab
  useEffect(() => {
    if (selectedActivity) {
      setActiveTab(selectedActivity);
    }
  }, [selectedActivity]);
  
  // When activeTab changes, update the selected priority/activity if needed
  useEffect(() => {
    // Check if active tab is a priority
    const isPriority = priorityItems.some(item => item.id === activeTab);
    if (isPriority && selectedPriority !== activeTab) {
      setSelectedPriority(activeTab);
    }
    
    // Check if active tab is an activity
    const isActivity = activityItems.some(item => item.id === activeTab);
    if (isActivity && selectedActivity !== activeTab) {
      setSelectedActivity(activeTab);
    }
  }, [activeTab, selectedPriority, selectedActivity, priorityItems, activityItems]);
  
  // Handle priority selection
  const handlePrioritySelect = useCallback((priorityId) => {
    setSelectedPriority(priorityId);
    setActiveTab(priorityId);
  }, []);
  
  // Handle activity selection
  const handleActivitySelect = useCallback((activityId) => {
    setSelectedActivity(activityId);
    setActiveTab(activityId);
  }, []);

  // Helper function to determine tab category
  const getTabCategory = useCallback((tabId) => {
    if (mainTabs.some(tab => tab.id === tabId)) return 'main';
    if (priorityItems.some(item => item.id === tabId)) return 'priority';
    if (activityItems.some(item => item.id === tabId)) return 'activity';
    if (rightTabs.some(tab => tab.id === tabId)) return 'right';
    return 'unknown';
  }, [mainTabs, priorityItems, activityItems, rightTabs]);
  
  // More robust tab change handler
  const handleTabChange = useCallback((tabId) => {
    const category = getTabCategory(tabId);
    
    if (category === 'priority') {
      setSelectedPriority(tabId);
    } else if (category === 'activity') {
      setSelectedActivity(tabId);
    } else {
      setActiveTab(tabId);
      // If switching to a main tab, clear selected priority/activity
      setSelectedPriority(null);
      setSelectedActivity(null);
    }
  }, [activeTab, getTabCategory]);
  
  // Handle card click
  const handleCardClick = useCallback((cardId) => {
    // Only handle clicks if not currently dragging
    if (!isDragging) {
      // Find the card details
      let selectedCard = null;
      let selectedColumn = null;
      
      for (const columnId of columnOrder) {
        const column = columns[columnId];
        const card = column.cards.find(c => c.id === cardId);
        if (card) {
          selectedCard = card;
          selectedColumn = column;
          break;
        }
      }
      
      if (selectedCard) {
        alert(`You clicked on: ${selectedCard.title}\nIn stage: ${selectedColumn.title}\nValue: $${selectedCard.value.toLocaleString()}`);
      }
    }
  }, [columns, isDragging]);
  
  // Open pipeline editor
  const handleEditPipeline = useCallback(() => {
    // Initialize the editing state with current pipeline data
    setEditingPipelineName(activePipeline.name);
    
    // Convert columns to stages format for editing
    const stages = columnOrder.map(colId => ({
      id: colId,
      name: columns[colId].title,
      color: columns[colId].color
    }));
    
    setEditingStages(stages);
    setShowPipelineEditor(true);
  }, [activePipeline, columns, columnOrder]);
  
  // Close pipeline editor
  const handleCloseEditor = () => {
    setShowPipelineEditor(false);
  };
  
  // Handle pipeline name change
  const handlePipelineNameChange = (e) => {
    setEditingPipelineName(e.target.value);
  };
  
  // Handle stage name change
  const handleStageNameChange = (stageId, newName) => {
    setEditingStages(prevStages =>
      prevStages.map(stage => 
        stage.id === stageId ? { ...stage, name: newName } : stage
      )
    );
  };
  
  // Handle stage color change
  const handleStageColorChange = (stageId, newColor) => {
    setEditingStages(prevStages =>
      prevStages.map(stage => 
        stage.id === stageId ? { ...stage, color: newColor } : stage
      )
    );
  };
  
  // Handle stage deletion
  const handleDeleteStage = (stageId) => {
    setEditingStages(prevStages => 
      prevStages.filter(stage => stage.id !== stageId)
    );
  };
  
  // Handle stage reordering
  const handleStageReorder = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(editingStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setEditingStages(items);
  };
  
  // Handle adding a new stage
  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    
    const newStage = {
      id: `stage-${Date.now()}`,
      name: newStageName,
      color: 'blue' // Default color
    };
    
    setEditingStages([...editingStages, newStage]);
    setNewStageName('');
  };
  
  // Save pipeline changes
  const handleSavePipeline = () => {
    // Update the active pipeline name
    setActivePipeline({
      ...activePipeline,
      name: editingPipelineName
    });
    
    // In a real app, you would send this data to your backend
    console.log('Saving pipeline:', {
      name: editingPipelineName,
      stages: editingStages
    });
    
    // Close the editor
    setShowPipelineEditor(false);
  };

  const handleDragStart = useCallback((start) => {
    setIsDragging(true);
    document.body.classList.add('is-dragging');
    setDraggedItemId(start.draggableId);
  }, []);

  const handleDragEnd = useCallback((result) => {
    setIsDragging(false);
    document.body.classList.remove('is-dragging');
    setDraggedItemId(null);

    const { destination, source, draggableId } = result;

    // If there's no destination or the item didn't move, do nothing
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Make a deep copy of columns to avoid mutation
    const newColumns = JSON.parse(JSON.stringify(columns));
    
    // Get source and destination columns
    const sourceColumn = newColumns[source.droppableId];
    const destColumn = newColumns[destination.droppableId];
    
    // Get the moving card
    const movingCard = sourceColumn.cards[source.index];
    
    // Remove card from source column
    sourceColumn.cards.splice(source.index, 1);
    
    // Add card to destination column
    destColumn.cards.splice(destination.index, 0, movingCard);
    
    // Update column counts
    sourceColumn.count = sourceColumn.cards.length;
    destColumn.count = destColumn.cards.length;
    
    // Update state
    setColumns(newColumns);
  }, [columns]);

  // Function to get color classes based on column color
  const getColorClass = useCallback((color) => {
    switch(color) {
      case 'blue': return 'bg-blue-500';
      case 'indigo': return 'bg-indigo-600';
      case 'purple': return 'bg-purple-600';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }, []);

  // Header components
  const searchComponent = (
    <div className="relative w-64">
      <input
        type="text"
        placeholder="Search for deals..."
        className="pl-9 pr-4 py-1.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm h-9"
      />
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
  );

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'kanban' ? 'list' : 'kanban');
  };

  // View toggle component
  const viewToggleComponent = (
    <div className="ml-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 flex items-center">
      <button
        onClick={() => setViewMode('kanban')}
        className={`p-1.5 rounded-md ${
          viewMode === 'kanban'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        }`}
        title="Kanban view"
      >
        <KanbanIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-1.5 rounded-md ${
          viewMode === 'list'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        }`}
        title="List view"
      >
        <ListIcon className="h-5 w-5" />
      </button>
    </div>
  );

  const actionComponent = (
    <div className="flex items-center">
      {viewToggleComponent}
      <button className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-sm text-sm ml-3">
        <span>Sync Chats</span>
      </button>
      
      {/* Team members */}
      <div className="flex items-center ml-4">
        <div className="flex -space-x-2 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[10px] ring-1 ring-white dark:ring-gray-800 z-30 relative group cursor-pointer">
            <span>P</span>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Patrick Collison
            </span>
          </div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white text-[10px] ring-1 ring-white dark:ring-gray-800 z-20 relative group cursor-pointer">
            <span>A</span>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Ashley Smith
            </span>
          </div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-[10px] ring-1 ring-white dark:ring-gray-800 z-10 relative group cursor-pointer">
            <span>T</span>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Tim Apple
            </span>
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center text-[10px] font-medium ring-1 ring-white dark:ring-gray-800 relative group cursor-pointer">
            <span>+2</span>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Jensen, Leyla and others
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const pipelineHeaderDropdown = (
    <PipelineDropdown 
      pipelines={pipelines}
      activePipeline={activePipeline}
      setActivePipeline={setActivePipeline}
      onEdit={handleEditPipeline}
    />
  );

  return (
    <AppLayout
      headerTitle={pipelineHeaderDropdown}
      headerSearchComponent={searchComponent}
      headerActionComponent={actionComponent}
    >
      <div className={`flex flex-col h-full ${isDragging ? 'dragging-cursor' : ''}`}>
        {/* Top header with tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-4 pt-1.5 pb-1.5">
            {/* Main tabs */}
            <div className="flex space-x-1 overflow-x-auto flex-1">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 py-2 text-sm rounded-t-md flex items-center whitespace-nowrap ${
                    activeTab === tab.id && !selectedPriority && !selectedActivity
                      ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.icon && <tab.icon className="w-4 h-4 mr-1.5" />}
                  {tab.name}
                  {tab.count && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id && !selectedPriority && !selectedActivity
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Self-contained Priority dropdown */}
              <PriorityDropdown 
                selectedPriority={selectedPriority}
                onSelectPriority={handlePrioritySelect}
              />
            </div>

            {/* Right side tabs */}
            <div className="flex items-center ml-auto">
              {/* First the mentions tab */}
              <button 
                key="mentions"
                className="px-4 py-2 text-sm rounded-t-md flex items-center whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                onClick={() => console.log("Clicked mentions")}
              >
                <AtMentionIcon className="w-4 h-4 mr-1.5" />
                mentions
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  3
                </span>
              </button>
              
              {/* Activity dropdown as a separate component */}
              <ActivityDropdown 
                activityItems={activityItems}
                selectedActivity={selectedActivity}
                onSelectActivity={handleActivitySelect}
              />
              
              {/* Finally the Filter button */}
              <button 
                key="filter"
                className="px-4 py-2 text-sm rounded-t-md flex items-center whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                onClick={() => console.log("Clicked Filter")}
              >
                <FilterIcon className="w-4 h-4 mr-1.5" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline content with drag and drop or list view based on viewMode */}
        {viewMode === 'kanban' ? (
          <div className="flex-1 overflow-x-auto overflow-y-auto p-2.5 pipeline-scroll">
            <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="flex gap-2">
                {columnOrder.map(columnId => {
                  const column = columns[columnId];
                  
                  return (
                    <div key={column.id} className="pipeline-column min-w-[300px] w-[300px] bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                      <div className="px-2">
                        <div className="pipeline-column-header flex items-center mb-4 justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${getColorClass(column.color)}`}></div>
                            <h2 className="font-semibold">{column.title}</h2>
                            <span className="column-counter">{column.count}</span>
                          </div>
                          <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full">
                            <DotsIcon className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <Droppable 
                          droppableId={column.id}
                          type="PIPELINE-CARD"
                        >
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`min-h-[150px] rounded-lg transition-all duration-200 ${
                                snapshot.isDraggingOver 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-200 dark:border-blue-800' 
                                  : draggedItemId ? 'bg-gray-50 dark:bg-gray-900/10 border-2 border-dashed border-gray-200 dark:border-gray-800' : ''
                              }`}
                            >
                              {column.cards.map((card, index) => (
                                <Draggable key={card.id} draggableId={card.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      id={`card-${card.id}`}
                                      onClick={() => handleCardClick(card.id)}
                                      className={`pipeline-card mb-3 bg-white dark:bg-gray-800 rounded-lg p-3 border h-[145px] flex flex-col justify-between ${
                                        snapshot.isDragging
                                          ? 'border-blue-400 dark:border-blue-500 shadow-lg'
                                          : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
                                      } cursor-pointer`}
                                    >
                                      {/* Group logo and name */}
                                      <div className="flex items-center mb-2 px-0.5">
                                        <GroupLogo name={card.company} />
                                        <div 
                                          className="company-name ml-2 text-[14px] font-medium text-indigo-600 dark:text-indigo-400 truncate" 
                                          style={{marginLeft: '4px !important', color: 'rgb(79, 70, 229) !important'}}
                                        >
                                          {card.company}
                                        </div>
                                      </div>

                                      {/* Tags - limited to 2 with "..." */}
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-0.5">
                                        {card.tags.length > 0 ? (
                                          <div className="flex flex-wrap gap-1">
                                            {card.tags.slice(0, 2).map((tag, i) => {
                                              let bgColor = 'bg-gray-100 dark:bg-gray-700';
                                              let textColor = 'text-gray-600 dark:text-gray-300';
                                              let borderColor = 'border border-gray-200 dark:border-gray-600';
                                              
                                              if (tag === 'Wifey material') {
                                                bgColor = 'bg-green-50 dark:bg-green-900/30';
                                                textColor = 'text-green-700 dark:text-green-300';
                                                borderColor = 'border border-green-200 dark:border-green-800';
                                              } else if (tag === 'ENOC') {
                                                bgColor = 'bg-orange-50 dark:bg-orange-900/30';
                                                textColor = 'text-orange-700 dark:text-orange-300';
                                                borderColor = 'border border-orange-200 dark:border-orange-800';
                                              } else if (tag === 'From conference') {
                                                bgColor = 'bg-blue-50 dark:bg-blue-900/30';
                                                textColor = 'text-blue-700 dark:text-blue-300';
                                                borderColor = 'border border-blue-200 dark:border-blue-800';
                                              } else if (tag === 'No money') {
                                                bgColor = 'bg-red-50 dark:bg-red-900/30';
                                                textColor = 'text-red-700 dark:text-red-300';
                                                borderColor = 'border border-red-200 dark:border-red-800';
                                              } else if (tag === 'Crypto') {
                                                bgColor = 'bg-purple-50 dark:bg-purple-900/30';
                                                textColor = 'text-purple-700 dark:text-purple-300';
                                                borderColor = 'border border-purple-200 dark:border-purple-800';
                                              }
                                              
                                              return (
                                                <span key={i} className={`inline-block ${bgColor} ${textColor} ${borderColor} rounded-full px-2 py-0.5 text-[10px] mr-1`}>
                                                  {tag}
                                                </span>
                                              );
                                            })}
                                            {card.tags.length > 2 && (
                                              <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-0.5 text-[10px]">
                                                ...
                                              </span>
                                            )}
                                          </div>
                                        ) : (
                                          'No tags'
                                        )}
                                      </div>

                                      {/* Group owner */}
                                      <div className="flex items-center mb-2 px-0.5">
                                        <div className="flex items-center text-xs">
                                          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[10px] mr-1.5 flex-shrink-0">
                                            {card.contact ? card.contact.charAt(0) : '?'}
                                          </div>
                                          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[160px] text-xs">
                                            {card.contact}
                                          </span>
                                        </div>
                                        
                                        {/* Priority indicator */}
                                        <div className="ml-auto">
                                          <span className={`text-[10px] py-0.5 px-1.5 rounded-full ${
                                            card.id.includes('1') || card.id.includes('5') ? 
                                              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 
                                            card.id.includes('3') || card.id.includes('6') ? 
                                              'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 
                                              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                          }`}>
                                            {card.id.includes('1') || card.id.includes('5') ? 'High' : 
                                             card.id.includes('3') || card.id.includes('6') ? 'Medium' : 'Low'}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {/* Divider */}
                                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                      
                                      {/* Tasks status */}
                                      <div className="flex items-center justify-between text-xs px-0.5 mt-1 mb-1">
                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                          {card.status ? (
                                            <>
                                              {card.status === 'Invoice paid' ? (
                                                <CheckIcon className="w-3 h-3 mr-1 text-green-500" />
                                              ) : card.status === 'Invoice sent' ? (
                                                <MessageIcon className="w-3 h-3 mr-1 text-blue-500" />
                                              ) : card.status === 'Offline meeting' ? (
                                                <TeamIcon className="w-3 h-3 mr-1 text-purple-500" />
                                              ) : null}
                                              <span className="text-[11px]">{card.status}</span>
                                            </>
                                          ) : (
                                            <span className="text-green-600 dark:text-green-400 text-[11px]">No tasks pending</span>
                                          )}
                                        </div>
                                        
                                        {card.messages > 0 ? (
                                          <span className={`text-[10px] flex items-center justify-center w-5 h-5 ${
                                            card.id.includes('1') || card.id.includes('5') 
                                              ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' // Hot
                                              : card.id.includes('3') || card.id.includes('4')  
                                                ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' // Warm
                                                : card.id.includes('6')
                                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' // Cold
                                                  : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200' // Dormant
                                          } rounded-full flex-shrink-0 relative group`}>
                                            {card.messages}
                                            <div className="absolute bottom-full right-0 mb-2 w-32 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                                              {card.id.includes('1') || card.id.includes('5') 
                                                ? 'Hot Lead' 
                                                : card.id.includes('3') || card.id.includes('4')
                                                  ? 'Warm Lead'
                                                  : card.id.includes('6')
                                                    ? 'Cold Lead'
                                                    : 'Dormant Lead'
                                              }
                                            </div>
                                          </span>
                                        ) : (
                                          <div className={`w-2 h-2 rounded-full flex-shrink-0 relative group ${
                                            card.id.includes('1') || card.id.includes('5') 
                                              ? 'bg-red-500' // Hot
                                              : card.id.includes('3') || card.id.includes('4')  
                                                ? 'bg-orange-500' // Warm
                                                : card.id.includes('6')
                                                  ? 'bg-blue-500' // Cold
                                                  : 'bg-gray-500' // Dormant
                                          }`}>
                                            <div className="absolute bottom-full right-0 mb-2 w-32 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                                              {card.id.includes('1') || card.id.includes('5') 
                                                ? 'Hot Lead' 
                                                : card.id.includes('3') || card.id.includes('4')
                                                  ? 'Warm Lead'
                                                  : card.id.includes('6')
                                                    ? 'Cold Lead'
                                                    : 'Dormant Lead'
                                              }
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              <button className="add-card-button w-full h-[40px] p-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center mt-2">
                                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Deal
                              </button>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </div>
        ) : (
          <div className="flex-1 pl-[1px] pt-[1px]">
            <table className="min-w-full flex-1 border-collapse bg-white dark:bg-gray-800 h-full w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm border-l-4 border-l-blue-500 dark:border-l-blue-600">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-0">
                    Deal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-0">
                    Stage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-0">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-0">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-0">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b-0">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {columnOrder.flatMap((columnId, columnIndex, columnsArray) => 
                  columns[columnId].cards.map((card, rowIndex, rowsArray) => {
                    // Calculate if this is the last row in the entire table
                    const isLastColumn = columnIndex === columnOrder.length - 1;
                    const isLastRowInColumn = rowIndex === columns[columnId].cards.length - 1;
                    const isLastRowInTable = isLastColumn && isLastRowInColumn;
                    
                    return (
                      <tr 
                        key={card.id} 
                        onClick={() => handleCardClick(card.id)} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-300/[0.025] cursor-pointer relative"
                        style={{
                          borderBottom: !isLastRowInTable ? '1px solid var(--border-color, #e5e7eb)' : 'none'
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                              <GroupLogo name={card.company} />
                              <div className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{card.company}</div>
                            </div>
                            <div className="flex flex-wrap">
                              {card.tags.slice(0, 2).map((tag, i) => {
                                let bgColor = 'bg-gray-100 dark:bg-gray-700';
                                let textColor = 'text-gray-600 dark:text-gray-300';
                                let borderColor = 'border border-gray-200 dark:border-gray-600';
                                
                                if (tag === 'Wifey material') {
                                  bgColor = 'bg-green-50 dark:bg-green-900/30';
                                  textColor = 'text-green-700 dark:text-green-300';
                                  borderColor = 'border border-green-200 dark:border-green-800';
                                } else if (tag === 'ENOC') {
                                  bgColor = 'bg-orange-50 dark:bg-orange-900/30';
                                  textColor = 'text-orange-700 dark:text-orange-300';
                                  borderColor = 'border border-orange-200 dark:border-orange-800';
                                } else if (tag === 'From conference') {
                                  bgColor = 'bg-blue-50 dark:bg-blue-900/30';
                                  textColor = 'text-blue-700 dark:text-blue-300';
                                  borderColor = 'border border-blue-200 dark:border-blue-800';
                                } else if (tag === 'No money') {
                                  bgColor = 'bg-red-50 dark:bg-red-900/30';
                                  textColor = 'text-red-700 dark:text-red-300';
                                  borderColor = 'border border-red-200 dark:border-red-800';
                                } else if (tag === 'Crypto') {
                                  bgColor = 'bg-purple-50 dark:bg-purple-900/30';
                                  textColor = 'text-purple-700 dark:text-purple-300';
                                  borderColor = 'border border-purple-200 dark:border-purple-800';
                                }
                                
                                return (
                                  <span key={i} className={`inline-block ${bgColor} ${textColor} ${borderColor} rounded-full px-2 py-0.5 text-[10px] mr-1`}>
                                    {tag}
                                  </span>
                                );
                              })}
                              {card.tags.length > 2 && (
                                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-0.5 text-[10px]">
                                  +{card.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${getColorClass(columns[columnId].color)}`}></div>
                            <span className="text-sm text-gray-900 dark:text-white">{columns[columnId].title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs mr-2">
                              {card.contact.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">{card.contact}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex text-xs px-2 py-1 rounded-full ${
                            card.id.includes('1') || card.id.includes('5') ? 
                              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 
                            card.id.includes('3') || card.id.includes('6') ? 
                              'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 
                              'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          }`}>
                            {card.id.includes('1') || card.id.includes('5') ? 'High' : 
                             card.id.includes('3') || card.id.includes('6') ? 'Medium' : 'Low'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${card.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {card.status ? (
                              <span className="text-sm text-gray-700 dark:text-gray-300">{card.status}</span>
                            ) : (
                              <span className="text-sm text-green-600 dark:text-green-400">No tasks pending</span>
                            )}
                            <div className="ml-2">
                              {card.messages > 0 ? (
                                <span className={`text-[10px] flex items-center justify-center w-5 h-5 ${
                                  card.id.includes('1') || card.id.includes('5') 
                                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' // Hot
                                    : card.id.includes('3') || card.id.includes('4')  
                                      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' // Warm
                                      : card.id.includes('6')
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' // Cold
                                        : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200' // Dormant
                                } rounded-full flex-shrink-0 relative group`}>
                                  {card.messages}
                                </span>
                              ) : (
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                  card.id.includes('1') || card.id.includes('5') 
                                    ? 'bg-red-500' // Hot
                                    : card.id.includes('3') || card.id.includes('4')  
                                      ? 'bg-orange-500' // Warm
                                      : card.id.includes('6')
                                        ? 'bg-blue-500' // Cold
                                        : 'bg-gray-500' // Dormant
                                }`}></div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pipeline Editor Modal */}
        {showPipelineEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Pipeline</h2>
                <button 
                  onClick={handleCloseEditor}
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
                    Pipeline Name
                  </label>
                  <input
                    type="text"
                    value={editingPipelineName}
                    onChange={handlePipelineNameChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pipeline Stages
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Add up to 10 stages in your pipeline
                  </p>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                      Stages
                    </div>
                    
                    <DragDropContext onDragEnd={handleStageReorder}>
                      <Droppable droppableId="stages" type="STAGE">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="divide-y divide-gray-200 dark:divide-gray-700"
                          >
                            {editingStages.map((stage, index) => (
                              <Draggable key={stage.id} draggableId={stage.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750"
                                  >
                                    <div 
                                      {...provided.dragHandleProps}
                                      className="mr-2 cursor-grab text-gray-400"
                                    >
                                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 8h10M7 12h10M7 16h10" />
                                      </svg>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 flex-1">
                                      <div className={`w-3 h-3 rounded-full ${getColorClass(stage.color)}`}></div>
                                      
                                      <input
                                        type="text"
                                        value={stage.name}
                                        onChange={(e) => handleStageNameChange(stage.id, e.target.value)}
                                        className="flex-1 border-0 focus:ring-0 p-0 text-sm bg-transparent focus:outline-none text-gray-700 dark:text-gray-300"
                                      />
                                      
                                      <select
                                        value={stage.color}
                                        onChange={(e) => handleStageColorChange(stage.id, e.target.value)}
                                        className="text-xs border-0 bg-transparent focus:ring-0 p-0 text-gray-500 dark:text-gray-400"
                                      >
                                        <option value="blue">Blue</option>
                                        <option value="indigo">Indigo</option>
                                        <option value="purple">Purple</option>
                                        <option value="green">Green</option>
                                        <option value="gray">Gray</option>
                                      </select>
                                    </div>
                                    
                                    <button
                                      onClick={() => handleDeleteStage(stage.id)}
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                    
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 flex items-center">
                      <input
                        type="text"
                        placeholder="Add stage"
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={handleAddStage}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-r-md transition-colors"
                      >
                        Add stage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
                <button
                  onClick={handleCloseEditor}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePipeline}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 