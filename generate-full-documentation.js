// Main script to run CSS fix and generate complete documentation
const { execSync } = require('child_process');
const path = require('path');

console.log('===== Tez Frontend Documentation Generator =====');
console.log('Starting the documentation generation process...');

// First, fix the CSS optimization error
console.log('\n[Step 1] Fixing CSS optimization issues...');
try {
  console.log('Running fix-critters.js...');
  require('./fix-critters');
  console.log('CSS optimization issues fixed successfully.');
} catch (error) {
  console.error('Failed to fix CSS optimization issues:', error);
  console.log('Continuing with documentation generation...');
}

// Next, ensure the development server is running
console.log('\n[Step 2] Checking if development server is running...');
let serverRunning = false;

try {
  // Simple check to see if the server is running by trying to fetch the root URL
  const { execSync } = require('child_process');
  execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3010 | grep -q "200"', { stdio: 'pipe' });
  console.log('Development server is running.');
  serverRunning = true;
} catch (error) {
  console.log('Development server is not running. Starting server...');
  
  try {
    // Start the server in the background
    const { spawn } = require('child_process');
    const serverProcess = spawn('npm', ['run', 'dev'], {
      detached: true,
      stdio: 'ignore'
    });
    
    // Detach the child process
    serverProcess.unref();
    
    console.log('Development server started in the background.');
    console.log('Waiting for server to initialize (30 seconds)...');
    
    // Wait for 30 seconds to allow the server to start
    execSync('sleep 30');
    serverRunning = true;
  } catch (serverError) {
    console.error('Failed to start development server:', serverError);
    console.error('Please start the server manually using "npm run dev" and try again.');
    process.exit(1);
  }
}

// Finally, generate the documentation
console.log('\n[Step 3] Generating documentation...');
try {
  // Install puppeteer if not already installed
  try {
    require.resolve('puppeteer');
    console.log('Puppeteer is already installed.');
  } catch (e) {
    console.log('Puppeteer not found. Installing...');
    execSync('npm install --save-dev puppeteer', { stdio: 'inherit' });
  }
  
  console.log('Running capture-all-pages.js...');
  require('./capture-all-pages');
} catch (docError) {
  console.error('Failed to generate documentation:', docError);
  process.exit(1);
}

console.log('\n===== Documentation Generation Complete =====');
console.log('The following files have been created:');
console.log('- Individual page documentation: documentation/pages/[page-name].md');
console.log('- Combined documentation: documentation/COMPLETE-DOCUMENTATION.md');
console.log('- Screenshots: documentation/screenshots/[page-name]/');
console.log('\nYou can view the complete documentation in documentation/COMPLETE-DOCUMENTATION.md'); 