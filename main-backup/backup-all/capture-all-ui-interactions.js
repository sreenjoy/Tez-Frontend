const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create directories for dark and light mode screenshots
const screenshotsDir = path.join(__dirname, 'documentation', 'comprehensive', 'test-pipeline-screenshots');
const darkModeDir = path.join(screenshotsDir, 'dark-mode');
const lightModeDir = path.join(screenshotsDir, 'light-mode');
const animationsDir = path.join(screenshotsDir, 'animations');

// Ensure directories exist
[darkModeDir, lightModeDir, animationsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to capture screenshots with naming
const captureScreenshot = async (page, element, name, directory, fullPage = false) => {
  try {
    // Full page or area screenshot
    await page.screenshot({
      path: path.join(directory, `${name}-full.png`),
      fullPage: fullPage
    });
    
    // Element-only screenshot if provided
    if (element) {
      try {
        await element.screenshot({
          path: path.join(directory, `${name}.png`)
        });
        console.log(`Captured ${name} in ${directory.includes('light') ? 'light' : 'dark'} mode`);
      } catch (err) {
        console.log(`Could not capture element screenshot for ${name}: ${err.message}`);
      }
    }
    return true;
  } catch (err) {
    console.log(`Error capturing screenshot for ${name}: ${err.message}`);
    return false;
  }
};

// Function to capture animation frames
const captureAnimation = async (page, element, name, directory, frames = 5, duration = 300) => {
  const frameInterval = duration / frames;
  
  for (let i = 0; i < frames; i++) {
    await delay(frameInterval);
    try {
      await page.screenshot({
        path: path.join(directory, `${name}-animation-${i+1}.png`),
        fullPage: false
      });
      console.log(`Captured animation frame ${i+1} for ${name}`);
    } catch (err) {
      console.log(`Error capturing animation frame for ${name}: ${err.message}`);
    }
  }
};

// Function to handle hover states
const captureHoverState = async (page, element, name, directory) => {
  try {
    // Hover over the element
    await element.hover();
    await delay(300); // Wait for hover effect
    
    // Capture screenshot of hover state
    await page.screenshot({
      path: path.join(directory, `${name}-hover.png`),
      fullPage: false
    });
    console.log(`Captured hover state for ${name}`);
    
    // Try to find any tooltips or hover menus that appeared
    const tooltip = await page.$('.tooltip, [role="tooltip"], [data-tooltip], .hover-menu, .popover');
    if (tooltip && await tooltip.isVisible()) {
      await tooltip.screenshot({
        path: path.join(directory, `${name}-tooltip.png`)
      });
      console.log(`Captured tooltip for ${name}`);
    }
  } catch (err) {
    console.log(`Error capturing hover state for ${name}: ${err.message}`);
  }
};

// Function to handle special edit modal animation
const captureEditModalAnimation = async (page, directory) => {
  console.log('Capturing Edit Pipeline modal animation...');
  
  // Find the edit button near the pipeline dropdown
  const pipelineDropdown = await page.$('button:has-text("Pipeline"), button:has-text("Main Pipeline")');
  if (!pipelineDropdown) {
    console.log('Could not find pipeline dropdown for edit modal capture');
    return false;
  }
  
  // Get position of the pipeline dropdown
  const dropdownBox = await pipelineDropdown.boundingBox();
  if (!dropdownBox) return false;
  
  // Find edit button (usually to the right of dropdown)
  const editButton = await page.evaluateHandle((dropdownRect) => {
    const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
    
    return buttons.find(btn => {
      if (btn.textContent.includes('Pipeline')) return false;
      
      const rect = btn.getBoundingClientRect();
      // Check if button is to the right of the dropdown and at similar vertical position
      return rect.left > dropdownRect.right - 10 && 
             Math.abs(rect.top - dropdownRect.top) < 20;
    });
  }, dropdownBox);
  
  if (!editButton) {
    console.log('Could not find edit button for modal animation capture');
    return false;
  }
  
  // Capture edit button
  await captureScreenshot(page, editButton, 'edit-button-pre-click', directory);
  
  // Click the button to open modal
  console.log('Clicking edit button to open modal...');
  await editButton.click();
  
  // Capture animation frames as modal opens
  await captureAnimation(page, null, 'edit-modal-opening', directory, 8, 500);
  
  // Find the modal
  const modal = await page.$('[role="dialog"], .modal, div.fixed.inset-0 > div');
  if (!modal) {
    console.log('Could not find edit modal after clicking button');
    return false;
  }
  
  // Capture the full modal
  await captureScreenshot(page, modal, 'edit-modal-full', directory);
  
  // Capture interactions within the modal
  const modalInteractions = [
    { name: 'pipeline-name-input', selector: 'input[type="text"]' },
    { name: 'stage-color-dropdown', selector: 'select' },
    { name: 'add-stage-input', selector: 'input[placeholder="Add stage"]' },
    { name: 'add-stage-button', selector: 'button:has-text("Add stage")' },
    { name: 'save-button', selector: 'button:has-text("Save changes")' },
    { name: 'cancel-button', selector: 'button:has-text("Cancel")' }
  ];
  
  // Capture each interaction element
  for (const interaction of modalInteractions) {
    const element = await modal.$(interaction.selector);
    if (element && await element.isVisible()) {
      await captureScreenshot(page, element, `edit-modal-${interaction.name}`, directory);
      await captureHoverState(page, element, `edit-modal-${interaction.name}`, directory);
    }
  }
  
  // Close the modal
  const closeButton = await modal.$('button:has-text("Cancel")');
  if (closeButton) {
    await closeButton.click();
    console.log('Closed edit modal');
    
    // Capture animation frames as modal closes
    await captureAnimation(page, null, 'edit-modal-closing', directory, 5, 300);
  } else {
    // Try to close with escape key
    await page.keyboard.press('Escape');
    console.log('Attempted to close edit modal with Escape key');
  }
  
  return true;
};

// Function to handle all kinds of interactive elements
const processInteractiveElement = async (page, element, name, directory) => {
  // First capture the element
  await captureScreenshot(page, element, name, directory);
  
  // Then capture hover state
  await captureHoverState(page, element, name, directory);
  
  try {
    // Get starting URL
    const startUrl = page.url();
    
    // Click the element
    console.log(`Clicking ${name}...`);
    await element.click();
    await delay(500); // Wait for any animations or state changes
    
    // Check if URL changed (navigation occurred)
    const currentUrl = page.url();
    if (currentUrl !== startUrl) {
      console.log(`URL changed to ${currentUrl} after clicking ${name}`);
      await captureScreenshot(page, null, `${name}-new-page`, directory, true);
      
      // Go back to the previous page
      await page.goBack();
      await delay(500);
      console.log('Navigated back to previous page');
      return;
    }
    
    // Check if a modal appeared
    const modal = await page.$('[role="dialog"], .modal, div.fixed.inset-0 > div, [class*="modal"], [class*="popup"]');
    if (modal && await modal.isVisible()) {
      console.log(`Modal detected after clicking ${name}`);
      await captureScreenshot(page, modal, `${name}-modal`, directory);
      
      // Capture animation frames
      await captureAnimation(page, null, `${name}-modal-animation`, directory, 3, 200);
      
      // Find interactive elements inside the modal
      const modalButtons = await modal.$$('button, [role="button"]');
      for (let i = 0; i < modalButtons.length; i++) {
        if (await modalButtons[i].isVisible()) {
          await captureScreenshot(page, modalButtons[i], `${name}-modal-button-${i+1}`, directory);
          await captureHoverState(page, modalButtons[i], `${name}-modal-button-${i+1}`, directory);
        }
      }
      
      // Close the modal
      const closeButton = await modal.$('button:has-text("Close"), button:has-text("Cancel"), [aria-label="Close"]');
      if (closeButton) {
        await closeButton.click();
        console.log(`Closed modal for ${name}`);
      } else {
        // Try escape key
        await page.keyboard.press('Escape');
        await delay(300);
        console.log(`Attempted to close modal with Escape key`);
      }
      return;
    }
    
    // Check if a dropdown or menu appeared
    const dropdown = await page.$('.dropdown, [role="menu"], [class*="dropdown"], [class*="menu"], [class*="popover"]');
    if (dropdown && await dropdown.isVisible()) {
      console.log(`Dropdown/menu detected after clicking ${name}`);
      await captureScreenshot(page, dropdown, `${name}-dropdown`, directory);
      
      // Find and capture items in the dropdown
      const dropdownItems = await dropdown.$$('a, button, [role="menuitem"]');
      for (let i = 0; i < dropdownItems.length; i++) {
        if (await dropdownItems[i].isVisible()) {
          await captureScreenshot(page, dropdownItems[i], `${name}-dropdown-item-${i+1}`, directory);
          await captureHoverState(page, dropdownItems[i], `${name}-dropdown-item-${i+1}`, directory);
        }
      }
      
      // Click outside to close dropdown
      try {
        await page.mouse.click(10, 10);
        await delay(300);
        console.log(`Closed dropdown for ${name}`);
      } catch (err) {
        console.log(`Error closing dropdown: ${err.message}`);
      }
      return;
    }
    
    // Check if view changed by taking another screenshot
    await captureScreenshot(page, null, `${name}-after-click`, directory);
    
    // If we're dealing with tabs or view changes, scan for new buttons in this view
    const isTabOrViewChange = name.includes('tab') || name.includes('view') || name.includes('toggle');
    if (isTabOrViewChange) {
      console.log(`Processing buttons in new view after clicking ${name}...`);
      const viewButtons = await page.$$('button:visible, [role="button"]:visible');
      for (let i = 0; i < Math.min(viewButtons.length, 5); i++) { // Limit to 5 to avoid too many screenshots
        const buttonName = await viewButtons[i].evaluate(el => 
          el.textContent?.trim() || el.getAttribute('aria-label') || el.getAttribute('title') || '');
        
        const viewButtonName = buttonName 
          ? `${name}-view-${buttonName.replace(/[^a-zA-Z0-9]/g, '-')}`
          : `${name}-view-button-${i+1}`;
        
        await captureScreenshot(page, viewButtons[i], viewButtonName, directory);
        await captureHoverState(page, viewButtons[i], viewButtonName, directory);
      }
    }
  } catch (err) {
    console.log(`Error processing ${name}: ${err.message}`);
  }
};

// Function to find and process all interactive elements in an area
const processInteractiveArea = async (page, areaSelector, areaName, directory) => {
  console.log(`Processing interactive elements in ${areaName}...`);
  
  const area = await page.$(areaSelector);
  if (!area) {
    console.log(`Could not find ${areaName} area with selector: ${areaSelector}`);
    return;
  }
  
  // Find all interactive elements in this area
  const interactiveElements = await area.$$('button, [role="button"], a, .clickable, [class*="button"], input[type="checkbox"], input[type="radio"], select');
  console.log(`Found ${interactiveElements.length} interactive elements in ${areaName}`);
  
  for (let i = 0; i < interactiveElements.length; i++) {
    const element = interactiveElements[i];
    
    // Skip if not visible
    if (!(await element.isVisible())) continue;
    
    // Get element text or attributes for naming
    const elementText = await element.evaluate(el => {
      return el.textContent?.trim() || 
             el.getAttribute('aria-label') || 
             el.getAttribute('title') || 
             el.name || 
             el.id || 
             '';
    });
    
    const elementName = elementText 
      ? `${areaName}-${elementText.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`
      : `${areaName}-element-${i+1}`;
    
    // Process this element
    await processInteractiveElement(page, element, elementName, directory);
    
    // Small delay between elements to avoid overwhelming the browser
    await delay(200);
  }
};

// Function to find and process all cards
const processCards = async (page, directory) => {
  console.log('Processing cards...');
  
  // Find all cards in the content area
  const cards = await page.$$('.card, [class*="card"], [class*="deal"], .pipeline-column > div > div');
  console.log(`Found ${cards.length} potential cards`);
  
  // Process a limited number of cards to avoid too many screenshots
  for (let i = 0; i < Math.min(cards.length, 3); i++) {
    if (await cards[i].isVisible()) {
      const cardName = `card-${i+1}`;
      
      // Get card details and hover state
      await captureScreenshot(page, cards[i], cardName, directory);
      await captureHoverState(page, cards[i], cardName, directory);
      
      // Click the card to see what happens
      console.log(`Clicking ${cardName}...`);
      await cards[i].click().catch(err => console.log(`Error clicking card: ${err.message}`));
      await delay(500);
      
      // Check if a modal or details panel appeared
      const cardDetails = await page.$('[role="dialog"], .modal, .drawer, [class*="drawer"], [class*="details"], [class*="panel"]');
      if (cardDetails && await cardDetails.isVisible()) {
        console.log(`Details panel/modal detected for ${cardName}`);
        await captureScreenshot(page, cardDetails, `${cardName}-details`, directory);
        
        // Close the details
        const closeButton = await cardDetails.$('button:has-text("Close"), [aria-label="Close"], button:has-text("×")');
        if (closeButton) {
          await closeButton.click();
          console.log(`Closed details for ${cardName}`);
        } else {
          // Try escape key
          await page.keyboard.press('Escape');
          await delay(300);
          console.log(`Attempted to close details with Escape key`);
        }
      } else {
        console.log(`No details panel found for ${cardName}`);
        // Take an "after click" screenshot anyway
        await captureScreenshot(page, null, `${cardName}-after-click`, directory);
      }
    }
  }
};

// Main function to process the page in a given theme mode
const processPage = async (page, directory, modeName) => {
  console.log(`\n=== Processing page in ${modeName} mode ===\n`);
  
  // Take a full screenshot of the initial state
  await captureScreenshot(page, null, 'full-page', directory, true);
  
  // Process the header area
  await processInteractiveArea(page, 'header, nav.top, .header, nav:first-child', 'header', directory);
  
  // Process the sidebar/left menu
  await processInteractiveArea(page, 'nav.sidebar, .sidebar, aside, nav:not(.top)', 'sidebar', directory);
  
  // Process main tabs area
  await processInteractiveArea(page, '.tabs, [role="tablist"], nav.tabs', 'tabs', directory);
  
  // Process cards before other content (they tend to be more important)
  await processCards(page, directory);
  
  // Process the main content area
  await processInteractiveArea(page, 'main, .main-content, .content, #content', 'content', directory);
  
  // Special handling for the edit modal with animation
  await captureEditModalAnimation(page, directory);
};

// Main function
(async () => {
  // Launch browser with longer timeout
  const browser = await chromium.launch({ 
    headless: false,
    timeout: 120000
  });
  
  try {
    // First process everything in dark mode
    console.log('Starting capture process in dark mode...');
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
    
    // Process all interactions in dark mode
    await processPage(darkPage, darkModeDir, 'dark');
    
    // Now find the theme toggle to switch to light mode
    console.log('\nLooking for theme toggle to switch to light mode...');
    
    // Find the theme toggle by position (usually top right)
    const themeToggle = await darkPage.evaluateHandle(() => {
      // Find buttons near the top-right corner of the viewport
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      const viewportWidth = window.innerWidth;
      
      // Sort buttons by proximity to top-right corner
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
      console.log('Found potential theme toggle button');
      
      // Take screenshot of the toggle in dark mode
      await captureScreenshot(darkPage, themeToggle, 'theme-toggle', darkModeDir);
      
      // Click the toggle to switch to light mode
      console.log('Clicking theme toggle to switch to light mode...');
      await themeToggle.click();
      await delay(1000); // Wait for theme change animation
      
      // Take a screenshot after theme change
      await captureScreenshot(darkPage, null, 'after-theme-change', lightModeDir, true);
      
      // Close dark mode context
      await darkContext.close();
      
      // Create a new context explicitly set to light mode
      console.log('\nStarting capture process in light mode...');
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
      
      // Process all interactions in light mode
      await processPage(lightPage, lightModeDir, 'light');
      
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
    console.log('\n=== Capture process complete ===');
  }
})(); 