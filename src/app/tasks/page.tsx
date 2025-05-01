'use client';

import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string;
  relatedDeal?: string;
  createdAt: string;
}

export default function Tasks() {
  // Task status tabs
  const statuses = ['all', 'pending', 'in-progress', 'completed', 'overdue'];
  const [activeTab, setActiveTab] = useState('all');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Mock tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Call John about the proposal',
      description: 'Follow up on the sales proposal sent last week',
      dueDate: '2023-06-15',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Patrick Collison',
      relatedDeal: 'Acme Corp - Enterprise Plan',
      createdAt: '2023-06-10',
    },
    {
      id: 2,
      title: 'Prepare presentation for executive meeting',
      description: 'Create slides for the quarterly review',
      dueDate: '2023-06-18',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Patrick Collison',
      relatedDeal: 'Globex - Premium Plan',
      createdAt: '2023-06-11',
    },
    {
      id: 3,
      title: 'Update client database',
      description: 'Add new client information to the CRM',
      dueDate: '2023-06-14',
      priority: 'low',
      status: 'completed',
      assignedTo: 'Sarah Johnson',
      createdAt: '2023-06-12',
    },
    {
      id: 4,
      title: 'Schedule demo with potential client',
      description: 'Find a suitable time for product demonstration',
      dueDate: '2023-06-13',
      priority: 'high',
      status: 'overdue',
      assignedTo: 'Patrick Collison',
      relatedDeal: 'TechCorp - Standard Plan',
      createdAt: '2023-06-09',
    },
    {
      id: 5,
      title: 'Finalize contract details',
      description: 'Review legal terms and pricing',
      dueDate: '2023-06-20',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Mike Wilson',
      relatedDeal: 'Initech - Enterprise Plan',
      createdAt: '2023-06-13',
    },
    {
      id: 6,
      title: 'Send follow-up email',
      description: 'Thank client for the meeting and summarize next steps',
      dueDate: '2023-06-16',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Patrick Collison',
      relatedDeal: 'Acme Corp - Enterprise Plan',
      createdAt: '2023-06-13',
    },
    {
      id: 7,
      title: 'Research competitor pricing',
      description: 'Gather information on competitive offers',
      dueDate: '2023-06-25',
      priority: 'low',
      status: 'in-progress',
      assignedTo: 'Sarah Johnson',
      createdAt: '2023-06-14',
    },
    {
      id: 8,
      title: 'Prepare monthly sales report',
      description: 'Compile sales data and create summary report',
      dueDate: '2023-06-30',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Mike Wilson',
      createdAt: '2023-06-14',
    },
  ]);
  
  // Function to mark task as completed
  const completeTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: 'completed' } : task
    ));
  };
  
  // Function to update task status
  const updateTaskStatus = (id: number, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };
  
  // Function to delete task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Filter and sort tasks based on current filters
  const filteredTasks = tasks
    .filter(task => {
      // Filter by status
      if (activeTab !== 'all' && task.status !== activeTab) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by priority
      if (filterPriority !== 'all' && task.priority !== filterPriority) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'dueDate') {
        return sortOrder === 'asc' 
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      
      if (sortBy === 'priority') {
        const priorityWeight = { low: 1, medium: 2, high: 3 };
        return sortOrder === 'asc'
          ? priorityWeight[a.priority] - priorityWeight[b.priority]
          : priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      
      if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      
      return 0;
    });
    
  // Count tasks by status
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    'in-progress': tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    overdue: tasks.filter(task => task.status === 'overdue').length,
  };
  
  // Add new task (mock function)
  const addNewTask = () => {
    // In a real app, this would open a modal or form
    alert('Add task functionality would open a form here');
  };
  
  return (
    <div className="bg-slate-900 min-h-screen">
      <header className="bg-slate-800 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Tasks</h1>
            <button 
              onClick={addNewTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Task
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        {/* Status Tabs */}
        <div className="mb-8">
          <div className="border-b border-slate-700">
            <nav className="flex -mb-px">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`px-6 py-3 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === status
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({taskCounts[status as keyof typeof taskCounts]})
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div>
            <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 bg-slate-800 text-white px-4 py-2 border-r border-slate-700 focus:outline-none"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-slate-800 text-white px-3 py-2 hover:bg-slate-700"
              >
                {sortOrder === 'asc' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="bg-slate-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div>
                        <button 
                          onClick={() => completeTask(task.id)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                            task.status === 'completed' 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-500 text-transparent hover:border-gray-400'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${
                          task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
                        }`}>
                          {task.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                        
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high' 
                              ? 'bg-red-900 text-red-300' 
                              : task.priority === 'medium'
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-green-900 text-green-300'
                          }`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                          
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.status === 'completed'
                              ? 'bg-green-900 text-green-300'
                              : task.status === 'overdue'
                                ? 'bg-red-900 text-red-300'
                                : task.status === 'in-progress'
                                  ? 'bg-blue-900 text-blue-300'
                                  : 'bg-gray-700 text-gray-300'
                          }`}>
                            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                          
                          {task.relatedDeal && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-gray-300">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {task.relatedDeal}
                            </span>
                          )}
                          
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-gray-300">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {task.assignedTo}
                          </span>
                          
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-gray-300">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="relative">
                        <button className="text-gray-400 hover:text-white p-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                        
                        <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg z-10 hidden">
                          <div className="py-1">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-600 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Edit
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-600 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Reschedule
                            </button>
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-600 flex items-center"
                              onClick={() => deleteTask(task.id)}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {task.status !== 'completed' && (
                  <div className="bg-slate-700 px-4 py-3 flex justify-between">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => updateTaskStatus(task.id, 'pending')}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          task.status === 'pending' 
                          ? 'bg-slate-600 text-white' 
                          : 'text-gray-400 hover:bg-slate-800'
                        }`}
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          task.status === 'in-progress' 
                          ? 'bg-slate-600 text-white' 
                          : 'text-gray-400 hover:bg-slate-800'
                        }`}
                      >
                        In Progress
                      </button>
                      <button 
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="px-3 py-1 rounded text-xs font-medium text-gray-400 hover:bg-slate-800"
                      >
                        Complete
                      </button>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Created {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-slate-800 rounded-xl p-8 text-center">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">No tasks found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or create a new task</p>
              <button 
                onClick={addNewTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 