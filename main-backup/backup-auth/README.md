# Auth Page Backup

This directory contains a complete backup of the Auth page code and its dependencies. This backup was created on March 30, 2023.

## Contents

- `page.tsx` - The main Auth page component
- `root-page.tsx` - The root page that redirects to the Pipeline page
- `package.json` - Dependencies required for the application
- `components/` - Reusable components used by the Auth page
  - `AppLayout.tsx` - The main application layout component

## Features

The Auth page includes the following features:
- Sign In and Sign Up tabs for user authentication
- Form validation
- Remember me functionality
- Password recovery option
- OAuth integration (Google)
- Responsive design with dark/light mode support
- Beautiful gradient backgrounds and animations

## Implementation Details

The Auth page is implemented as a client-side component that manages its own state for:
- Current tab (Sign In/Sign Up)
- Form fields
- Remember me checkbox

The page features a split layout with:
- Left side: Brand information and feature highlights
- Right side: Authentication forms with tabbed navigation

## Dependencies

This code relies on the following key dependencies:
- Next.js 14
- React
- Tailwind CSS - For styling

## Restoration Instructions

To restore this backup:
1. Ensure all dependencies in package.json are installed
2. Place the files in their corresponding locations in the project structure
3. The auth page should be accessible at `/auth` 