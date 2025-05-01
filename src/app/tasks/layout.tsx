'use client';

import { ReactNode } from 'react';
import AppLayout from '../../components/layout/AppLayout';

export default function TasksLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppLayout headerTitle="Tasks">
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-[#131823]">
        {children}
      </main>
    </AppLayout>
  );
} 