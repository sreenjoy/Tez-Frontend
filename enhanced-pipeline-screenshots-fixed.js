const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'documentation', 'comprehensive', 'test-pipeline-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Helper function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Helper function to handle errors gracefully
const safeScreenshot = async (element, filePath, fullPage = false, options = {}) => {
  try {
    if (fullPage) {
      await element.screenshot({ path: filePath, fullPage, ...options });
    } else {
      if (await element.isVisible()) {
        await element.screenshot({ path: filePath, ...options });
        return true;
      }
    }
  } catch (err) {
    console.error(`Failed to capture screenshot for ${filePath}: ${err.message}`);
    return false;
  }
  return false;
};

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  // Launch the browser with increased timeout
  const browser = await chromium.launch({ 
    headless: false,
    timeout: 60000
  });
  
  // Capture both light and dark modes
  const themes = ['light', 'dark'];
  
  for (const theme of themes) {
    console.log(`Starting pipeline screenshot capture for ${theme} mode...`);
    
    // Create context with color scheme preference and viewport
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      colorScheme: theme === 'dark' ? 'dark' : 'light',
      deviceScaleFactor: 1,
      hasTouch: false,
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true,
    });
    
    const page = await context.newPage();
    
    // Create directory for this theme
    const themeDir = path.join(screenshotsDir, theme);
    ensureDirectoryExists(themeDir);
    
    try {
      // Navigate to the pipeline page
      await page.goto('http://localhost:3001/pipeline', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      console.log(`  Loaded pipeline page in ${theme} mode`);
      
      // Wait for the main content to load
      await page.waitForSelector('main, [role="main"]', { state: 'visible', timeout: 10000 });
      
      // Take full page screenshot
      await safeScreenshot(page, path.join(themeDir, `pipeline-full.png`), true);
      console.log(`  Captured full page screenshot in ${theme} mode`);
      
      // 1. Basic UI Elements
      const basicComponents = [
        { name: 'header', selector: 'header, .header, [role="banner"], nav' },
        { name: 'sidebar', selector: '.sidebar, [role="navigation"], nav.sidebar, aside' },
        { name: 'main-content', selector: 'main, .main-content, [role="main"]' },
        { name: 'footer', selector: 'footer, .footer, [role="contentinfo"]' }
      ];
      
      console.log(`  Capturing basic UI components in ${theme} mode...`);
      for (const component of basicComponents) {
        const elements = await page.$$(component.selector);
        if (elements.length > 0) {
          for (let i = 0; i < Math.min(elements.length, 1); i++) {
            const element = elements[i];
            const captured = await safeScreenshot(element, path.join(themeDir, `pipeline-${component.name}.png`));
            if (captured) {
              console.log(`    Captured ${component.name} in ${theme} mode`);
            }
          }
        } else {
          console.log(`    No ${component.name} elements found`);
        }
      }
      
      // 2. Pipeline Cards and Columns
      console.log(`  Capturing pipeline cards and columns in ${theme} mode...`);
      
      // More comprehensive selectors for columns
      const columnSelectors = [
        '.pipeline-column', '[role="list"]', '[data-column-id]', 
        '.column', '.board-column', '.kanban-column', 
        'div[class*="column"]', 'div[class*="Column"]'
      ];
      
      let columns = [];
      for (const selector of columnSelectors) {
        const found = await page.$$(selector);
        if (found.length > 0) {
          columns = found;
          console.log(`    Found ${found.length} columns using selector: ${selector}`);
          break;
        }
      }
      
      if (columns.length > 0) {
        for (let i = 0; i < Math.min(columns.length, 4); i++) {
          const column = columns[i];
          const captured = await safeScreenshot(column, path.join(themeDir, `pipeline-column-${i+1}.png`));
          if (captured) {
            console.log(`    Captured pipeline column ${i+1} in ${theme} mode`);
          }
        }
      } else {
        console.log(`    No columns found with any of the selectors`);
      }
      
      // More comprehensive selectors for cards
      const cardSelectors = [
        '.card', '[draggable="true"]', '[role="listitem"]',
        '.deal-card', '.pipeline-card', '.task-card',
        'div[class*="card"]', 'div[class*="Card"]'
      ];
      
      let cards = [];
      for (const selector of cardSelectors) {
        const found = await page.$$(selector);
        if (found.length > 0) {
          cards = found;
          console.log(`    Found ${found.length} cards using selector: ${selector}`);
          break;
        }
      }
      
      if (cards.length > 0) {
        for (let i = 0; i < Math.min(cards.length, 3); i++) {
          const card = cards[i];
          const captured = await safeScreenshot(card, path.join(themeDir, `pipeline-card-${i+1}.png`));
          if (captured) {
            console.log(`    Captured pipeline card ${i+1} in ${theme} mode`);
          }
        }
      } else {
        console.log(`    No cards found with any of the selectors`);
      }
      
      // 3. Interactive Elements and States
      console.log(`  Capturing interactive elements and states in ${theme} mode...`);
      
      // 3.1 Collapsed Sidebar - try different selectors
      const sidebarToggleSelectors = [
        '[aria-label="Toggle sidebar"]', '.sidebar-toggle', 
        'button:has-text("Menu")', 'button.toggle', 
        'button[aria-expanded]', 'button svg[class*="menu"]',
        'aside button', 'nav button:first-child'
      ];
      
      let sidebarToggle = null;
      for (const selector of sidebarToggleSelectors) {
        const potentialToggle = await page.$(selector);
        if (potentialToggle && await potentialToggle.isVisible()) {
          sidebarToggle = potentialToggle;
          console.log(`    Found sidebar toggle using selector: ${selector}`);
          break;
        }
      }
      
      if (sidebarToggle) {
        // Click the toggle
        await sidebarToggle.click();
        await delay(1000); // Longer delay for animations
        
        // Take screenshot
        await safeScreenshot(page, path.join(themeDir, `pipeline-sidebar-collapsed.png`), false);
        console.log(`    Captured collapsed sidebar state in ${theme} mode`);
        
        // Expand sidebar again for further screenshots
        await sidebarToggle.click();
        await delay(1000); // Longer delay for animations
      } else {
        console.log(`    No sidebar toggle found`);
      }
      
      // 3.2 Dropdowns - try different selectors
      const dropdownSelectors = [
        '[aria-haspopup="true"]', '.dropdown-toggle', 
        'button:has-text("Filter")', 'button:has-text("Sort")',
        'button:has-text("Add")', 'button:has-text("More")',
        'button[aria-expanded="false"]', 'div[role="combobox"]'
      ];
      
      let dropdowns = [];
      for (const selector of dropdownSelectors) {
        const found = await page.$$(selector);
        const visible = [];
        for (const element of found) {
          if (await element.isVisible()) {
            visible.push(element);
          }
        }
        if (visible.length > 0) {
          dropdowns = visible;
          console.log(`    Found ${visible.length} dropdowns using selector: ${selector}`);
          break;
        }
      }
      
      if (dropdowns.length > 0) {
        for (let i = 0; i < Math.min(dropdowns.length, 2); i++) {
          const dropdown = dropdowns[i];
          
          // Get dropdown text for naming
          const dropdownText = await dropdown.evaluate(el => {
            return el.textContent.trim().toLowerCase();
          });
          
          const dropdownName = dropdownText.includes('filter') ? 'filter' : 
                               dropdownText.includes('sort') ? 'sort' : 
                               dropdownText.includes('add') ? 'add' :
                               `dropdown-${i+1}`;
          
          // Click to open the dropdown
          await dropdown.click();
          await delay(1000); // Longer delay for animations
          
          // Take screenshot of the page with open dropdown
          await safeScreenshot(page, path.join(themeDir, `pipeline-${dropdownName}-open.png`), false);
          console.log(`    Captured open ${dropdownName} dropdown in ${theme} mode`);
          
          // Close dropdown by clicking elsewhere
          await page.mouse.click(10, 10);
          await delay(800);
        }
      } else {
        console.log(`    No dropdowns found`);
      }
      
      // 3.3 Card Dragging Animation
      if (cards.length > 0) {
        const dragCard = cards[0];
        try {
          const cardBound = await dragCard.boundingBox();
          if (cardBound) {
            // Start drag operation
            await page.mouse.move(cardBound.x + cardBound.width/2, cardBound.y + cardBound.height/2);
            await page.mouse.down();
            
            // Move to create drag effect - move right 100px
            await page.mouse.move(cardBound.x + cardBound.width/2 + 100, cardBound.y + cardBound.height/2);
            await delay(800); // Longer delay for animations
            
            // Capture during drag
            await safeScreenshot(page, path.join(themeDir, `pipeline-card-dragging.png`), false);
            console.log(`    Captured card dragging animation in ${theme} mode`);
            
            // Complete drag by releasing mouse
            await page.mouse.up();
            await delay(800);
          }
        } catch (err) {
          console.error(`    Error during card drag simulation: ${err.message}`);
        }
      }
      
      // 3.4 Hover states
      if (cards.length > 0) {
        try {
          const hoverCard = cards[0];
          await hoverCard.hover();
          await delay(800);
          await safeScreenshot(hoverCard, path.join(themeDir, `pipeline-card-hover.png`), false);
          console.log(`    Captured card hover state in ${theme} mode`);
        } catch (err) {
          console.error(`    Error during hover capture: ${err.message}`);
        }
      }
      
      // 3.5 Try to find and capture modals/popups
      const modalTriggerSelectors = [
        'button:has-text("Add")', 'button:has-text("Edit")', 
        'button:has-text("View")', '[aria-haspopup="dialog"]',
        'button:has-text("New")', 'button:has-text("Create")',
        'button.add-deal', 'button.new-deal', 'button[class*="add"]'
      ];
      
      let modalTriggers = [];
      for (const selector of modalTriggerSelectors) {
        const found = await page.$$(selector);
        const visible = [];
        for (const element of found) {
          if (await element.isVisible()) {
            visible.push(element);
          }
        }
        
        if (visible.length > 0) {
          modalTriggers = visible;
          console.log(`    Found ${visible.length} modal triggers using selector: ${selector}`);
          break;
        }
      }
      
      if (modalTriggers.length > 0) {
        for (let i = 0; i < Math.min(modalTriggers.length, 2); i++) {
          try {
            const trigger = modalTriggers[i];
            const triggerText = await trigger.evaluate(el => el.textContent.trim().toLowerCase());
            
            console.log(`    Clicking on "${triggerText}" button to trigger modal`);
            await trigger.click();
            await delay(1000); // Longer delay for modal animations
            
            // Try different selectors for modals
            const modalSelectors = [
              '[role="dialog"]', '.modal', '.popup', '.dialog',
              'div[class*="modal"]', 'div[class*="Modal"]', 
              'div[class*="popup"]', 'div[class*="Popup"]'
            ];
            
            let modal = null;
            for (const selector of modalSelectors) {
              const potentialModal = await page.$(selector);
              if (potentialModal && await potentialModal.isVisible()) {
                modal = potentialModal;
                console.log(`    Found modal using selector: ${selector}`);
                break;
              }
            }
            
            if (modal) {
              const triggerKey = triggerText.includes('add') ? 'add' : 
                                 triggerText.includes('edit') ? 'edit' : 
                                 triggerText.includes('view') ? 'view' : 
                                 triggerText.includes('new') ? 'new' :
                                 'modal';
              
              await safeScreenshot(page, path.join(themeDir, `pipeline-${triggerKey}-modal.png`), false);
              console.log(`    Captured ${triggerKey} modal in ${theme} mode`);
              
              // Try to find close button in modal
              const closeButtonSelectors = [
                'button:has-text("Close")', 'button:has-text("Cancel")', 
                '[aria-label="Close"]', 'button svg[class*="close"]',
                'button.close', 'button[class*="close"]', 'button.cancel',
                'button[class*="Cancel"]', 'button:has-text("×")'
              ];
              
              let closeButton = null;
              for (const selector of closeButtonSelectors) {
                const potentialClose = await modal.$(selector) || await page.$(selector);
                if (potentialClose && await potentialClose.isVisible()) {
                  closeButton = potentialClose;
                  break;
                }
              }
              
              if (closeButton) {
                await closeButton.click();
                await delay(800);
              } else {
                // Press Escape key to close
                await page.keyboard.press('Escape');
                await delay(800);
                
                // If modal still present, click outside
                if (await modal.isVisible()) {
                  await page.mouse.click(10, 10);
                  await delay(800);
                }
              }
            } else {
              console.log(`    No modal appeared after clicking "${triggerText}" button`);
              // Click elsewhere to dismiss any menus
              await page.mouse.click(10, 10);
              await delay(800);
            }
          } catch (err) {
            console.error(`    Error handling modal: ${err.message}`);
            // Try to recover by clicking somewhere safe or press Escape
            await page.mouse.click(10, 10);
            await page.keyboard.press('Escape');
            await delay(800);
          }
        }
      } else {
        console.log(`    No modal triggers found`);
      }
      
      // 4. Capture specific UI components
      console.log(`  Capturing UI components in ${theme} mode...`);
      const uiComponentSelectors = [
        { name: 'buttons', selector: 'button:not([aria-hidden="true"]):not([aria-label="Close"])' },
        { name: 'search', selector: 'input[type="search"], [role="search"], input[placeholder*="search" i]' },
        { name: 'icons', selector: 'svg, .icon, [aria-hidden="true"]' },
        { name: 'status-indicators', selector: '.status, .badge, .tag, [class*="status"], [class*="Status"], [class*="badge"], [class*="Badge"]' }
      ];
      
      for (const component of uiComponentSelectors) {
        const elements = await page.$$(component.selector);
        const visibleElements = [];
        
        for (const element of elements) {
          if (await element.isVisible()) {
            visibleElements.push(element);
          }
        }
        
        if (visibleElements.length > 0) {
          console.log(`    Found ${visibleElements.length} ${component.name} components`);
          
          // Just capture a few individual examples
          for (let i = 0; i < Math.min(visibleElements.length, 3); i++) {
            const element = visibleElements[i];
            const captured = await safeScreenshot(element, path.join(themeDir, `pipeline-${component.name}-${i+1}.png`), false);
            if (captured) {
              console.log(`      Captured ${component.name} ${i+1} in ${theme} mode`);
            }
          }
        } else {
          console.log(`    No ${component.name} found`);
        }
      }
      
    } catch (error) {
      console.error(`Error processing pipeline page in ${theme} mode:`, error.message);
    }
    
    // Close the context after capturing this theme
    await context.close();
  }
  
  console.log('Pipeline screenshot capture process complete!');
  console.log(`Screenshots saved to: ${screenshotsDir}/`);
  
  // Close the browser
  await browser.close();
})(); 