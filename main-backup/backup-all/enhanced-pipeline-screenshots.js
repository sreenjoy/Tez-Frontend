const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'documentation', 'comprehensive', 'test-pipeline-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

(async () => {
  // Launch the browser
  const browser = await chromium.launch({ headless: false });
  
  // Capture both light and dark modes
  const themes = ['light', 'dark'];
  
  for (const theme of themes) {
    console.log(`Starting pipeline screenshot capture for ${theme} mode...`);
    
    // Create context with color scheme preference
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      colorScheme: theme === 'dark' ? 'dark' : 'light'
    });
    
    const page = await context.newPage();
    
    // Create directory for this theme
    const themeDir = path.join(screenshotsDir, theme);
    if (!fs.existsSync(themeDir)) {
      fs.mkdirSync(themeDir);
    }
    
    try {
      // Navigate to the pipeline page
      await page.goto('http://localhost:3001/pipeline', { waitUntil: 'networkidle' });
      console.log(`  Loaded pipeline page in ${theme} mode`);
      
      // Take full page screenshot
      await page.screenshot({ 
        path: path.join(themeDir, `pipeline-full.png`),
        fullPage: true 
      });
      console.log(`  Captured full page screenshot in ${theme} mode`);
      
      // 1. Basic UI Elements
      const basicComponents = [
        { name: 'header', selector: 'header, .header, [role="banner"]' },
        { name: 'sidebar', selector: '.sidebar, [role="navigation"]' },
        { name: 'main-content', selector: 'main, .main-content, [role="main"]' },
        { name: 'footer', selector: 'footer, .footer, [role="contentinfo"]' }
      ];
      
      console.log(`  Capturing basic UI components in ${theme} mode...`);
      for (const component of basicComponents) {
        const elements = await page.$$(component.selector);
        if (elements.length > 0) {
          for (let i = 0; i < Math.min(elements.length, 1); i++) {
            const element = elements[i];
            if (await element.isVisible()) {
              await element.screenshot({ 
                path: path.join(themeDir, `pipeline-${component.name}.png`)
              });
              console.log(`    Captured ${component.name} in ${theme} mode`);
            }
          }
        }
      }
      
      // 2. Pipeline Cards and Columns
      console.log(`  Capturing pipeline cards and columns in ${theme} mode...`);
      const columns = await page.$$('.pipeline-column, [role="list"], [data-column-id]');
      if (columns.length > 0) {
        for (let i = 0; i < Math.min(columns.length, 4); i++) {
          const column = columns[i];
          if (await column.isVisible()) {
            await column.screenshot({ 
              path: path.join(themeDir, `pipeline-column-${i+1}.png`)
            });
            console.log(`    Captured pipeline column ${i+1} in ${theme} mode`);
          }
        }
      }
      
      const cards = await page.$$('.card, [draggable="true"], [role="listitem"]');
      if (cards.length > 0) {
        for (let i = 0; i < Math.min(cards.length, 3); i++) {
          const card = cards[i];
          if (await card.isVisible()) {
            await card.screenshot({ 
              path: path.join(themeDir, `pipeline-card-${i+1}.png`)
            });
            console.log(`    Captured pipeline card ${i+1} in ${theme} mode`);
          }
        }
      }
      
      // 3. Interactive Elements and States
      console.log(`  Capturing interactive elements and states in ${theme} mode...`);
      
      // 3.1 Collapsed Sidebar
      const sidebarToggle = await page.$('[aria-label="Toggle sidebar"], .sidebar-toggle, button:has-text("Menu")');
      if (sidebarToggle) {
        await sidebarToggle.click();
        await page.waitForTimeout(500);
        await page.screenshot({ 
          path: path.join(themeDir, `pipeline-sidebar-collapsed.png`)
        });
        console.log(`    Captured collapsed sidebar state in ${theme} mode`);
        
        // Expand sidebar again for further screenshots
        await sidebarToggle.click();
        await page.waitForTimeout(500);
      }
      
      // 3.2 Dropdowns
      const dropdowns = await page.$$('[aria-haspopup="true"], .dropdown-toggle, button:has-text("Filter"), button:has-text("Sort")');
      if (dropdowns.length > 0) {
        for (let i = 0; i < Math.min(dropdowns.length, 2); i++) {
          const dropdown = dropdowns[i];
          if (await dropdown.isVisible()) {
            // Get dropdown position before clicking
            const dropdownName = await dropdown.evaluate(el => 
              el.textContent.toLowerCase().includes('filter') ? 'filter' : 
              el.textContent.toLowerCase().includes('sort') ? 'sort' : 
              `dropdown-${i+1}`
            );
            
            await dropdown.click();
            await page.waitForTimeout(500);
            
            // Capture the open dropdown menu
            const menu = await page.$('[role="menu"], .dropdown-menu');
            if (menu && await menu.isVisible()) {
              await page.screenshot({ 
                path: path.join(themeDir, `pipeline-${dropdownName}-open.png`)
              });
              console.log(`    Captured open ${dropdownName} dropdown in ${theme} mode`);
              
              // Close dropdown by clicking elsewhere
              await page.mouse.click(10, 10);
              await page.waitForTimeout(300);
            }
          }
        }
      }
      
      // 3.3 Card Dragging Animation
      const dragCard = cards.length > 0 ? cards[0] : null;
      if (dragCard && await dragCard.isVisible()) {
        const cardBound = await dragCard.boundingBox();
        if (cardBound) {
          // Start drag operation
          await page.mouse.move(cardBound.x + cardBound.width/2, cardBound.y + cardBound.height/2);
          await page.mouse.down();
          
          // Move to create drag effect - move right 100px
          await page.mouse.move(cardBound.x + cardBound.width/2 + 100, cardBound.y + cardBound.height/2);
          await page.waitForTimeout(300);
          
          // Capture during drag
          await page.screenshot({ 
            path: path.join(themeDir, `pipeline-card-dragging.png`)
          });
          console.log(`    Captured card dragging animation in ${theme} mode`);
          
          // Complete drag by releasing mouse
          await page.mouse.up();
          await page.waitForTimeout(300);
        }
      }
      
      // 3.4 Hover states
      if (cards.length > 0) {
        const hoverCard = cards[0];
        if (await hoverCard.isVisible()) {
          await hoverCard.hover();
          await page.waitForTimeout(300);
          await hoverCard.screenshot({ 
            path: path.join(themeDir, `pipeline-card-hover.png`)
          });
          console.log(`    Captured card hover state in ${theme} mode`);
        }
      }
      
      // 3.5 Try to find and capture modals/popups
      const modalTriggers = await page.$$('button:has-text("Add"), button:has-text("Edit"), button:has-text("View"), [aria-haspopup="dialog"]');
      if (modalTriggers.length > 0) {
        for (let i = 0; i < Math.min(modalTriggers.length, 2); i++) {
          const trigger = modalTriggers[i];
          if (await trigger.isVisible()) {
            const triggerText = await trigger.evaluate(el => el.textContent.trim().toLowerCase());
            
            await trigger.click();
            await page.waitForTimeout(500);
            
            const modal = await page.$('[role="dialog"], .modal, .popup');
            if (modal && await modal.isVisible()) {
              await page.screenshot({ 
                path: path.join(themeDir, `pipeline-${triggerText}-modal.png`)
              });
              console.log(`    Captured ${triggerText} modal in ${theme} mode`);
              
              // Try to find close button in modal
              const closeButton = await modal.$('button:has-text("Close"), button:has-text("Cancel"), [aria-label="Close"]');
              if (closeButton) {
                await closeButton.click();
                await page.waitForTimeout(300);
              } else {
                // Click outside to close
                await page.mouse.click(10, 10);
                await page.waitForTimeout(300);
              }
            }
          }
        }
      }
      
      // 4. Capture specific UI components
      console.log(`  Capturing UI components in ${theme} mode...`);
      const uiComponentSelectors = [
        { name: 'buttons', selector: 'button:not([aria-hidden="true"]):not([aria-label="Close"])' },
        { name: 'search', selector: 'input[type="search"], [role="search"]' },
        { name: 'icons', selector: 'svg, .icon, [aria-hidden="true"]' },
        { name: 'status-indicators', selector: '.status, .badge, .tag' }
      ];
      
      for (const component of uiComponentSelectors) {
        const elements = await page.$$(component.selector);
        if (elements.length > 0) {
          // Group similar elements into a collection screenshot
          const visibleElements = [];
          for (const element of elements) {
            if (await element.isVisible()) {
              visibleElements.push(element);
            }
          }
          
          if (visibleElements.length > 0) {
            // Just capture a few individual examples
            for (let i = 0; i < Math.min(visibleElements.length, 3); i++) {
              const element = visibleElements[i];
              await element.screenshot({ 
                path: path.join(themeDir, `pipeline-${component.name}-${i+1}.png`)
              });
            }
            console.log(`    Captured ${visibleElements.length} ${component.name} in ${theme} mode`);
          }
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