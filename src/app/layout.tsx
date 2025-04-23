import '../styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { ThemeProvider } from '../components/ThemeProvider'

// Load the Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] })

// Metadata for the application
export const metadata: Metadata = {
  title: 'frib.ai | AI-Powered Sales CRM',
  description: 'Simplify your sales process with AI-powered insights, intelligent pipeline management, and automated deal tracking.',
}

// Root layout component that wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 