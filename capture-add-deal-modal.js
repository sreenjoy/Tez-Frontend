const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'documentation', 'comprehensive', 'test-pipeline-screenshots');
const modalDir = path.join(screenshotsDir, 'modal');
if (!fs.existsSync(modalDir)) {
  fs.mkdirSync(modalDir, { recursive: true });
}

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  // Launch browser with longer timeout
  const browser = await chromium.launch({ 
    headless: false,
    timeout: 120000
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'dark', // Using dark mode for better visibility
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to pipeline page
    await page.goto('http://localhost:3001/pipeline', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    console.log('Loaded pipeline page');
    
    // Specifically target the Add Deal button
    console.log('Looking for Add Deal button...');
    
    const addDealButton = await page.$('button:has-text("Add Deal")');
    if (!addDealButton) {
      console.log('Add Deal button not found, trying alternative selectors...');
      
      // Try alternative selectors
      const alternativeSelectors = [
        'button:has-text("Add")',
        'button.add-deal',
        'button[class*="add"]'
      ];
      
      for (const selector of alternativeSelectors) {
        const button = await page.$(selector);
        if (button && await button.isVisible()) {
          console.log(`Found button with selector: ${selector}`);
          
          // Take screenshot of the button
          await button.screenshot({ 
            path: path.join(modalDir, 'add-deal-button.png') 
          });
          
          // Take full page screenshot before clicking
          await page.screenshot({ 
            path: path.join(modalDir, 'before-modal.png'),
            fullPage: false 
          });
          
          console.log('Clicking button to open modal...');
          // Click with timeout and wait for network idle
          await button.click({ timeout: 5000 });
          await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
          await delay(2000); // Extra wait time for modal animation
          
          // Look for modal
          const modalSelectors = [
            '[role="dialog"]',
            '.modal',
            '.popup',
            'div[class*="modal"]',
            'div[class*="dialog"]',
            'div.fixed.inset-0'
          ];
          
          console.log('Looking for opened modal...');
          let modal = null;
          
          for (const modalSelector of modalSelectors) {
            const element = await page.$(modalSelector);
            if (element && await element.isVisible()) {
              modal = element;
              console.log(`Found modal with selector: ${modalSelector}`);
              break;
            }
          }
          
          if (modal) {
            // Take full page screenshot with modal open
            await page.screenshot({
              path: path.join(modalDir, 'full-page-with-modal.png'),
              fullPage: false
            });
            
            // Try to take screenshot of just the modal
            try {
              await modal.screenshot({
                path: path.join(modalDir, 'modal.png')
              });
              console.log('Captured modal screenshot');
            } catch (err) {
              console.error(`Error capturing modal: ${err.message}`);
            }
            
            // Try to find elements inside the modal
            const modalElements = [
              { type: 'title', selector: 'h1, h2, h3, .modal-title, [class*="title"]' },
              { type: 'form', selector: 'form, .form' },
              { type: 'input', selector: 'input, textarea, select' },
              { type: 'button', selector: 'button, [role="button"]' }
            ];
            
            for (const elementType of modalElements) {
              const elements = await modal.$$(elementType.selector);
              console.log(`Found ${elements.length} ${elementType.type} elements in modal`);
              
              for (let i = 0; i < Math.min(elements.length, 3); i++) {
                const element = elements[i];
                if (await element.isVisible()) {
                  try {
                    await element.screenshot({
                      path: path.join(modalDir, `modal-${elementType.type}-${i+1}.png`)
                    });
                    console.log(`Captured ${elementType.type} ${i+1}`);
                  } catch (err) {
                    console.error(`Error capturing ${elementType.type}: ${err.message}`);
                  }
                }
              }
            }
            
            // Get a screenshot of the modal backdrop/overlay
            try {
              const backdrop = await page.$('.fixed.inset-0, .modal-backdrop, [class*="overlay"]');
              if (backdrop) {
                const backdropBox = await backdrop.boundingBox();
                if (backdropBox) {
                  // Just take a screenshot of a portion to show the overlay effect
                  await page.screenshot({
                    path: path.join(modalDir, 'modal-backdrop.png'),
                    clip: {
                      x: Math.max(0, backdropBox.x),
                      y: Math.max(0, backdropBox.y),
                      width: Math.min(300, backdropBox.width),
                      height: Math.min(300, backdropBox.height)
                    }
                  });
                  console.log('Captured modal backdrop');
                }
              }
            } catch (err) {
              console.error(`Error capturing backdrop: ${err.message}`);
            }
            
            // Save a copy of the modal for documentation
            await page.evaluate(() => {
              const getModalHTML = () => {
                const modals = document.querySelectorAll('[role="dialog"], .modal, .popup, div[class*="modal"], div[class*="dialog"]');
                if (modals.length > 0) {
                  return modals[0].outerHTML;
                }
                return null;
              };
              
              // Add to console for debugging
              console.log(getModalHTML());
              
              // Store in a global variable to access later
              window._modalHTML = getModalHTML();
            });
            
            // Close the modal
            console.log('Closing modal...');
            
            // Try finding a close button
            const closeButton = await modal.$('button:has-text("Close"), button:has-text("Cancel"), [aria-label="Close"]');
            if (closeButton) {
              await closeButton.screenshot({
                path: path.join(modalDir, 'close-button.png')
              });
              await closeButton.click();
              console.log('Clicked close button');
            } else {
              // Try pressing escape
              await page.keyboard.press('Escape');
              console.log('Pressed Escape key');
            }
            
            // Wait for modal to close
            await delay(1000);
            
            // Check if modal is gone
            const modalStillVisible = await modal.isVisible().catch(() => false);
            console.log(`Modal ${modalStillVisible ? 'still visible' : 'closed successfully'}`);
            
            break;
          } else {
            console.log('No modal found after clicking button');
          }
          
          break;
        }
      }
    } else {
      console.log('Found Add Deal button');
      
      // Take screenshot of the button
      await addDealButton.screenshot({ 
        path: path.join(modalDir, 'add-deal-button.png') 
      });
      
      // Take full page screenshot before clicking
      await page.screenshot({ 
        path: path.join(modalDir, 'before-modal.png'),
        fullPage: false 
      });
      
      console.log('Clicking Add Deal button...');
      await addDealButton.click();
      await delay(2000); // Wait for modal animation
      
      // Take full page screenshot with modal
      await page.screenshot({ 
        path: path.join(modalDir, 'with-modal.png'),
        fullPage: false
      });
      
      // Try to find the modal
      const modal = await page.$('[role="dialog"], .modal, .popup');
      if (modal) {
        console.log('Found modal');
        
        // Take screenshot of just the modal
        await modal.screenshot({ 
          path: path.join(modalDir, 'modal.png')
        });
        
        // Close the modal
        const closeButton = await modal.$('button:has-text("Close"), button:has-text("Cancel"), [aria-label="Close"]');
        if (closeButton) {
          await closeButton.click();
        } else {
          await page.keyboard.press('Escape');
        }
      } else {
        console.log('No modal found after clicking Add Deal button');
      }
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await delay(1000);
    await context.close();
    await browser.close();
    console.log('Capture complete');
  }
})(); 