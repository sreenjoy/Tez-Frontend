'use client';

import { useState } from 'react';

export default function Settings() {
  // Active tab state
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock profile data
  const [profile, setProfile] = useState({
    name: 'Patrick Collison',
    email: 'patrick@frib.ai',
    phone: '+1 (555) 123-4567',
    role: 'Sales Manager',
    timeZone: 'Pacific Time (PT)',
    language: 'English',
    avatar: 'P',
    avatarColor: 'bg-blue-600'
  });
  
  // Mock notification settings
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    dealUpdates: true,
    taskReminders: true,
    teamActivity: false,
    newMessages: true,
    marketingEmails: false
  });
  
  // Mock security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30 minutes',
    passwordLastChanged: '2 months ago',
    loginHistory: [
      { device: 'Mac - Chrome', location: 'San Francisco, CA', time: 'Now' },
      { device: 'iPhone - Mobile App', location: 'San Francisco, CA', time: '2 days ago' },
      { device: 'Mac - Safari', location: 'New York, NY', time: '1 week ago' }
    ]
  });
  
  // Mock integrations
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Google Calendar', connected: true, lastSync: '10 minutes ago' },
    { id: 2, name: 'Gmail', connected: true, lastSync: '10 minutes ago' },
    { id: 3, name: 'Slack', connected: false, lastSync: 'Never' },
    { id: 4, name: 'Microsoft Teams', connected: false, lastSync: 'Never' },
    { id: 5, name: 'Zoom', connected: true, lastSync: '1 hour ago' }
  ]);
  
  // Update profile handler
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert('Profile updated successfully!');
  };
  
  // Toggle notification setting
  const toggleNotification = (setting: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting]
    });
  };
  
  // Toggle 2FA
  const toggle2FA = () => {
    setSecurity({
      ...security,
      twoFactorEnabled: !security.twoFactorEnabled
    });
  };
  
  // Toggle integration
  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
      ? { ...integration, connected: !integration.connected, lastSync: !integration.connected ? 'Just now' : 'Never' } 
      : integration
    ));
  };
  
  return (
    <div className="bg-slate-900 min-h-screen">
      <header className="bg-slate-800 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="mb-4">
                <div className="flex items-center gap-3 p-2">
                  <div className={`w-10 h-10 rounded-full ${profile.avatarColor} flex items-center justify-center text-white font-medium`}>
                    {profile.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium">{profile.name}</div>
                    <div className="text-gray-400 text-sm">{profile.role}</div>
                  </div>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'profile' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
                
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'notifications' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                </button>
                
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'security' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Security
                </button>
                
                <button 
                  onClick={() => setActiveTab('integrations')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 ${
                    activeTab === 'integrations' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                  </svg>
                  Integrations
                </button>
              </nav>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                      <div className={`w-24 h-24 rounded-full ${profile.avatarColor} flex items-center justify-center text-white text-3xl font-medium`}>
                        {profile.avatar}
                      </div>
                      
                      <div>
                        <h3 className="text-white font-medium mb-2">Profile Photo</h3>
                        <p className="text-gray-400 text-sm mb-4">
                          This will be displayed on your profile and in the team members list.
                        </p>
                        <div className="flex gap-3">
                          <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                            Upload
                          </button>
                          <button type="button" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input 
                          type="email" 
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Role</label>
                        <input 
                          type="text" 
                          value={profile.role}
                          onChange={(e) => setProfile({...profile, role: e.target.value})}
                          className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
                          disabled
                        />
                        <p className="text-gray-500 text-sm mt-1">Contact an admin to change your role</p>
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Time Zone</label>
                        <select 
                          value={profile.timeZone}
                          onChange={(e) => setProfile({...profile, timeZone: e.target.value})}
                          className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
                        >
                          <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                          <option value="Mountain Time (MT)">Mountain Time (MT)</option>
                          <option value="Central Time (CT)">Central Time (CT)</option>
                          <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Language</label>
                        <select 
                          value={profile.language}
                          onChange={(e) => setProfile({...profile, language: e.target.value})}
                          className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-700 pt-6">
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b border-slate-700 pb-4">
                      <h3 className="text-white font-medium mb-4">Email Notifications</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-300">Daily Digest</div>
                            <div className="text-gray-500 text-sm">Receive a daily summary of your activities</div>
                          </div>
                          <button 
                            onClick={() => toggleNotification('emailDigest')}
                            className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                              notifications.emailDigest ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full bg-white transform transition-transform mx-0.5`}></span>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-300">Deal Updates</div>
                            <div className="text-gray-500 text-sm">Notifications when deals change status</div>
                          </div>
                          <button 
                            onClick={() => toggleNotification('dealUpdates')}
                            className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                              notifications.dealUpdates ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full bg-white transform transition-transform mx-0.5`}></span>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-300">Task Reminders</div>
                            <div className="text-gray-500 text-sm">Notifications for upcoming and overdue tasks</div>
                          </div>
                          <button 
                            onClick={() => toggleNotification('taskReminders')}
                            className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                              notifications.taskReminders ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full bg-white transform transition-transform mx-0.5`}></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-b border-slate-700 pb-4">
                      <h3 className="text-white font-medium mb-4">System Notifications</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-300">Team Activity</div>
                            <div className="text-gray-500 text-sm">Notifications for team member actions</div>
                          </div>
                          <button 
                            onClick={() => toggleNotification('teamActivity')}
                            className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                              notifications.teamActivity ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full bg-white transform transition-transform mx-0.5`}></span>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-300">New Messages</div>
                            <div className="text-gray-500 text-sm">Notifications for new chat messages</div>
                          </div>
                          <button 
                            onClick={() => toggleNotification('newMessages')}
                            className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                              notifications.newMessages ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full bg-white transform transition-transform mx-0.5`}></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-4">Marketing Notifications</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-300">Marketing Emails</div>
                            <div className="text-gray-500 text-sm">Receive product updates and feature announcements</div>
                          </div>
                          <button 
                            onClick={() => toggleNotification('marketingEmails')}
                            className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                              notifications.marketingEmails ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full bg-white transform transition-transform mx-0.5`}></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-8">
                    <div className="border-b border-slate-700 pb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                          <p className="text-gray-500 text-sm">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button 
                          onClick={toggle2FA}
                          className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                            security.twoFactorEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full bg-white transform transition-transform mx-0.5`}></span>
                        </button>
                      </div>
                      
                      {security.twoFactorEnabled ? (
                        <div className="bg-slate-700 rounded-lg p-4">
                          <p className="text-green-400 font-medium mb-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                            Two-factor authentication is enabled
                          </p>
                          <p className="text-gray-400 text-sm">
                            Your account is protected with an authenticator app
                          </p>
                        </div>
                      ) : (
                        <div className="bg-slate-700 rounded-lg p-4">
                          <p className="text-yellow-400 font-medium mb-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                            Two-factor authentication is not enabled
                          </p>
                          <p className="text-gray-400 text-sm mb-3">
                            We recommend enabling 2FA to secure your account
                          </p>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                            Set Up 2FA
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-b border-slate-700 pb-6">
                      <h3 className="text-white font-medium mb-4">Password</h3>
                      
                      <div className="bg-slate-700 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-300">Password last changed</p>
                            <p className="text-gray-500 text-sm">{security.passwordLastChanged}</p>
                          </div>
                          <button className="text-blue-400 hover:text-blue-300">
                            Change Password
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-300">Session timeout</p>
                            <p className="text-gray-500 text-sm">Automatically log out after inactivity</p>
                          </div>
                          <select 
                            value={security.sessionTimeout}
                            onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                            className="bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-1"
                          >
                            <option value="15 minutes">15 minutes</option>
                            <option value="30 minutes">30 minutes</option>
                            <option value="1 hour">1 hour</option>
                            <option value="4 hours">4 hours</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-4">Login History</h3>
                      
                      <div className="bg-slate-700 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-slate-800">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-600">
                            {security.loginHistory.map((login, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{login.device}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{login.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{login.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Integrations */}
              {activeTab === 'integrations' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Integrations</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {integrations.map(integration => (
                      <div key={integration.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">{integration.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {integration.connected ? (
                              <>
                                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                                Connected • Last sync: {integration.lastSync}
                              </>
                            ) : (
                              <>
                                <span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                                Not connected
                              </>
                            )}
                          </p>
                        </div>
                        <button 
                          onClick={() => toggleIntegration(integration.id)}
                          className={`px-4 py-2 rounded-lg transition ${
                            integration.connected 
                            ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {integration.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-700">
                    <h3 className="text-white font-medium mb-4">Add New Integration</h3>
                    <div className="flex gap-4">
                      <select className="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 flex-1">
                        <option value="">Select an integration...</option>
                        <option value="hubspot">HubSpot</option>
                        <option value="salesforce">Salesforce</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                      </select>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 