const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'documentation', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

(async () => {
  // Launch the browser
  const browser = await chromium.launch({ headless: false }); // Set to false to see browser
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Just the pipeline page for testing
  const pageConfig = {
    name: 'pipeline',
    url: 'http://localhost:3001/pipeline',
    interactions: [
      { name: 'default-view', action: async () => {} },
      {
        name: 'sidebar-collapsed',
        action: async (page) => {
          // Try to collapse sidebar if toggle exists
          const sidebarToggle = await page.$('[aria-label="Toggle sidebar"]') || 
                                await page.$('.sidebar-toggle');
          if (sidebarToggle) {
            await sidebarToggle.click();
            await page.waitForTimeout(500);
          }
        }
      },
      {
        name: 'card-dragging',
        action: async (page) => {
          // Simulate dragging a card if draggable elements exist
          const cards = await page.$$('[draggable="true"]');
          if (cards.length > 0) {
            const card = cards[0];
            const cardBound = await card.boundingBox();
            if (cardBound) {
              await page.mouse.move(cardBound.x + cardBound.width/2, cardBound.y + cardBound.height/2);
              await page.mouse.down();
              await page.mouse.move(cardBound.x + 100, cardBound.y);
              // Don't release to show dragging state
            }
          }
        }
      }
    ]
  };

  console.log('Starting pipeline screenshot capture process...');
  
  // Create directory for this page
  const pageDir = path.join(screenshotsDir, pageConfig.name);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir);
  }
  
  try {
    // Navigate to the page
    await page.goto(pageConfig.url, { waitUntil: 'networkidle' });
    console.log(`  Loaded ${pageConfig.url}`);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: path.join(pageDir, `${pageConfig.name}-full.png`),
      fullPage: true 
    });
    console.log(`  Captured full page screenshot`);
    
    // Process each interaction for this page
    for (const interaction of pageConfig.interactions) {
      try {
        console.log(`  Processing interaction: ${interaction.name}`);
        
        // Perform the interaction
        await interaction.action(page);
        
        // Take screenshot after interaction
        await page.screenshot({ 
          path: path.join(pageDir, `${pageConfig.name}-${interaction.name}.png`)
        });
        console.log(`    Captured ${interaction.name} screenshot`);
        
        // Reset state by reloading if needed
        if (interaction.name !== 'default-view') {
          await page.reload({ waitUntil: 'networkidle' });
        }
      } catch (interactionError) {
        console.error(`  Error during interaction ${interaction.name}:`, interactionError.message);
      }
    }
    
    // Capture component screenshots
    console.log(`  Capturing component screenshots...`);
    
    // Common component selectors to try
    const componentSelectors = [
      { name: 'sidebar', selector: '.sidebar, [role="navigation"]' },
      { name: 'header', selector: 'header, .header, [role="banner"]' },
      { name: 'main-content', selector: 'main, .main-content, [role="main"]' },
      { name: 'cards', selector: '.card, [role="region"], [draggable="true"]' },
      { name: 'buttons', selector: 'button:not([aria-hidden="true"])' },
      { name: 'dropdowns', selector: '[role="menu"], .dropdown' }
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
                path: path.join(pageDir, `${pageConfig.name}-${component.name}-${i+1}.png`)
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
    console.error(`Error processing pipeline page:`, pageError.message);
  }

  console.log('Screenshot capture process complete!');
  console.log(`Screenshots saved to: ${screenshotsDir}/${pageConfig.name}/`);
  
  // Close browser
  await browser.close();
})(); 