'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Patrick Collison",
    role: "Sales Manager",
    email: "patrick@frib.ai",
    avatar: "P",
    avatarColor: "bg-blue-600",
    status: "online",
    deals: 12,
    tasks: 5,
    lastActive: "Just now"
  },
  {
    id: 2,
    name: "Tim Apple",
    role: "Account Executive",
    email: "tim@frib.ai",
    avatar: "T",
    avatarColor: "bg-purple-600",
    status: "online",
    deals: 8,
    tasks: 3,
    lastActive: "5m ago"
  },
  {
    id: 3,
    name: "Ashley Smith",
    role: "Sales Development",
    email: "ashley@frib.ai",
    avatar: "A",
    avatarColor: "bg-green-600",
    status: "away",
    deals: 5,
    tasks: 2,
    lastActive: "1h ago"
  },
  {
    id: 4,
    name: "Jensen Wong",
    role: "Customer Success",
    email: "jensen@frib.ai",
    avatar: "J",
    avatarColor: "bg-amber-600",
    status: "offline",
    deals: 7,
    tasks: 6,
    lastActive: "Yesterday"
  },
  {
    id: 5,
    name: "Leyla Hariri",
    role: "Account Executive",
    email: "leyla@frib.ai",
    avatar: "L",
    avatarColor: "bg-red-600",
    status: "online",
    deals: 10,
    tasks: 4,
    lastActive: "Just now"
  },
  {
    id: 6,
    name: "Sam Bankman",
    role: "Sales Development",
    email: "sam@frib.ai",
    avatar: "S",
    avatarColor: "bg-indigo-600",
    status: "offline",
    deals: 4,
    tasks: 2,
    lastActive: "2d ago"
  }
];

export default function Team() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  
  // Apply filters
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus ? member.status === filterStatus : true;
    const matchesRole = filterRole ? member.role === filterRole : true;
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  // Get unique roles for filter
  const roles = Array.from(new Set(teamMembers.map(member => member.role)));
  
  return (
    <div className="bg-slate-900 min-h-screen">
      <header className="bg-slate-800 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Team</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              Add Team Member
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 w-full md:w-64 pl-10"
              />
              <div className="absolute left-3 top-2.5 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <select 
              value={filterStatus || ''} 
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2"
            >
              <option value="">All Statuses</option>
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
            
            <select 
              value={filterRole || ''} 
              onChange={(e) => setFilterRole(e.target.value || null)}
              className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-4">
            <button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>
          </div>
        </div>
        
        {/* Team Members Table */}
        <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Deals</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Tasks</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${member.avatarColor} flex items-center justify-center text-white font-medium`}>
                        {member.avatar}
                      </div>
                      <div>
                        <div className="text-white font-medium">{member.name}</div>
                        <div className="text-gray-400 text-sm">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        member.status === 'online' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-gray-300 capitalize">{member.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.deals}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.tasks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{member.lastActive}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-blue-500 hover:text-blue-400 p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-red-500 hover:text-red-400 p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty state for when no members match filters */}
        {filteredMembers.length === 0 && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No team members found</h3>
            <p className="text-gray-400 text-center max-w-md mb-4">
              No team members match your current filters. Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus(null);
                setFilterRole(null);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 