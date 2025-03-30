"use client"

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '../../components/ThemeToggle'

// Reusable components to reduce duplication
const InputField = ({ type, placeholder, icon }) => (
  <div className="relative">
    <input 
      type={type} 
      placeholder={placeholder}
      className="w-full px-4 py-3 pl-10 rounded-lg border border-color bg-card/70 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm shadow-sm"
    />
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </div>
  </div>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PasswordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0110 0v4"></path>
  </svg>
);

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)
  
  return (
    <div className="min-h-screen flex">
      {/* Left side with branding and features */}
      <div className="hidden lg:flex flex-col w-1/2 p-12 justify-between bg-gradient-to-br from-blue-600/90 via-indigo-700/80 to-violet-800/90 dark:from-blue-900 dark:via-indigo-950 dark:to-violet-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 dark:via-white/5 dark:to-white/5"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent dark:from-black/30"></div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-white">
            <div className="relative w-8 h-8 bg-white/10 rounded-full p-1 shadow-inner backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-shadow">tez.social</span>
          </Link>
          
          <div className="mt-32">
            <h1 className="text-4xl font-bold mb-4 text-white text-shadow-lg">
              Streamline your Telegram business communication
            </h1>
            
            <div className="space-y-8 mt-12">
              {/* Feature 1 - Privacy First - Lock Icon */}
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg transform transition-transform group-hover:scale-110">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M17 11H7C5.89543 11 5 11.8954 5 13V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V13C19 11.8954 18.1046 11 17 11Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="white" stroke="white" strokeWidth="2" />
                    <path d="M8 11V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-white/90 text-shadow group-hover:text-white transition-colors">Privacy-First: No message storage</div>
              </div>
              
              {/* Feature 2 - Never miss a lead - Lightning Icon */}
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg transform transition-transform group-hover:scale-110">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-300">
                    <path d="M13 2L4.9 12.2C4.77293 12.3555 4.69543 12.5438 4.67709 12.7422C4.65875 12.9407 4.7004 13.1397 4.79487 13.3138C4.88934 13.488 5.03227 13.6294 5.20746 13.7221C5.38265 13.8148 5.58211 13.8545 5.78 13.836H11V21.266C11 21.8 11.6 22.134 12 21.734L21.133 11.8C21.2532 11.6411 21.324 11.4486 21.3351 11.2479C21.3462 11.0472 21.2972 10.8479 21.1944 10.6754C21.0916 10.503 20.9395 10.3652 20.7563 10.2783C20.5731 10.1914 20.3667 10.1593 20.165 10.186H14.6V2.8C14.6 2.134 13.929 1.734 13.267 2.134L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
                <div className="text-white/90 text-shadow group-hover:text-white transition-colors">Never miss a lead in your groups</div>
              </div>
              
              {/* Feature 3 - Complete visibility - Chart Icon */}
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg transform transition-transform group-hover:scale-110">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="2" fill="white" fillOpacity="0.1" />
                    <rect x="5" y="13" width="3" height="6" rx="1" fill="#60A5FA" />
                    <rect x="11" y="5" width="3" height="14" rx="1" fill="#34D399" />
                    <rect x="17" y="9" width="3" height="10" rx="1" fill="#F472B6" />
                  </svg>
                </div>
                <div className="text-white/90 text-shadow group-hover:text-white transition-colors">Complete visibility of your deal flow</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-white/70 relative z-10 text-shadow">
          Built for Web3 teams - secure, efficient, and privacy-focused.
        </div>
      </div>
      
      {/* Right side with auth form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background bg-gradient-to-br from-background via-background to-gray-100/30 dark:from-background dark:via-background dark:to-gray-800/10 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-xl mx-auto w-full">
          <div className="w-full backdrop-blur-sm rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.25)] p-10 bg-white/40 dark:bg-gray-900/40">
            <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              Welcome to tez.social
            </h2>
            <p className="text-center text-muted mb-8">
              Your all-in-one solution for managing customer relationships
            </p>
            
            {/* Tabs */}
            <div className="flex mb-8 border border-color rounded-lg overflow-hidden shadow-md">
              <button
                className={`flex-1 py-3 text-center transition-all ${
                  isSignIn 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'bg-muted text-muted hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsSignIn(true)}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-3 text-center transition-all ${
                  !isSignIn 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                    : 'bg-muted text-muted hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsSignIn(false)}
              >
                Sign Up
              </button>
            </div>
            
            {isSignIn ? (
              <>
                <p className="text-sm mb-6 text-muted">
                  Enter your email and password to sign in
                </p>
                
                <form className="space-y-5 w-full">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <InputField 
                      type="email" 
                      placeholder="your.email@example.com" 
                      icon={<EmailIcon />}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <InputField 
                      type="password" 
                      placeholder="••••••••" 
                      icon={<PasswordIcon />}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 border border-color bg-card rounded focus:ring-1 focus:ring-blue-500 focus:ring-offset-0"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-muted">
                        Remember me
                      </label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:text-blue-600 transition-colors hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign In
                  </button>
                </form>
                
                <div className="mt-8">
                  <div className="relative flex items-center">
                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
                    <div className="mx-4 text-sm text-muted font-medium">OR CONTINUE WITH</div>
                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="w-full flex items-center justify-center gap-3 py-3 border border-color rounded-lg bg-card/70 hover:bg-card shadow-sm hover:shadow-md transition-all backdrop-blur-sm">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span className="font-medium">Google</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm mb-6 text-muted">
                  Create your account to get started
                </p>
                
                <form className="space-y-5 w-full">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <InputField 
                      type="email" 
                      placeholder="your.email@example.com" 
                      icon={<EmailIcon />}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <InputField 
                      type="password" 
                      placeholder="••••••••" 
                      icon={<PasswordIcon />}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <InputField 
                      type="password" 
                      placeholder="••••••••" 
                      icon={<PasswordIcon />}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </button>

                  <div className="mt-15 text-center">
                    <p className="text-sm text-muted">
                      Already have an account?{" "}
                      <button 
                        onClick={() => setIsSignIn(true)} 
                        className="text-blue-500 hover:text-blue-600 transition-colors hover:underline font-medium"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 