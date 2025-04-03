import { redirect } from 'next/navigation'

export default function Home() {
  // Comment this out to test the chat-sync page
  // redirect('/pipeline')
  
  // Temporarily redirect to the chat-sync page for testing
  redirect('/chat-sync')
} 