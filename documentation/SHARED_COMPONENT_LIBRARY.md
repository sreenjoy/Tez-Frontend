# Tez Shared Component Library

This document outlines the structure, usage, and contribution guidelines for the Tez Shared Component Library, designed to maintain consistency across feature repositories and the main Tez-Frontend application.

## Overview

The Shared Component Library provides reusable UI components, hooks, utilities, and styling that ensures a consistent look and feel across all Tez features, regardless of which repository they're developed in.

## Repository Structure

```
tez-components/
├── components/         # Core UI components
│   ├── buttons/
│   ├── cards/
│   ├── forms/
│   ├── layout/
│   ├── navigation/
│   └── data-display/
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Global styles and themes
├── icons/              # SVG icons and icon components
├── constants/          # Shared constants
├── types/              # TypeScript type definitions
├── tests/              # Test utilities and shared tests
└── examples/           # Example usage and documentation
```

## Installation

### From npm (recommended for feature repositories)

```bash
npm install @tez/components
```

### From GitHub (for development)

```bash
npm install github:yourusername/tez-components
```

## Usage

### Importing Components

```jsx
// Import specific components
import { Button, Card, TextField } from '@tez/components';

// Import hooks
import { useDebounce, useLocalStorage } from '@tez/components/hooks';

// Import utilities
import { formatCurrency, truncateText } from '@tez/components/utils';
```

### Using Styles and Themes

```jsx
// Import global styles in your _app.js or equivalent
import '@tez/components/styles/global.css';

// Use theme provider
import { ThemeProvider, theme } from '@tez/components/styles';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

## Development Workflow

### Setup for Component Development

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/tez-components.git
   cd tez-components
   npm install
   ```

2. Start the development environment
   ```bash
   npm run dev
   ```

3. Build the library
   ```bash
   npm run build
   ```

### Adding a New Component

1. Create component files
   ```bash
   mkdir -p components/my-category/MyComponent
   touch components/my-category/MyComponent/index.tsx
   touch components/my-category/MyComponent/MyComponent.tsx
   touch components/my-category/MyComponent/styles.module.css
   touch components/my-category/MyComponent/MyComponent.test.tsx
   ```

2. Implement the component following established patterns
3. Add tests using the project's testing library
4. Document usage examples
5. Add the export to the appropriate barrel file

### Testing Components

```bash
# Run all tests
npm test

# Run tests for a specific component
npm test -- components/buttons/Button

# Run tests with coverage
npm test -- --coverage
```

## Versioning and Releases

The library follows Semantic Versioning (SemVer):
- **Major version**: Breaking changes
- **Minor version**: New features, no breaking changes
- **Patch version**: Bug fixes and minor improvements

### Updating Dependencies in Feature Repositories

Always pin to specific versions in feature repositories to ensure consistency:

```json
"dependencies": {
  "@tez/components": "1.2.3"
}
```

## Component Guidelines

### Design Principles

1. **Consistency**: Follow established design patterns
2. **Composability**: Components should be composable
3. **Accessibility**: Follow WCAG 2.1 AA standards
4. **Responsiveness**: Components should work on all screen sizes
5. **Performance**: Keep bundle size minimal, optimize render performance

### Code Style

- Use TypeScript for type safety
- Follow project ESLint and Prettier configurations
- Implement meaningful tests with good coverage
- Document props, behaviors, and examples

## Integration with Feature Repositories

### As an npm Dependency

Feature repositories should install the shared component library as a dependency and import components as needed.

### Using GitHub Submodules (Alternative)

If npm distribution isn't appropriate, you can use submodules:

```bash
# In a feature repository
git submodule add https://github.com/yourusername/tez-components.git libs/tez-components
git submodule update --init --recursive
```

Then update import paths accordingly:

```jsx
import { Button } from '../../libs/tez-components/components';
```

## Contribution Process

1. **Fork the repository**: Create your own fork
2. **Create a feature branch**: `git checkout -b feature/my-new-component`
3. **Make changes**: Implement your component or fix
4. **Test**: Ensure all tests pass
5. **Document**: Update documentation
6. **Submit PR**: Create a pull request with detailed description

## Review Criteria for New Components

- Meets design specifications
- Follows accessibility guidelines
- Passes all tests
- Has appropriate documentation
- Follows code style guidelines
- Maintains backward compatibility (unless a major version)

## Troubleshooting

### Common Issues

- **Component not found**: Check import paths and exports
- **Styling inconsistencies**: Ensure global styles are imported
- **Type errors**: Verify TypeScript types match implementation
- **Versioning conflicts**: Check for peer dependency conflicts

For more help, contact the team in the #tez-components Slack channel. 