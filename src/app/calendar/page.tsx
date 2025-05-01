'use client';

import { useState, useEffect, useContext } from 'react';
import { PipelineContext } from '../../components/layout/AppLayout';

// Calendar components
const EventCard = ({ event, onClick }) => {
  // Get event type color
  const getEventColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'call':
        return 'bg-purple-100 border-purple-500 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'task':
        return 'bg-amber-100 border-amber-500 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'deadline':
        return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div 
      className={`p-2 mb-1 rounded border-l-4 cursor-pointer hover:shadow-sm ${getEventColor(event.type)}`}
      onClick={() => onClick(event)}
    >
      <div className="text-sm font-medium">{event.title}</div>
      <div className="text-xs mt-1 flex justify-between">
        <span>{event.time}</span>
        {event.deal && <span className="italic">{event.deal}</span>}
      </div>
    </div>
  );
};

// Mock calendar data
const mockEvents = {
  'May 15, 2023': [
    { id: 1, title: 'GlobalTech Sales Call', time: '10:00 AM', type: 'call', deal: 'GlobalTech Mobile App' },
    { id: 2, title: 'Team Weekly Sync', time: '2:00 PM', type: 'meeting', deal: null },
    { id: 3, title: 'Follow-up on Proposal', time: '4:30 PM', type: 'task', deal: 'Acme Corp Website' },
  ],
  'May 16, 2023': [
    { id: 4, title: 'EduLearn Demo', time: '11:00 AM', type: 'meeting', deal: 'EduLearn LMS Integration' },
    { id: 5, title: 'Proposal Deadline', time: '5:00 PM', type: 'deadline', deal: 'Sunshine Cafe POS' },
  ],
  'May 17, 2023': [
    { id: 6, title: 'Contract Review Meeting', time: '1:00 PM', type: 'meeting', deal: 'GlobalTech Mobile App' },
    { id: 7, title: 'Call with Marketing Team', time: '3:00 PM', type: 'call', deal: null },
  ],
  'May 18, 2023': [
    { id: 8, title: 'Sunshine Cafe Implementation', time: '10:30 AM', type: 'meeting', deal: 'Sunshine Cafe POS' },
    { id: 9, title: 'Send Follow-up Email', time: '2:00 PM', type: 'task', deal: 'EduLearn LMS Integration' },
  ],
  'May 19, 2023': [
    { id: 10, title: 'Quarterly Planning', time: '9:00 AM', type: 'meeting', deal: null },
    { id: 11, title: 'Design Review', time: '1:00 PM', type: 'meeting', deal: 'Acme Corp Website' },
    { id: 12, title: 'Contract Deadline', time: '6:00 PM', type: 'deadline', deal: 'GlobalTech Mobile App' },
  ]
};

// Calendar view options
const calendarViews = ['Month', 'Week', 'Day', 'List'];

export default function CalendarPage() {
  // States for calendar
  const [selectedDate, setSelectedDate] = useState('May 15, 2023');
  const [selectedView, setSelectedView] = useState('Week');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Get the selected pipeline from context
  const { selectedPipeline } = useContext(PipelineContext);

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Close event modal
  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  // Mock dates for the week view
  const weekDates = [
    'May 15, 2023',
    'May 16, 2023',
    'May 17, 2023',
    'May 18, 2023',
    'May 19, 2023'
  ];

  // Filter events based on selected pipeline
  const filteredEvents = {};
  Object.keys(mockEvents).forEach(date => {
    if (selectedPipeline === "All Pipelines") {
      filteredEvents[date] = mockEvents[date];
    } else {
      // For specific pipelines, only show events linked to deals or with no deal
      filteredEvents[date] = mockEvents[date].filter(event => {
        if (!event.deal) return true;
        if (selectedPipeline === "Sales Pipeline" && 
            (event.deal.includes("GlobalTech") || event.deal.includes("Acme"))) {
          return true;
        }
        if (selectedPipeline === "Support Pipeline" && 
            (event.deal.includes("Sunshine") || event.deal.includes("EduLearn"))) {
          return true;
        }
        return false;
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Calendar header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            New Event
          </button>
        </div>
      </div>

      {/* Calendar toolbar */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-medium">May 15 - May 19, 2023</h2>
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="ml-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30">
            Today
          </button>
        </div>
        
        {/* View selector */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md">
          {calendarViews.map((view) => (
            <button
              key={view}
              className={`px-3 py-1.5 text-sm font-medium ${
                selectedView === view 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              } rounded-md`}
              onClick={() => setSelectedView(view)}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Week view calendar */}
      <div className="grid grid-cols-5 gap-4">
        {weekDates.map((date) => (
          <div 
            key={date} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="font-medium">{date.split(',')[0]}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{date.split(', ')[1]}</div>
            </div>
            <div className="p-3" style={{ minHeight: '300px' }}>
              {filteredEvents[date] && filteredEvents[date].map((event) => (
                <EventCard key={event.id} event={event} onClick={handleEventClick} />
              ))}
              {(!filteredEvents[date] || filteredEvents[date].length === 0) && (
                <div className="text-center py-4 text-gray-400 dark:text-gray-600">
                  No events
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Event detail modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium">Event Details</h3>
              <button 
                onClick={closeEventModal}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h4 className="text-xl font-medium mb-2">{selectedEvent.title}</h4>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{selectedDate} at {selectedEvent.time}</span>
                </div>
                {selectedEvent.deal && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Related to: {selectedEvent.deal}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="capitalize">{selectedEvent.type}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={closeEventModal}
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 