// Puppeteer script to capture screenshots of all pages
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const makeDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const BASE_URL = 'http://localhost:3010';
const SCREENSHOT_DIR = path.join('documentation', 'screenshots');

const pages = [
  { name: 'dashboard', path: '/dashboard', variants: ['light', 'dark'] },
  { name: 'pipeline', path: '/pipeline', variants: ['light', 'dark'] },
  { name: 'deal', path: '/deal/card-5', variants: ['light', 'dark'] },
  { name: 'ai-assistant', path: '/ai-assistant', variants: ['light', 'dark'] },
  { name: 'auth', path: '/auth', variants: ['light', 'dark'] },
  { name: 'organization-info', path: '/organization-info', variants: ['light', 'dark'] },
  { name: 'chat-sync', path: '/chat-sync', variants: ['light', 'dark'] },
];

// Elements to capture separately within each page
const pageElements = {
  dashboard: [
    { name: 'header', selector: 'header' },
    { name: 'kpi-cards', selector: '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4' },
    { name: 'charts', selector: '.grid.grid-cols-1.lg\\:grid-cols-2.gap-4.mb-6' },
    { name: 'deals-table', selector: 'div:has(> h2:contains("Active Deals"))' },
    { name: 'tasks', selector: 'div:has(> h2:contains("Tasks"))' },
    { name: 'activity', selector: 'div:has(> h2:contains("Recent Activity"))' },
  ],
  pipeline: [
    { name: 'header', selector: 'header' },
    { name: 'pipeline-filters', selector: '.flex.items-center.justify-between.mb-4' },
    { name: 'pipeline-columns', selector: '.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-4.gap-4' },
    { name: 'pipeline-card', selector: '.bg-white.dark\\:bg-gray-800.rounded-lg.shadow.p-4.mb-3:first-child' },
  ],
  deal: [
    { name: 'header', selector: 'header' },
    { name: 'deal-info', selector: '.grid.grid-cols-1.md\\:grid-cols-3.gap-6' },
    { name: 'deal-details', selector: '.col-span-2' },
    { name: 'deal-sidebar', selector: '.bg-white.dark\\:bg-gray-800.rounded-lg.shadow.p-4' },
  ],
  'ai-assistant': [
    { name: 'header', selector: 'header' },
    { name: 'training-status', selector: '.grid.grid-cols-1.lg\\:grid-cols-2.gap-6' },
    { name: 'qa-testing', selector: 'div:has(> h2:contains("AI Q&A Testing"))' },
    { name: 'conversation', selector: '.bg-gray-50.dark\\:bg-gray-900.rounded-lg.p-4.my-4' },
  ],
  auth: [
    { name: 'login-form', selector: 'form:has(button:contains("Login"))' },
    { name: 'signup-form', selector: 'form:has(button:contains("Sign up"))' },
  ],
  'organization-info': [
    { name: 'header', selector: 'header' },
    { name: 'org-form', selector: 'form' },
    { name: 'org-fields', selector: '.grid.grid-cols-1.md\\:grid-cols-2.gap-6' },
  ],
  'chat-sync': [
    { name: 'header', selector: 'header' },
    { name: 'sync-status', selector: '.mt-6' },
    { name: 'connected-accounts', selector: 'div:has(> h2:contains("Connected Accounts"))' },
  ],
};

// Function to capture page screenshots
async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    // Set user agent to avoid bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Iterate through all pages
    for (const pageInfo of pages) {
      const { name, path: pagePath, variants } = pageInfo;
      
      // Create page directory
      const pageDir = `${SCREENSHOT_DIR}/${name}`;
      makeDir(pageDir);
      
      for (const variant of variants) {
        console.log(`Capturing ${name} page (${variant} mode)...`);
        
        await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle2' });
        
        // Set theme
        if (variant === 'dark') {
          await page.evaluate(() => {
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
          });
          // Refresh to apply dark theme
          await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle2' });
        } else {
          await page.evaluate(() => {
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
          });
          // Refresh to apply light theme
          await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle2' });
        }
        
        // Wait for content to load
        await page.waitForTimeout(1000);
        
        // Take full page screenshot
        await page.screenshot({
          path: `${pageDir}/${name}-full-${variant}.png`,
          fullPage: true
        });
        
        // Capture specific elements if defined for this page
        const elements = pageElements[name] || [];
        for (const element of elements) {
          try {
            const elementHandle = await page.$(element.selector);
            if (elementHandle) {
              await elementHandle.screenshot({
                path: `${pageDir}/${name}-${element.name}-${variant}.png`
              });
            } else {
              console.warn(`Element "${element.name}" not found on ${name} page.`);
            }
          } catch (error) {
            console.error(`Error capturing ${element.name} on ${name} page:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Create documentation markdown for each page
async function generateDocumentation() {
  for (const pageInfo of pages) {
    const { name } = pageInfo;
    const pageDocsPath = path.join('documentation', 'pages', `${name}.md`);
    const screenshots = fs.readdirSync(path.join(SCREENSHOT_DIR, name))
      .filter(file => file.endsWith('.png'));
    
    let content = `# ${name.charAt(0).toUpperCase() + name.slice(1)} Page Documentation\n\n`;
    content += `## Overview\n\nThe ${name} page provides users with ${getPageDescription(name)}.\n\n`;
    content += `## Screenshots\n\n`;
    
    // Add full page screenshots first
    const fullScreenshots = screenshots.filter(file => file.includes('-full-'));
    for (const screenshot of fullScreenshots) {
      const mode = screenshot.includes('-full-dark') ? 'Dark Mode' : 'Light Mode';
      content += `### Full Page (${mode})\n\n`;
      content += `![${name} page - ${mode}](../screenshots/${name}/${screenshot})\n\n`;
    }
    
    // Add component screenshots
    const componentScreenshots = screenshots.filter(file => !file.includes('-full-'));
    if (componentScreenshots.length > 0) {
      content += `## Components\n\n`;
      
      for (const screenshot of componentScreenshots) {
        const componentName = screenshot
          .replace(`${name}-`, '')
          .replace(/-dark\.png$/, '')
          .replace(/-light\.png$/, '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        const mode = screenshot.includes('-dark.png') ? 'Dark Mode' : 'Light Mode';
        content += `### ${componentName} (${mode})\n\n`;
        content += `![${componentName}](../screenshots/${name}/${screenshot})\n\n`;
      }
    }
    
    // Add usage documentation
    content += `## Usage Guide\n\n`;
    content += getUsageGuide(name);
    
    // Write to file
    fs.writeFileSync(pageDocsPath, content);
    console.log(`Documentation generated for ${name} page.`);
  }
  
  // Generate combined documentation
  generateCombinedDocumentation();
}

// Create combined documentation file
function generateCombinedDocumentation() {
  const combinedPath = path.join('documentation', 'COMPLETE-DOCUMENTATION.md');
  
  let content = `# Tez Frontend Complete Documentation\n\n`;
  content += `## Table of Contents\n\n`;
  
  for (const pageInfo of pages) {
    content += `- [${pageInfo.name.charAt(0).toUpperCase() + pageInfo.name.slice(1)} Page](#${pageInfo.name}-page)\n`;
  }
  
  content += `\n## Overview\n\nTez Frontend is a comprehensive CRM application designed for sales teams. It provides pipeline management, deal tracking, AI assistance, and more.\n\n`;
  
  // Add each page's content
  for (const pageInfo of pages) {
    const { name } = pageInfo;
    const pageDocsPath = path.join('documentation', 'pages', `${name}.md`);
    
    if (fs.existsSync(pageDocsPath)) {
      let pageContent = fs.readFileSync(pageDocsPath, 'utf8');
      
      // Adjust heading levels (increase by 1)
      pageContent = pageContent.replace(/^# /gm, '## ');
      pageContent = pageContent.replace(/^## /gm, '### ');
      pageContent = pageContent.replace(/^### /gm, '#### ');
      
      // Fix image paths for the combined doc
      pageContent = pageContent.replace(/\(\.\.\/screenshots/g, '(./screenshots');
      
      content += `\n\n## ${name.charAt(0).toUpperCase() + name.slice(1)} Page\n\n`;
      content += pageContent.split('\n').slice(1).join('\n'); // Skip the first line (title)
    }
  }
  
  fs.writeFileSync(combinedPath, content);
  console.log('Combined documentation generated.');
}

// Helper function to get page descriptions
function getPageDescription(pageName) {
  const descriptions = {
    dashboard: 'a comprehensive overview of their sales metrics, activities, and performance',
    pipeline: 'a kanban-style view to manage their sales pipeline and track deals through various stages',
    deal: 'detailed information about specific deals, including customer data, deal value, and communication history',
    'ai-assistant': 'AI-powered assistance for sales queries and training the system with organization-specific knowledge',
    auth: 'secure login and registration capabilities',
    'organization-info': 'the ability to manage their organization details and preferences',
    'chat-sync': 'tools to connect and synchronize with external messaging platforms'
  };
  
  return descriptions[pageName] || 'specific functionality';
}

// Helper function to get usage guides
function getUsageGuide(pageName) {
  const guides = {
    dashboard: `1. **Key Performance Indicators**: View important metrics at the top of the page\n2. **Charts and Graphs**: Analyze sales data visually\n3. **Active Deals**: See your most important deals that need attention\n4. **Tasks**: Track your upcoming tasks and deadlines\n5. **Recent Activity**: Monitor the latest actions across your pipeline`,
    
    pipeline: `1. **Pipeline Selection**: Use the dropdown to switch between different pipelines\n2. **View Toggle**: Switch between Kanban and List views\n3. **Filters**: Filter deals by various criteria\n4. **Deal Cards**: Drag and drop deals between pipeline stages\n5. **Add Deal**: Create new deals directly from the pipeline view`,
    
    deal: `1. **Deal Information**: View customer details, deal value, and status\n2. **Timeline**: Track all communications and activities related to the deal\n3. **Notes**: Add important notes and information\n4. **Related Tasks**: Manage tasks specifically related to this deal\n5. **Deal Actions**: Update deal status, schedule follow-ups, or close the deal`,
    
    'ai-assistant': `1. **Training Status**: Monitor how much data has been trained into your AI assistant\n2. **Q&A Testing**: Test how the AI responds to typical customer questions\n3. **Feedback Tools**: Provide feedback on AI responses to improve future answers\n4. **Custom Questions**: Ask your own questions to see how the AI performs`,
    
    auth: `1. **Login**: Existing users can sign in with their credentials\n2. **Sign Up**: New users can create an account\n3. **Password Reset**: Users can request a password reset if needed`,
    
    'organization-info': `1. **Organization Details**: Update company name, logo, and contact information\n2. **Team Members**: Manage users with access to your organization\n3. **Preferences**: Set organization-wide preferences and defaults\n4. **Save Changes**: Apply updates to your organization profile`,
    
    'chat-sync': `1. **Connect Accounts**: Link external messaging accounts\n2. **Sync Settings**: Configure which messages to import and how to categorize them\n3. **Sync Status**: Monitor the status of synchronization processes\n4. **Connected Accounts**: View and manage your connected accounts`
  };
  
  return guides[pageName] || 'This page provides specific functionality for the application.';
}

// Run the screenshot and documentation generation
async function run() {
  makeDir(SCREENSHOT_DIR);
  makeDir(path.join('documentation', 'pages'));
  
  await captureScreenshots();
  await generateDocumentation();
  
  console.log('All screenshots and documentation have been generated!');
}

run(); 