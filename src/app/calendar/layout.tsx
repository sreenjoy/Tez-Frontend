'use client';

import { ReactNode } from 'react';
import { PipelineContext } from '../../components/layout/AppLayout';
import AppLayout from '../../components/layout/AppLayout';

export default function CalendarLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppLayout headerTitle="Calendar">
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-[#131823]">
        {children}
      </main>
    </AppLayout>
  );
} 