# Main Backup Directory

This directory contains comprehensive backups of the Tez Frontend application, created on March 30, 2023.

## Contents

### backup-all/
A complete backup of all project files, including:
- All source code
- Configuration files
- Documentation
- Screenshots
- Scripts

This backup preserves the entire codebase structure as it exists in production.

### backup-pipeline/
A focused backup of just the Pipeline page functionality, including:
- `page.tsx` - The main Pipeline page component
- `pipeline.css` - Pipeline-specific styling
- `root-page.tsx` - The root page that redirects to Pipeline
- `package.json` - Dependencies for the application
- `components/` - Components used by the Pipeline page

### backup-auth/
A focused backup of just the Authentication page functionality, including:
- `page.tsx` - The main Auth page component 
- `root-page.tsx` - The root page that redirects to Pipeline
- `package.json` - Dependencies for the application
- `components/` - Components used by the Auth page

### backup-dashboard/
A focused backup of just the Dashboard page functionality, including:
- `page.tsx` - The main Dashboard page component
- `root-page.tsx` - The root page that redirects to Pipeline
- `package.json` - Dependencies for the application
- `components/` - Components used by the Dashboard page

### backup-organization-info/
A focused backup of just the Organization Info page functionality, including:
- `page.tsx` - The main Organization Info page component
- `root-page.tsx` - The root page that redirects to Pipeline
- `package.json` - Dependencies for the application
- `components/` - Components used by the Organization Info page

## Purpose

These backups were created to:
1. Preserve the working state of the application
2. Provide a safety net during refactoring and restructuring
3. Serve as a reference point for future development
4. Enable easy rollback if needed

## Restoration Instructions

### For complete application restoration:
Copy all files from `backup-all/` to the project root directory.

### For individual page restoration:
Follow the instructions in the README.md file within each page backup directory:
- `backup-pipeline/README.md`
- `backup-auth/README.md`
- `backup-dashboard/README.md`
- `backup-organization-info/README.md`

## Version Information

This backup corresponds to the Tez Frontend application version as of March 30, 2023. 