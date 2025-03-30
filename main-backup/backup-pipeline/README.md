# Pipeline Page Backup

This directory contains a complete backup of the Pipeline page code and its dependencies. This backup was created on March 30, 2023.

## Contents

- `page.tsx` - The main Pipeline page component
- `pipeline.css` - Styling for the Pipeline page
- `root-page.tsx` - The root page that redirects to the Pipeline page
- `package.json` - Dependencies required for the application
- `components/` - Reusable components used by the Pipeline page
  - `AppLayout.tsx` - The main application layout component

## Dependencies

This code relies on the following key dependencies:
- Next.js 14
- React
- @hello-pangea/dnd - For drag and drop functionality
- Tailwind CSS - For styling

## Features

The Pipeline page includes the following features:
- Kanban-style board with draggable cards
- Pipeline dropdown menu with edit functionality
- Filtering and sorting capabilities
- Responsive design with dark/light mode support
- Tab-based navigation

## Restoration Instructions

To restore this backup:
1. Ensure all dependencies in package.json are installed
2. Place the files in their corresponding locations in the project structure
3. The main application entry point should redirect to the Pipeline page 