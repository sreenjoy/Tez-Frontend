const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'documentation', 'comprehensive', 'test-pipeline-screenshots');
const animationsDir = path.join(screenshotsDir, 'animations');
if (!fs.existsSync(animationsDir)) {
  fs.mkdirSync(animationsDir, { recursive: true });
}

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false,
    timeout: 60000
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'dark', // Using dark mode for better visibility
    recordVideo: {
      dir: animationsDir,
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to pipeline page
    await page.goto('http://localhost:3001/pipeline', { waitUntil: 'networkidle' });
    console.log('Loaded pipeline page');
    
    // Try different buttons that might trigger central modals
    const triggerSelectors = [
      'button:has-text("Add Deal")',
      'button:has-text("Add")',
      'button:has-text("New")',
      'button:has-text("Create")',
      // Try buttons with plus icon
      'button:has-text("+")',
      'button.add-button',
      'button[class*="add"]',
      'button[aria-label*="add" i]',
      'button[aria-label*="new" i]',
      // Try buttons in the header
      'header button',
      '.header button',
      'nav button',
      // Try specific locations
      '.pipeline-header button',
      '.column-header button',
      '.card-actions button'
    ];
    
    // Prepare for capturing animation frames
    console.log('Setting up for animation capture...');
    
    // Function to capture animation frames
    const captureModalAnimation = async (modal, frameName) => {
      console.log(`Capturing ${frameName} animation frames...`);
      
      // Capture initial state
      await page.screenshot({ 
        path: path.join(animationsDir, `${frameName}-frame-1.png`)
      });
      
      // Capture several frames to show animation
      for (let i = 2; i <= 5; i++) {
        await delay(100); // Capture at 100ms intervals
        await page.screenshot({ 
          path: path.join(animationsDir, `${frameName}-frame-${i}.png`)
        });
      }
      
      // Capture final state
      await delay(300);
      await page.screenshot({ 
        path: path.join(animationsDir, `${frameName}-final.png`)
      });
      
      console.log(`Captured animation frames for ${frameName}`);
    };
    
    // Start capturing modal
    console.log('Trying to find and trigger modal...');
    
    let foundModal = false;
    
    // Try each potential trigger
    for (const selector of triggerSelectors) {
      console.log(`Trying selector: ${selector}`);
      
      try {
        const buttons = await page.$$(selector);
        
        for (const button of buttons) {
          if (await button.isVisible()) {
            console.log(`  Found visible button with selector: ${selector}`);
            
            // Take screenshot of the button
            await button.screenshot({
              path: path.join(animationsDir, 'trigger-button.png')
            });
            
            // Click to open modal
            await button.click();
            await delay(500); // Wait for animation to start
            
            // Check for modal
            const modalSelectors = [
              '[role="dialog"]', 
              '.modal', 
              '.popup', 
              'div[role="dialog"]',
              'div[class*="modal"]',
              'div[class*="Modal"]',
              'div[class*="popup"]',
              'div[class*="dialog"]'
            ];
            
            for (const modalSelector of modalSelectors) {
              const modal = await page.$(modalSelector);
              if (modal && await modal.isVisible()) {
                console.log(`  Found modal with selector: ${modalSelector}`);
                
                // Capture opening animation
                await captureModalAnimation(modal, 'modal-opening');
                
                // Take screenshot of the fully opened modal
                await modal.screenshot({
                  path: path.join(animationsDir, 'modal.png')
                });
                
                // Try interacting with elements inside the modal
                const interactiveElements = await modal.$$('button, input, select');
                
                for (let i = 0; i < Math.min(interactiveElements.length, 3); i++) {
                  const element = interactiveElements[i];
                  if (await element.isVisible()) {
                    console.log(`  Interacting with element ${i+1} in modal`);
                    
                    // Hover over element
                    await element.hover();
                    await delay(300);
                    
                    // Take screenshot of hover state
                    await element.screenshot({
                      path: path.join(animationsDir, `modal-element-${i+1}-hover.png`)
                    });
                    
                    // If it's a button, try clicking it
                    const tagName = await element.evaluate(el => el.tagName.toLowerCase());
                    if (tagName === 'button') {
                      await element.click();
                      await delay(500);
                      
                      // Capture any resulting state changes
                      await page.screenshot({
                        path: path.join(animationsDir, `modal-element-${i+1}-clicked.png`)
                      });
                      
                      // Click elsewhere to reset if needed
                      await page.mouse.click(10, 10);
                      await delay(300);
                    }
                  }
                }
                
                // Prepare to close the modal and capture closing animation
                const closeButtons = await modal.$$('button:has-text("Close"), button:has-text("Cancel"), button[aria-label="Close"]');
                
                if (closeButtons.length > 0) {
                  console.log(`  Closing modal to capture closing animation`);
                  
                  // Before closing, take full screenshot
                  await page.screenshot({
                    path: path.join(animationsDir, 'modal-before-close.png')
                  });
                  
                  // Click close button
                  await closeButtons[0].click();
                  
                  // Capture closing animation
                  await captureModalAnimation(modal, 'modal-closing');
                }
                
                foundModal = true;
                break;
              }
            }
            
            if (foundModal) break;
            
            // If no modal appeared, reset by clicking elsewhere
            await page.mouse.click(10, 10);
            await delay(300);
          }
        }
        
        if (foundModal) break;
      } catch (err) {
        console.error(`  Error with selector ${selector}: ${err.message}`);
      }
    }
    
    if (!foundModal) {
      console.log('Could not find a modal. Trying alternative approach...');
      
      // Try clicking on a card or row which might open a details modal
      const cardSelectors = [
        '.card', 
        '[draggable="true"]', 
        '[role="listitem"]',
        '.deal-card', 
        '.pipeline-card',
        'tr', 
        'tbody tr'
      ];
      
      for (const selector of cardSelectors) {
        const elements = await page.$$(selector);
        
        for (const element of elements) {
          if (await element.isVisible()) {
            console.log(`  Trying to click on ${selector} to open modal`);
            
            await element.click();
            await delay(1000);
            
            // Check if a modal appeared
            const modal = await page.$('[role="dialog"], .modal, .popup');
            if (modal && await modal.isVisible()) {
              console.log(`  Modal appeared after clicking ${selector}`);
              
              // Take screenshot of the modal
              await modal.screenshot({
                path: path.join(animationsDir, 'details-modal.png')
              });
              
              // Close modal and break
              const closeButton = await modal.$('button:has-text("Close"), button:has-text("Cancel"), button[aria-label="Close"]');
              if (closeButton) {
                await closeButton.click();
              } else {
                await page.keyboard.press('Escape');
              }
              
              foundModal = true;
              break;
            }
          }
        }
        
        if (foundModal) break;
      }
    }
    
    console.log(foundModal ? 'Successfully captured modal and animations!' : 'Could not find or trigger any modal.');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await context.close();
    await browser.close();
  }
})(); 