# Organization Info Page Backup

This directory contains a complete backup of the Organization Info page code and its dependencies. This backup was created on March 30, 2023.

## Contents

- `page.tsx` - The main Organization Info page component
- `root-page.tsx` - The root page that redirects to the Pipeline page
- `package.json` - Dependencies required for the application
- `components/` - Reusable components used by the Organization Info page
  - `AppLayout.tsx` - The main application layout component

## Features

The Organization Info page includes the following features:
- Onboarding form for organization details
- Well-structured input fields for user information
- Dynamic form behavior based on selected options
- Responsive design with dark/light mode support
- Modern UI with glassmorphism effects

## Implementation Details

The Organization Info page is implemented as a client-side component that:
- Collects and validates user and organization information
- Adapts form fields based on user selection (e.g., shows additional fields if "Other" role is selected)
- Manages form state using React hooks
- Implements TypeScript interfaces for type safety
- Uses reusable components for form elements

The page features:
- Input fields for user name, company name, and website
- Dropdown selectors for role, team size, and purpose
- Conditional rendering based on form state

## Dependencies

This code relies on the following key dependencies:
- Next.js 14
- React
- TypeScript
- Tailwind CSS - For styling

## Restoration Instructions

To restore this backup:
1. Ensure all dependencies in package.json are installed
2. Place the files in their corresponding locations in the project structure
3. The organization info page should be accessible at `/organization-info` 