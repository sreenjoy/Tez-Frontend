# Tez Frontend - CRM Application

## Overview

Tez Frontend is a modern CRM application built with Next.js, Tailwind CSS, and React. It provides comprehensive sales pipeline management, AI assistance, and real-time deal tracking.

## Key Features

- **Dashboard**: Comprehensive overview of sales metrics and KPIs
- **Pipeline Management**: Kanban-style interface for managing deals
- **Deal Detail**: Detailed information and history for each deal
- **AI Assistant**: AI-powered Q&A interface with organization-specific knowledge
- **Authentication**: Secure login and user management
- **Chat Sync**: Integration with external messaging platforms

## Pages

1. **Dashboard** (`/dashboard`)
   - KPI summary cards
   - Sales performance charts
   - Active deals list
   - Tasks overview
   - Recent activity feed
   - Chat volume analytics

2. **Pipeline** (`/pipeline`)
   - Kanban board with customizable stages
   - Deal card management
   - Drag-and-drop interface
   - Pipeline filters and search
   - Deal creation and editing

3. **Deal** (`/deal/[id]`)
   - Parameter-based routing for specific deals
   - Deal details and contacts
   - Communication history
   - Deal stage timeline
   - Associated tasks and documents

4. **AI Assistant** (`/ai-assistant`)
   - Organization data training status
   - Q&A testing interface
   - Feedback collection system
   - Organization knowledge base

5. **Authentication** (`/auth`)
   - Login and registration forms
   - Password recovery
   - OAuth integration

## Documentation

The application includes extensive documentation:

- **Page Documentation**: Each page has a dedicated markdown file in `documentation/pages/`
- **Complete Documentation**: Comprehensive guide in `documentation/COMPLETE-DOCUMENTATION.md`
- **API Reference**: Technical documentation in `documentation/api-reference.md`
- **Architecture**: Details about the application architecture and design patterns
- **Screenshots**: Visual references for all UI components (when development server is running)

## Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/sreenjoy/Tez-Frontend.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3010](http://localhost:3010) in your browser

### Documentation Generation

To generate documentation and screenshots (requires running dev server):

```
npm run docs:screenshots
```

## Technology Stack

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Shadcn UI
- **Charts**: Recharts
- **Testing**: Jest and React Testing Library
- **Documentation**: Custom Puppeteer-based screenshot and documentation generator

## Project Structure

- `/src/app/*` - Next.js app router pages and layouts
- `/src/components/*` - Reusable UI components
- `/src/contexts/*` - React contexts for state management
- `/src/lib/*` - Utility functions and helpers
- `/public/*` - Static assets and images
- `/documentation/*` - Generated documentation and screenshots

## Contributing

See the [CONTRIBUTING.md](documentation/CONTRIBUTING.md) document for guidelines on contributing to this project.

## License

This project is licensed under the MIT License. 