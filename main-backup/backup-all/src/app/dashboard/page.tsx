"use client"

import AppLayout from '../../components/layout/AppLayout'

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Deals</h3>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-green-600 dark:text-green-400">+2 this week</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Revenue</h3>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">$52,500</div>
              <div className="text-xs text-green-600 dark:text-green-400">+12% this month</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Response Time</h3>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">1.8 hrs</div>
              <div className="text-xs text-green-600 dark:text-green-400">-15% this week</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                    U
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">You</span> added a comment to <span className="font-medium">Acme Corp Website Redesign</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Tasks Due</h2>
            <div className="space-y-3">
              {[
                "Follow up with GlobalTech",
                "Send proposal to FitLife",
                "Review EduLearn contract",
                "Schedule demo with Sunshine Cafe"
              ].map((task, index) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">{task}</span>
                </div>
              ))}
              
              <button className="w-full mt-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 