# Dashboard Page Backup

This directory contains a complete backup of the Dashboard page code and its dependencies. This backup was created on March 30, 2023.

## Contents

- `page.tsx` - The main Dashboard page component
- `root-page.tsx` - The root page that redirects to the Pipeline page
- `package.json` - Dependencies required for the application
- `components/` - Reusable components used by the Dashboard page
  - `AppLayout.tsx` - The main application layout component

## Features

The Dashboard page includes the following features:
- Overview statistics with key metrics
- Recent activity feed
- Task management with due dates
- Responsive card layout
- Dark/light mode support

## Implementation Details

The Dashboard page is implemented as a client-side component that displays:
- Key metrics cards (Total Deals, Active Revenue, Avg. Response Time)
- Recent activity timeline
- Task management list with checkboxes

The page utilizes a responsive grid layout that adapts to different screen sizes.

## Dependencies

This code relies on the following key dependencies:
- Next.js 14
- React
- Tailwind CSS - For styling

## Restoration Instructions

To restore this backup:
1. Ensure all dependencies in package.json are installed
2. Place the files in their corresponding locations in the project structure
3. The dashboard page should be accessible at `/dashboard` 