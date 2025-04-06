#!/usr/bin/env node

/**
 * Feature Repository Generator
 * 
 * This script creates a new feature repository with the basic scaffolding needed
 * to start development on a specific feature for the Tez application.
 * 
 * Usage:
 *   node create-feature-repository.js [--feature=feature-name] [--description="Feature description"]
 * 
 * Example:
 *   node create-feature-repository.js --feature=analytics --description="Analytics and reporting dashboard"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Parse arguments
const args = process.argv.slice(2);
let options = {
  feature: '',
  description: ''
};

args.forEach(arg => {
  if (arg.startsWith('--feature=')) {
    options.feature = arg.replace('--feature=', '').trim();
  } else if (arg.startsWith('--description=')) {
    options.description = arg.replace('--description=', '').trim();
  }
});

// Create readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for input if not provided via command line
async function promptForOptions() {
  if (!options.feature) {
    return new Promise(resolve => {
      rl.question('Feature name (e.g., analytics): ', (answer) => {
        options.feature = answer.trim();
        
        if (!options.description) {
          rl.question('Feature description: ', (desc) => {
            options.description = desc.trim();
            resolve();
            rl.close();
          });
        } else {
          resolve();
          rl.close();
        }
      });
    });
  } else if (!options.description) {
    return new Promise(resolve => {
      rl.question('Feature description: ', (answer) => {
        options.description = answer.trim();
        resolve();
        rl.close();
      });
    });
  } else {
    rl.close();
    return Promise.resolve();
  }
}

// Format feature name
function formatFeatureName(name) {
  // Convert to kebab case for directory
  const kebabCase = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Convert to PascalCase for component names
  const pascalCase = name.split(/[-_\s]+/).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('');
  
  return {
    kebab: kebabCase,
    pascal: pascalCase
  };
}

// Create directory structure
function createDirectoryStructure(baseDir) {
  const directories = [
    'components',
    'pages',
    'styles',
    'utils',
    'hooks',
    'constants',
    'tests/unit',
    'tests/integration',
    'public/images',
    'scripts',
    'docs'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
  });
}

// Create base package.json
function createPackageJson(baseDir, formattedName) {
  // Read the main package.json to get dependencies
  const mainPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  
  const packageJson = {
    name: `tez-${formattedName.kebab}`,
    version: '0.1.0',
    private: true,
    description: options.description,
    scripts: {
      "dev": "next dev -p 3011",
      "build": "next build --no-lint",
      "start": "next start -p 3011",
      "lint": "next lint",
      "test": "jest",
      "test:integration": "jest --config=jest.integration.config.js"
    },
    dependencies: mainPackageJson.dependencies,
    devDependencies: mainPackageJson.devDependencies,
    engines: mainPackageJson.engines
  };
  
  fs.writeFileSync(
    path.join(baseDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('Created package.json');
}

// Create README
function createReadme(baseDir, formattedName) {
  const readmeContent = `# Tez ${formattedName.pascal}

${options.description}

## Overview

This repository contains the ${formattedName.pascal} feature for the Tez application. It is designed to be developed independently and later integrated into the main Tez-Frontend repository.

## Development

### Setup

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Testing

\`\`\`bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration
\`\`\`

### Building

\`\`\`bash
npm run build
\`\`\`

## Integration

This feature is designed to be integrated into the main Tez-Frontend repository using the integration tools provided there.

### Integration Process

1. Develop and test the feature in this repository
2. When ready, the main repository will pull changes using the integration script
3. The feature will be tested for compatibility with other features
4. Once verified, it will be available in the main Tez application

## Component Structure

- \`components/${formattedName.pascal}*\` - Main components for this feature
- \`pages/${formattedName.kebab}\` - Page implementation
- \`tests/\` - Unit and integration tests

## Folder Structure

\`\`\`
tez-${formattedName.kebab}/
├── components/          # React components
├── pages/               # Next.js pages
├── styles/              # CSS and style-related files
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
├── constants/           # Constants and configuration
├── tests/               # Tests (unit and integration)
├── public/              # Static assets
└── scripts/             # Development and build scripts
\`\`\`
`;

  fs.writeFileSync(
    path.join(baseDir, 'README.md'),
    readmeContent
  );
  
  console.log('Created README.md');
}

// Create basic page component
function createPageComponent(baseDir, formattedName) {
  const pageDir = path.join(baseDir, 'pages', formattedName.kebab);
  
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  
  const pageContent = `import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout/Layout';
import ${formattedName.pascal}Header from '../../components/${formattedName.pascal}/${formattedName.pascal}Header';
import ${formattedName.pascal}Content from '../../components/${formattedName.pascal}/${formattedName.pascal}Content';

export default function ${formattedName.pascal}Page() {
  return (
    <Layout>
      <Head>
        <title>Tez | ${formattedName.pascal}</title>
        <meta name="description" content="${options.description}" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <${formattedName.pascal}Header />
        <${formattedName.pascal}Content />
      </div>
    </Layout>
  );
}
`;

  fs.writeFileSync(
    path.join(pageDir, 'index.tsx'),
    pageContent
  );
  
  console.log(`Created page component at pages/${formattedName.kebab}/index.tsx`);
}

// Create basic components
function createComponents(baseDir, formattedName) {
  const componentDir = path.join(baseDir, 'components', formattedName.pascal);
  
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }
  
  // Create header component
  const headerComponent = `import React from 'react';

export default function ${formattedName.pascal}Header() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">${formattedName.pascal}</h1>
      <p className="text-gray-600 mt-2">${options.description}</p>
    </div>
  );
}
`;

  fs.writeFileSync(
    path.join(componentDir, `${formattedName.pascal}Header.tsx`),
    headerComponent
  );
  
  // Create content component
  const contentComponent = `import React from 'react';

export default function ${formattedName.pascal}Content() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">${formattedName.pascal} Content</h2>
      <p>
        This is the main content area for the ${formattedName.pascal} feature.
        Replace this with your actual implementation.
      </p>
    </div>
  );
}
`;

  fs.writeFileSync(
    path.join(componentDir, `${formattedName.pascal}Content.tsx`),
    contentComponent
  );
  
  console.log(`Created component files in components/${formattedName.pascal}/`);
}

// Create basic layout component (copied from main repo)
function createLayoutComponent(baseDir) {
  const layoutDir = path.join(baseDir, 'components', 'Layout');
  
  if (!fs.existsSync(layoutDir)) {
    fs.mkdirSync(layoutDir, { recursive: true });
  }
  
  const layoutComponent = `import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  
  // Simple navigation items for the feature
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pipeline', path: '/pipeline' },
    { name: 'Deals', path: '/deal' },
    { name: 'AI Assistant', path: '/ai-assistant' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Tez</h1>
        </div>
        <nav className="p-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link 
                  href={item.path}
                  className={\`block p-2 rounded \${
                    router.pathname.startsWith(item.path) 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }\`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(
    path.join(layoutDir, 'Layout.tsx'),
    layoutComponent
  );
  
  console.log('Created Layout component');
}

// Create _app.tsx
function createAppComponent(baseDir) {
  const pageDir = path.join(baseDir, 'pages');
  
  const appComponent = `import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
`;

  fs.writeFileSync(
    path.join(pageDir, '_app.tsx'),
    appComponent
  );
  
  console.log('Created _app.tsx');
}

// Create global CSS
function createGlobalCss(baseDir) {
  const stylesDir = path.join(baseDir, 'styles');
  
  const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 240, 240, 240;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-rgb: 30, 30, 30;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}
`;

  fs.writeFileSync(
    path.join(stylesDir, 'globals.css'),
    globalCss
  );
  
  console.log('Created globals.css');
}

// Create basic test
function createTests(baseDir, formattedName) {
  const unitTestDir = path.join(baseDir, 'tests', 'unit');
  const integrationTestDir = path.join(baseDir, 'tests', 'integration');
  
  // Unit test
  const unitTest = `import React from 'react';
import { render, screen } from '@testing-library/react';
import ${formattedName.pascal}Content from '../../components/${formattedName.pascal}/${formattedName.pascal}Content';

describe('${formattedName.pascal}Content', () => {
  test('renders content correctly', () => {
    render(<${formattedName.pascal}Content />);
    
    expect(screen.getByText('${formattedName.pascal} Content')).toBeInTheDocument();
  });
});
`;

  fs.writeFileSync(
    path.join(unitTestDir, `${formattedName.pascal}Content.test.tsx`),
    unitTest
  );
  
  // Integration test
  const integrationTest = `import React from 'react';
import { render, screen } from '@testing-library/react';
import ${formattedName.pascal}Page from '../../pages/${formattedName.kebab}';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/${formattedName.kebab}',
  }),
}));

describe('${formattedName.pascal} Page Integration', () => {
  test('renders page with header and content', () => {
    render(<${formattedName.pascal}Page />);
    
    // Check that key elements are rendered
    expect(screen.getByText('${formattedName.pascal}')).toBeInTheDocument();
    expect(screen.getByText('${formattedName.pascal} Content')).toBeInTheDocument();
  });
});
`;

  fs.writeFileSync(
    path.join(integrationTestDir, `${formattedName.kebab}-integration.test.js`),
    integrationTest
  );
  
  console.log('Created test files');
}

// Create Jest config file
function createJestConfig(baseDir) {
  const jestConfig = `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/unit/**/*.test.[jt]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ]
};
`;

  const integrationJestConfig = `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/integration/**/*.test.[jt]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  }
};
`;

  const setupFile = `import '@testing-library/jest-dom';
`;

  fs.writeFileSync(
    path.join(baseDir, 'jest.config.js'),
    jestConfig
  );
  
  fs.writeFileSync(
    path.join(baseDir, 'jest.integration.config.js'),
    integrationJestConfig
  );
  
  fs.writeFileSync(
    path.join(baseDir, 'tests', 'setup.js'),
    setupFile
  );
  
  console.log('Created Jest configuration files');
}

// Create Next.js config file
function createNextConfig(baseDir) {
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
`;

  fs.writeFileSync(
    path.join(baseDir, 'next.config.js'),
    nextConfig
  );
  
  console.log('Created Next.js configuration file');
}

// Create TypeScript config
function createTsConfig(baseDir) {
  const tsConfig = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
`;

  fs.writeFileSync(
    path.join(baseDir, 'tsconfig.json'),
    tsConfig
  );
  
  console.log('Created TypeScript configuration file');
}

// Create gitignore
function createGitignore(baseDir) {
  const gitignore = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;

  fs.writeFileSync(
    path.join(baseDir, '.gitignore'),
    gitignore
  );
  
  console.log('Created .gitignore file');
}

// Create ESLint config
function createEslintConfig(baseDir) {
  const eslintConfig = `{
  "extends": "next/core-web-vitals"
}
`;

  fs.writeFileSync(
    path.join(baseDir, '.eslintrc.json'),
    eslintConfig
  );
  
  console.log('Created ESLint configuration file');
}

// Create Tailwind config
function createTailwindConfig(baseDir) {
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

  fs.writeFileSync(
    path.join(baseDir, 'tailwind.config.js'),
    tailwindConfig
  );
  
  fs.writeFileSync(
    path.join(baseDir, 'postcss.config.js'),
    postcssConfig
  );
  
  console.log('Created Tailwind and PostCSS configuration files');
}

// Initialize Git repository
function initGitRepo(baseDir) {
  try {
    execSync('git init', { cwd: baseDir });
    execSync('git add .', { cwd: baseDir });
    execSync('git commit -m "Initial commit: Feature repository scaffolding"', { cwd: baseDir });
    console.log('Initialized Git repository with initial commit');
  } catch (error) {
    console.error('Error initializing Git repository:', error.message);
  }
}

// Main function
async function main() {
  await promptForOptions();
  
  if (!options.feature) {
    console.error('Feature name is required');
    process.exit(1);
  }
  
  const formattedName = formatFeatureName(options.feature);
  const baseDir = path.join(process.cwd(), 'temp', `tez-${formattedName.kebab}`);
  
  console.log(`Creating feature repository for: ${formattedName.pascal}`);
  console.log(`Directory: ${baseDir}`);
  
  // Create base structure
  createDirectoryStructure(baseDir);
  
  // Create configuration files
  createPackageJson(baseDir, formattedName);
  createReadme(baseDir, formattedName);
  createNextConfig(baseDir);
  createTsConfig(baseDir);
  createGitignore(baseDir);
  createEslintConfig(baseDir);
  createTailwindConfig(baseDir);
  createJestConfig(baseDir);
  
  // Create components and pages
  createLayoutComponent(baseDir);
  createAppComponent(baseDir);
  createGlobalCss(baseDir);
  createComponents(baseDir, formattedName);
  createPageComponent(baseDir, formattedName);
  createTests(baseDir, formattedName);
  
  // Initialize Git repository
  initGitRepo(baseDir);
  
  console.log('\n========================================');
  console.log(`Feature repository created successfully!`);
  console.log(`Location: ${baseDir}`);
  console.log('========================================');
  console.log('\nNext steps:');
  console.log(`1. cd ${baseDir}`);
  console.log('2. npm install');
  console.log('3. npm run dev');
  console.log('\nHappy coding!');
}

// Execute main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 