the number # Tez.social - Pages & URLs

## Authentication

| Page | URL | Description | Nickname |
|------|-----|-------------|----------|
| Sign In/Sign Up | [/auth](http://localhost:3003/auth) | Authentication page for user login and registration | A |
| Organization Info | [/organization-info](http://localhost:3003/organization-info) | Collects organization details from first-time users | B |

## Main Application

| Page | URL | Description | Nickname |
|------|-----|-------------|----------|
| Pipeline | [/pipeline](http://localhost:3003/pipeline) | Sales pipeline with draggable deal cards | C |
| Dashboard | [/dashboard](http://localhost:3003/dashboard) | Overview dashboard with analytics and metrics | D |

## Features

- Modern authentication UI with sign in and sign up options
- Dark/Light mode toggle
- Google authentication option
- Responsive design for mobile and desktop
- Collapsible sidebar with tooltips
- Pipeline view with draggable cards
- Dashboard with key metrics

## Development

The application is built with:
- Next.js 14
- TypeScript
- Tailwind CSS

## Getting Started

```bash
# Start the development server
npm run dev
```

The application runs on http://localhost:3003 by default. 

## Layout Structure

The application uses a consistent layout approach:
- `AppLayout` component for main authenticated pages
- Pages A & B use standalone layouts
- Pages C, D and beyond use the `AppLayout` with collapsible sidebar 