const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create directories for dark and light mode screenshots
const screenshotsDir = path.join(__dirname, 'documentation', 'comprehensive', 'test-pipeline-screenshots');
const darkModeDir = path.join(screenshotsDir, 'dark-interactions');
const lightModeDir = path.join(screenshotsDir, 'light-interactions');

if (!fs.existsSync(darkModeDir)) {
  fs.mkdirSync(darkModeDir, { recursive: true });
}

if (!fs.existsSync(lightModeDir)) {
  fs.mkdirSync(lightModeDir, { recursive: true });
}

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to capture screenshots with proper naming
const captureScreenshot = async (page, element, name, directory) => {
  // Full page screenshot first
  await page.screenshot({
    path: path.join(directory, `${name}-full.png`),
    fullPage: false
  });
  
  // Then try to screenshot just the element if provided
  if (element) {
    try {
      await element.screenshot({
        path: path.join(directory, `${name}.png`)
      });
      console.log(`Captured ${name} in ${directory.includes('light') ? 'light' : 'dark'} mode`);
    } catch (err) {
      console.log(`Could not capture ${name} element: ${err.message}`);
    }
  }
};

// Function to click an element and capture the result
const clickAndCapture = async (page, element, name, directory) => {
  try {
    console.log(`Clicking ${name}...`);
    await element.click();
    await delay(1000); // Wait for any animations or modals to appear
    
    // Check if a modal or dropdown appeared
    const newElement = await page.$('[role="dialog"], .modal, .popup, .dropdown, [class*="dropdown"], [class*="modal"], [class*="popup"]');
    if (newElement && await newElement.isVisible()) {
      console.log(`Found modal/dropdown after clicking ${name}`);
      await captureScreenshot(page, newElement, `${name}-modal`, directory);
      
      // Look for a close button to dismiss the modal
      const closeButton = await newElement.$('button:has-text("Close"), button:has-text("Cancel"), [aria-label="Close"]');
      if (closeButton) {
        await closeButton.click();
        console.log(`Closed modal for ${name}`);
        await delay(500);
      } else {
        // Try pressing Escape to close modal
        await page.keyboard.press('Escape');
        await delay(500);
      }
    } else {
      // If no modal, take a screenshot anyway to capture any page changes
      await captureScreenshot(page, null, `${name}-after-click`, directory);
    }
    
    // Click back to the main page area to reset any menus
    try {
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(300);
    } catch (err) {
      // Ignore errors here
    }
  } catch (err) {
    console.log(`Error clicking ${name}: ${err.message}`);
  }
};

// Function to process all interactive elements in a mode
const processInteractiveElements = async (page, directory, isLightMode = false) => {
  console.log(`Processing all interactive elements in ${isLightMode ? 'light' : 'dark'} mode`);
  
  // First take a clean screenshot of the page
  await captureScreenshot(page, null, 'initial-state', directory);
  
  // Define the types of interactive elements we want to capture
  const interactiveElementTypes = [
    { name: 'pipeline-dropdown', selector: 'button:has-text("Main Pipeline"), button:has-text("Pipeline")' },
    { name: 'edit-button', selector: '[aria-label="Edit"], [title*="edit" i], button:has-text("Edit")' },
    { name: 'add-deal', selector: 'button:has-text("Add Deal")' },
    { name: 'search', selector: 'input[type="search"], input[placeholder*="Search"]' },
    { name: 'view-toggle', selector: 'button[aria-label="View Type"], button[title*="view" i], button[class*="view-toggle"]' },
    { name: 'sync-chats', selector: 'button:has-text("Sync Chats")' },
    { name: 'filters', selector: 'button:has-text("Filter"), [aria-label="Filter"]' },
    { name: 'tabs', selector: 'button:has-text("All Chats"), button:has-text("Unread"), button:has-text("Unanswered"), button:has-text("Follow up")' },
    { name: 'priority-dropdown', selector: 'button:has-text("Priority")' },
    { name: 'column-add-buttons', selector: '.column-header button, .kanban-column button[class*="add"]' }
  ];
  
  // Process each type of interactive element
  for (const elementType of interactiveElementTypes) {
    console.log(`Looking for ${elementType.name} elements...`);
    
    const elements = await page.$$(elementType.selector);
    console.log(`Found ${elements.length} ${elementType.name} elements`);
    
    for (let i = 0; i < elements.length; i++) {
      // Skip the theme toggle button in dark mode
      if (elementType.name === 'view-toggle' && !isLightMode) {
        const elementBounds = await elements[i].boundingBox();
        const pageBounds = await page.evaluate(() => {
          return {
            width: window.innerWidth,
            height: window.innerHeight
          };
        });
        
        // If the element is near the right edge of the page, it might be the theme toggle
        if (elementBounds && pageBounds && elementBounds.x > pageBounds.width - 100) {
          console.log('Skipping potential theme toggle button in dark mode');
          continue;
        }
      }
      
      if (await elements[i].isVisible()) {
        await captureScreenshot(page, elements[i], `${elementType.name}-${i+1}`, directory);
        await clickAndCapture(page, elements[i], `${elementType.name}-${i+1}`, directory);
      }
    }
  }
  
  // Now find all other potentially clickable elements that weren't covered above
  console.log('Looking for additional buttons and clickable elements...');
  
  // Find all buttons that aren't already processed
  const allButtons = await page.$$('button, [role="button"], a, .clickable, [class*="button"]');
  
  for (let i = 0; i < allButtons.length; i++) {
    const button = allButtons[i];
    
    // Skip if not visible
    if (!(await button.isVisible())) continue;
    
    // Get button position
    const buttonBox = await button.boundingBox();
    if (!buttonBox) continue;
    
    // Skip if it's likely the theme toggle button in dark mode
    if (!isLightMode) {
      const pageBounds = await page.evaluate(() => {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      });
      
      if (buttonBox.x > pageBounds.width - 100 && buttonBox.y < 100) {
        console.log('Skipping potential theme toggle button in dark mode');
        continue;
      }
    }
    
    // Get button text to use for naming
    const buttonText = await button.evaluate(el => {
      return el.textContent?.trim() || el.getAttribute('aria-label') || el.getAttribute('title') || '';
    });
    
    const buttonName = buttonText 
      ? `button-${buttonText.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`
      : `button-${i+1}`;
    
    // Check if this button is inside any of our previously captured elements
    const isInsidePreviouslyCaptured = await button.evaluate(el => {
      // Look up the DOM tree to check if this is inside a modal or dropdown we've already processed
      let parent = el.parentElement;
      while (parent) {
        if (
          parent.getAttribute('role') === 'dialog' || 
          parent.classList.contains('modal') ||
          parent.classList.contains('popup') ||
          parent.classList.contains('dropdown')
        ) {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    });
    
    if (!isInsidePreviouslyCaptured) {
      await captureScreenshot(page, button, buttonName, directory);
      await clickAndCapture(page, button, buttonName, directory);
    }
  }
  
  // Find all cards that might be clickable
  console.log('Looking for clickable cards...');
  const cards = await page.$$('.card, [class*="card"], .deal-card, [class*="deal"]');
  
  for (let i = 0; i < Math.min(cards.length, 2); i++) { // Just capture a couple of cards
    if (await cards[i].isVisible()) {
      await captureScreenshot(page, cards[i], `card-${i+1}`, directory);
      await clickAndCapture(page, cards[i], `card-${i+1}`, directory);
    }
  }
};

// Main function
(async () => {
  // Launch browser with longer timeout
  const browser = await chromium.launch({ 
    headless: false,
    timeout: 120000
  });
  
  try {
    // First process in dark mode
    const darkContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      colorScheme: 'dark'
    });
    
    const darkPage = await darkContext.newPage();
    
    // Navigate to pipeline page
    await darkPage.goto('http://localhost:3001/pipeline', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    console.log('Loaded pipeline page in dark mode');
    
    // Process all interactive elements in dark mode
    await processInteractiveElements(darkPage, darkModeDir);
    
    // Now find and click the theme toggle to switch to light mode
    console.log('Looking for theme toggle button...');
    
    // First try to find it by position (usually top right)
    const themeToggle = await darkPage.evaluateHandle(() => {
      // Find buttons near the top-right corner
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      const viewportWidth = window.innerWidth;
      
      // Sort by proximity to top-right corner
      return buttons.sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        
        const aDistToTopRight = Math.sqrt(
          Math.pow(viewportWidth - aRect.right, 2) + Math.pow(aRect.top, 2)
        );
        
        const bDistToTopRight = Math.sqrt(
          Math.pow(viewportWidth - bRect.right, 2) + Math.pow(bRect.top, 2)
        );
        
        return aDistToTopRight - bDistToTopRight;
      })[0];
    });
    
    if (themeToggle) {
      console.log('Found potential theme toggle button in top-right corner');
      
      // Take a screenshot of the theme toggle
      await captureScreenshot(darkPage, themeToggle, 'theme-toggle', darkModeDir);
      
      // Click it to switch to light mode
      await themeToggle.click();
      await delay(1000); // Wait for theme to change
      
      // Take a screenshot of the page in light mode
      await darkPage.screenshot({
        path: path.join(lightModeDir, 'theme-changed-to-light.png'),
        fullPage: false
      });
      
      // Close dark mode context
      await darkContext.close();
      
      // Create a new context for light mode
      const lightContext = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        colorScheme: 'light'
      });
      
      const lightPage = await lightContext.newPage();
      
      // Navigate to pipeline page
      await lightPage.goto('http://localhost:3001/pipeline', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      console.log('Loaded pipeline page in light mode');
      
      // Process all interactive elements in light mode
      await processInteractiveElements(lightPage, lightModeDir, true);
      
      // Close light mode context
      await lightContext.close();
    } else {
      console.log('Could not find theme toggle button');
      await darkContext.close();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await browser.close();
    console.log('Interactive elements capture complete');
  }
})(); 