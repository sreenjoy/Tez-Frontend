"use client";

import AppLayout from '@/components/layout/AppLayout';

export default function MessageSchedulerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout
      headerTitle={
        <div className="text-xl font-semibold">Message Scheduler</div>
      }
    >
      {children}
    </AppLayout>
  );
} 