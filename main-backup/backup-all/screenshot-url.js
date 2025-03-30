const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Get URL from command line argument
const url = process.argv[2];
if (!url) {
  console.error('Please provide a URL as an argument. Example: node screenshot-url.js http://localhost:3001/pipeline');
  process.exit(1);
}

// Extract page name from URL
const pageName = url.split('/').pop() || 'page';

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'documentation', 'screenshots', pageName);
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

(async () => {
  // Launch the browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log(`Capturing screenshots for ${url}...`);
  
  try {
    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log(`  Loaded ${url}`);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, `${pageName}-full.png`),
      fullPage: true 
    });
    console.log(`  Captured full page screenshot`);
    
    // Capture component screenshots
    console.log(`  Capturing component screenshots...`);
    
    // Common component selectors to try
    const componentSelectors = [
      { name: 'sidebar', selector: '.sidebar, [role="navigation"]' },
      { name: 'header', selector: 'header, .header, [role="banner"]' },
      { name: 'main-content', selector: 'main, .main-content, [role="main"]' },
      { name: 'footer', selector: 'footer, .footer, [role="contentinfo"]' },
      { name: 'buttons', selector: 'button:not([aria-hidden="true"])' },
      { name: 'forms', selector: 'form' },
      { name: 'cards', selector: '.card, [role="region"], [draggable="true"]' },
      { name: 'modals', selector: '[role="dialog"]' },
      { name: 'dropdowns', selector: '[role="menu"], .dropdown' },
      { name: 'inputs', selector: 'input, textarea, select' },
      { name: 'tables', selector: 'table' },
      { name: 'lists', selector: 'ul, ol' }
    ];
    
    for (const component of componentSelectors) {
      const elements = await page.$$(component.selector);
      
      if (elements.length > 0) {
        console.log(`    Found ${elements.length} ${component.name} components`);
        
        // Screenshot each instance or just the first few
        const maxInstances = 3; // Limit number of screenshots per component type
        for (let i = 0; i < Math.min(elements.length, maxInstances); i++) {
          try {
            const element = elements[i];
            const isVisible = await element.isVisible();
            
            if (isVisible) {
              await element.screenshot({ 
                path: path.join(screenshotsDir, `${pageName}-${component.name}-${i+1}.png`)
              });
              console.log(`      Captured ${component.name} ${i+1} screenshot`);
            }
          } catch (elementError) {
            console.error(`      Error capturing ${component.name}:`, elementError.message);
          }
        }
      }
    }
    
  } catch (pageError) {
    console.error(`Error processing page:`, pageError.message);
  }

  console.log('Screenshot capture process complete!');
  console.log(`Screenshots saved to: ${screenshotsDir}/`);
  
  // Close browser
  await browser.close();
})(); 