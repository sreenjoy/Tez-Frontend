"use client"

import { useState, ChangeEvent } from 'react'
import Link from 'next/link'
import ThemeToggle from '../../components/ThemeToggle'

// Types
interface DropdownOption {
  value: string
  label: string
}

interface InputFieldProps {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  name: string
  required?: boolean
}

interface DropdownFieldProps {
  label: string
  options: DropdownOption[]
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  name: string
  required?: boolean
}

type FormData = {
  fullName: string
  companyName: string
  companyUrl: string
  role: string
  otherRole: string
  teamSize: string
  purpose: string
}

// Data constants
const roleOptions = [
  { value: "founder", label: "Founder/Co-Founder" },
  { value: "cxo", label: "C-Level Executive" },
  { value: "manager", label: "Manager" },
  { value: "developer", label: "Developer/Engineer" },
  { value: "marketing", label: "Marketing Professional" },
  { value: "sales", label: "Sales Professional" },
  { value: "other", label: "Other" }
]

const purposeOptions = [
  { value: "customer_support", label: "Customer Support" },
  { value: "lead_generation", label: "Lead Generation" },
  { value: "community", label: "Community Management" },
  { value: "sales", label: "Sales Communication" }
]

const teamSizeOptions = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" }
]

// Reusable components
const InputField = ({ label, type = "text", placeholder, value, onChange, name, required = true }: InputFieldProps) => (
  <div>
    <label className="block text-xs font-medium mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
    />
  </div>
)

const DropdownField = ({ label, options, value, onChange, name, required = true }: DropdownFieldProps) => (
  <div>
    <label className="block text-xs font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
    >
      <option value="">Select {label}</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  </div>
)

// SVG icons
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const EvenShadowCard = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-2xl backdrop-blur-sm rounded-xl border border-gray-200/40 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/80 p-6 shadow-[0_0_20px_rgba(0,0,0,0.12)] dark:shadow-[0_0_20px_rgba(0,0,0,0.35)]">
    {children}
  </div>
)

export default function OrganizationInfoPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    companyName: "",
    companyUrl: "",
    role: "",
    otherRole: "",
    teamSize: "",
    purpose: ""
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <div className="h-screen flex bg-background bg-gradient-to-br from-background via-background to-gray-100/30 dark:from-background dark:via-background dark:to-gray-800/10 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 py-2 px-4 flex justify-between items-center backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 border-b border-gray-200/20 dark:border-gray-700/20">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-semibold">
          <div className="relative w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-0.5 shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
            tez.social
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="py-1.5 px-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm font-medium text-xs backdrop-blur-sm"
            onClick={() => console.log("Logout clicked")}
          >
            <span className="flex items-center gap-1.5">
              <LogoutIcon />
              Logout
            </span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-14 px-4">
        <EvenShadowCard>
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              Tell us about your organization
            </h2>
            <p className="text-center text-xs text-muted mb-5">
              This information helps us customize your experience and provide relevant features.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 mb-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="User Name"
                  placeholder="John Appleseed"
                  value={formData.fullName}
                  onChange={handleChange}
                  name="fullName"
                />
                <InputField
                  label="Company Name"
                  placeholder="Apple Inc."
                  value={formData.companyName}
                  onChange={handleChange}
                  name="companyName"
                />
              </div>

              <InputField
                label="Company Website"
                placeholder="https://apple.com"
                type="url"
                value={formData.companyUrl}
                onChange={handleChange}
                name="companyUrl"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DropdownField
                  label="Your Role"
                  options={roleOptions}
                  value={formData.role}
                  onChange={handleChange}
                  name="role"
                />
                <DropdownField
                  label="Team Size"
                  options={teamSizeOptions}
                  value={formData.teamSize}
                  onChange={handleChange}
                  name="teamSize"
                />
              </div>

              {formData.role === "other" && (
                <InputField
                  label="Specify Your Role"
                  placeholder="Please specify your role"
                  value={formData.otherRole}
                  onChange={handleChange}
                  name="otherRole"
                />
              )}

              <DropdownField
                label="Purpose of Use"
                options={purposeOptions}
                value={formData.purpose}
                onChange={handleChange}
                name="purpose"
              />

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <span>Complete Setup</span>
                  <ArrowRightIcon />
                </button>
              </div>
            </form>
          </div>
        </EvenShadowCard>
        
        {/* Footer */}
        <div className="w-full max-w-md flex flex-col items-center justify-center pb-6">
          <div className="mt-5 text-center text-xs text-muted">
            <p>Need help? <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline">Contact support</a></p>
          </div>
          
          {/* Steps indicator */}
          <div className="mt-8 flex items-center justify-center w-full">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-white font-bold shadow-md">
                  1
                </div>
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Organization
                </div>
              </div>
              
              <div className="w-24 border-t-2 border-dashed border-blue-400 dark:border-blue-500"></div>
              
              <div className="relative">
                <div className="w-9 h-9 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 font-bold shadow-sm">
                  2
                </div>
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Connect
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 