"use client"

import { useState, useContext, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { PipelineContext } from '../../components/layout/AppLayout'

// Tab component for switching between training sections
const Tab = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 text-sm font-medium border-b-2 ${
      active
        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
)

export default function AIAssistantPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('organization')
  
  // State for form inputs
  const [organizationUrls, setOrganizationUrls] = useState('')
  const [customData, setCustomData] = useState('')
  const [pipelineTrainingData, setPipelineTrainingData] = useState('')
  const [pipelinePurpose, setPipelinePurpose] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [salesFlow, setSalesFlow] = useState('')
  const [productUSPs, setProductUSPs] = useState('')
  
  // State for file upload
  const [selectedFiles, setSelectedFiles] = useState([])
  
  // Get the selected pipeline from context
  const { selectedPipeline } = useContext(PipelineContext)
  
  // Clear pipeline-specific fields when pipeline changes
  useEffect(() => {
    setPipelineTrainingData('')
    setPipelinePurpose('')
    setTicketPrice('')
    setSalesFlow('')
    setProductUSPs('')
    setSelectedFiles([])
  }, [selectedPipeline])
  
  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
  }
  
  // Handle form submissions
  const handleOrganizationSubmit = (e) => {
    e.preventDefault()
    console.log('Organization data submitted:', { organizationUrls, customData })
    // Here you would normally send the data to your backend
    alert('Organization data submitted successfully!')
  }
  
  const handlePipelineSubmit = (e) => {
    e.preventDefault()
    console.log('Pipeline data submitted:', { 
      pipeline: selectedPipeline,
      pipelinePurpose, 
      ticketPrice, 
      salesFlow, 
      productUSPs,
      pipelineTrainingData,
      files: selectedFiles
    })
    // Here you would normally send the data to your backend
    alert('Pipeline data submitted successfully!')
  }
  
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI Assistant Training</h1>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <Tab 
              active={activeTab === 'organization'} 
              onClick={() => setActiveTab('organization')}
            >
              Organization Data
            </Tab>
            <Tab 
              active={activeTab === 'pipeline'} 
              onClick={() => setActiveTab('pipeline')}
            >
              Pipeline-Specific Data
            </Tab>
          </nav>
        </div>
        
        {/* Organization Data Tab */}
        {activeTab === 'organization' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-lg font-semibold mb-4">Organization Training Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add URLs to your documentation, knowledge base, or blog posts to help train the AI assistant 
              with your organization's specific information.
            </p>
            
            <form onSubmit={handleOrganizationSubmit}>
              {/* URLs Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Documentation URLs
                </label>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Add URLs to your GitBook, documentation, blog, or other resources (one per line)
                </div>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  placeholder="https://docs.yourdomain.com&#10;https://blog.yourdomain.com/article"
                  value={organizationUrls}
                  onChange={(e) => setOrganizationUrls(e.target.value)}
                ></textarea>
              </div>
              
              {/* Custom Data Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Training Text
                </label>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Add custom paragraphs or specific information that isn't available online
                </div>
                <textarea
                  rows={8}
                  className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  placeholder="Add specific details about your organization, products, services, or processes..."
                  value={customData}
                  onChange={(e) => setCustomData(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Organization Data
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Pipeline-Specific Data Tab */}
        {activeTab === 'pipeline' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Pipeline-Specific Training</h2>
              <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">
                {selectedPipeline}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add information specific to the selected pipeline to help train the AI assistant
              with details about your sales process, products, and customer interactions.
            </p>
            
            <form onSubmit={handlePipelineSubmit}>
              {/* Pipeline Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pipeline Purpose
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                    placeholder="What is this pipeline used for?"
                    value={pipelinePurpose}
                    onChange={(e) => setPipelinePurpose(e.target.value)}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Average Ticket Price
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                    placeholder="$5,000 - $10,000"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sales Flow Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                    placeholder="Describe your typical sales process for this pipeline..."
                    value={salesFlow}
                    onChange={(e) => setSalesFlow(e.target.value)}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product/Service USPs
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                    placeholder="What are the unique selling points of your product or service?"
                    value={productUSPs}
                    onChange={(e) => setProductUSPs(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              {/* Additional Training Data */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Training Data
                </label>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Add any other specific information that would help the AI understand this pipeline
                </div>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  placeholder="Add common questions, objections, responses, or any other relevant information..."
                  value={pipelineTrainingData}
                  onChange={(e) => setPipelineTrainingData(e.target.value)}
                ></textarea>
              </div>
              
              {/* Chat Data Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Chat Data
                </label>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Upload previous chat conversations to help train the AI (CSV, JSON, or TXT files)
                </div>
                
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100 border-gray-300 dark:border-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">CSV, JSON, or TXT files</p>
                    </div>
                    <input type="file" className="hidden" multiple onChange={handleFileChange} />
                  </label>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Selected files:</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {file.name} ({Math.round(file.size / 1024)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Pipeline Data
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Training Status Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">AI Q&A Testing</h2>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Test your AI with sample questions</span>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                {selectedPipeline}
              </span>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 max-h-[400px] overflow-y-auto p-4">
              {/* Sample conversation */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">U</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[85%]">
                    <p className="text-sm text-gray-800 dark:text-gray-200">What's the sales process for the enterprise plan?</p>
                  </div>
                </div>
                
                <div className="flex items-start justify-end">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-[85%]">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      The enterprise plan follows a 4-step sales process:
                      
                      1. Initial discovery call to understand requirements
                      2. Technical assessment meeting with stakeholders
                      3. Custom proposal presentation
                      4. Contract negotiation and closing
                      
                      The average sales cycle is 45 days with key decision makers typically being CTO, CIO or VP of Operations.
                    </p>
                    
                    <div className="flex items-center justify-end mt-2 space-x-2">
                      <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">U</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[85%]">
                    <p className="text-sm text-gray-800 dark:text-gray-200">What's our pricing for the basic plan?</p>
                  </div>
                </div>
                
                <div className="flex items-start justify-end">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-[85%]">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      The basic plan starts at $49/month when billed annually or $59/month when billed monthly. It includes:
                      
                      - Up to 5 users
                      - 25GB storage
                      - Basic analytics
                      - Email support
                      
                      We also offer a 14-day free trial with no credit card required.
                    </p>
                    
                    <div className="flex items-center justify-end mt-2 space-x-2">
                      <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Input for new questions */}
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ask a test question:
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  placeholder="Type your question..."
                ></textarea>
              </div>
              <button
                className="px-4 py-2 mb-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ask
              </button>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-md font-semibold mb-3">Training Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">87%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Response Accuracy</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">124</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Questions Tested</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">43</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Improvements Made</div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Last AI model update: <span className="font-medium">2 hours ago</span></p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 