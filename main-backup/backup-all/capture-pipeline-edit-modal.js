const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'documentation', 'comprehensive', 'test-pipeline-screenshots');
const editModalDir = path.join(screenshotsDir, 'edit-modal');

if (!fs.existsSync(editModalDir)) {
  fs.mkdirSync(editModalDir, { recursive: true });
}

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
    
    // First take a screenshot of the page before opening modal
    await page.screenshot({
      path: path.join(editModalDir, 'before-modal.png'),
      fullPage: false
    });
    
    // Look specifically for the Main Pipeline dropdown and edit button beside it
    console.log('Looking for Main Pipeline dropdown...');
    
    // Try using the exact selector we see in the screenshot
    const mainPipelineButton = await page.$('button:has-text("Main Pipeline")');
    
    if (mainPipelineButton) {
      console.log('Found Main Pipeline dropdown');
      
      // Take screenshot of the Main Pipeline button
      await mainPipelineButton.screenshot({
        path: path.join(editModalDir, 'main-pipeline-button.png')
      });
      
      // Look for the edit button right next to it
      // Use the page evaluation to find elements by their visual position
      const editButton = await page.evaluateHandle(() => {
        const pipelineBtn = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Main Pipeline'));
        
        if (!pipelineBtn) return null;
        
        // Get all buttons in the same area
        const allButtons = Array.from(document.querySelectorAll('button'));
        
        // Get pipeline button position
        const pRect = pipelineBtn.getBoundingClientRect();
        
        // Find button to the right of the pipeline button
        const editBtn = allButtons.find(btn => {
          if (btn === pipelineBtn) return false;
          const bRect = btn.getBoundingClientRect();
          // Check if button is right next to pipeline button (within 50px)
          return Math.abs(bRect.left - (pRect.right + 10)) < 50 && 
                 Math.abs(bRect.top - pRect.top) < 20;
        });
        
        return editBtn;
      });
      
      if (editButton) {
        console.log('Found edit button next to Main Pipeline');
        
        // Take screenshot of the edit button
        await editButton.screenshot({
          path: path.join(editModalDir, 'edit-button.png')
        });
        
        // Click the edit button to open the modal
        await editButton.click();
        console.log('Clicked edit button');
        
        // Wait for the modal to appear
        await delay(1000);
        
        // Look for the modal with the specific title "Edit Pipeline"
        const modal = await page.$('div:has-text("Edit Pipeline")');
        
        if (modal) {
          console.log('Found Edit Pipeline modal');
          
          // Take a full page screenshot with the modal open
          await page.screenshot({
            path: path.join(editModalDir, 'with-edit-modal.png'),
            fullPage: false
          });
          
          // Try to get just the modal
          const modalBox = await modal.boundingBox();
          if (modalBox) {
            await page.screenshot({
              path: path.join(editModalDir, 'edit-modal.png'),
              clip: {
                x: Math.max(0, modalBox.x - 20),
                y: Math.max(0, modalBox.y - 20),
                width: Math.min(modalBox.width + 40, page.viewportSize().width),
                height: Math.min(modalBox.height + 40, page.viewportSize().height)
              }
            });
          }
          
          // Capture the modal components
          
          // 1. Header section
          const modalHeader = await modal.$('.flex.items-center.justify-between, div:has-text("Edit Pipeline"):first-child');
          if (modalHeader) {
            await modalHeader.screenshot({
              path: path.join(editModalDir, 'modal-header.png')
            });
          }
          
          // 2. Pipeline Name input
          const pipelineNameSection = await modal.$('div:has-text("Pipeline Name")');
          if (pipelineNameSection) {
            await pipelineNameSection.screenshot({
              path: path.join(editModalDir, 'pipeline-name-section.png')
            });
          }
          
          // 3. Pipeline Stages section
          const pipelineStagesSection = await modal.$('div:has-text("Pipeline Stages")');
          if (pipelineStagesSection) {
            await pipelineStagesSection.screenshot({
              path: path.join(editModalDir, 'pipeline-stages-section.png')
            });
          }
          
          // 4. Individual stage items
          const stageItems = await modal.$$('.flex.items-center, div:has-text("Lead"), div:has-text("Contacted")');
          for (let i = 0; i < Math.min(stageItems.length, 5); i++) {
            await stageItems[i].screenshot({
              path: path.join(editModalDir, `stage-item-${i+1}.png`)
            });
          }
          
          // 5. Add stage input
          const addStageSection = await modal.$('input[placeholder="Add stage"]');
          if (addStageSection) {
            const addStageContainer = await addStageSection.evaluateHandle(el => 
              el.closest('.bg-gray-50, .flex.items-center, .p-4')
            );
            if (addStageContainer) {
              await addStageContainer.screenshot({
                path: path.join(editModalDir, 'add-stage-section.png')
              });
            }
          }
          
          // 6. Footer buttons
          const footerButtons = await modal.$('.flex.justify-end, div:has-button:has-text("Cancel")');
          if (footerButtons) {
            await footerButtons.screenshot({
              path: path.join(editModalDir, 'modal-footer.png')
            });
          }
          
          // Now close the modal
          const cancelButton = await modal.$('button:has-text("Cancel")');
          if (cancelButton) {
            await cancelButton.click();
            console.log('Closed modal using Cancel button');
          } else {
            const closeButton = await modal.$('[aria-label="Close"], button:has-text("×")');
            if (closeButton) {
              await closeButton.click();
              console.log('Closed modal using close button');
            } else {
              await page.keyboard.press('Escape');
              console.log('Tried closing modal with Escape key');
            }
          }
          
          // Verify modal is closed
          await delay(1000);
          const modalGone = !(await page.$('div:has-text("Edit Pipeline")'));
          console.log(`Modal ${modalGone ? 'closed successfully' : 'still visible'}`);
          
        } else {
          console.log('Could not find Edit Pipeline modal');
        }
      } else {
        console.log('Could not find edit button next to Main Pipeline');
      }
    } else {
      console.log('Could not find Main Pipeline button, trying alternative selectors');
      
      // Try alternative selectors for the pipeline dropdown
      const pipelineSelectors = [
        'button:has-text("Pipeline")', 
        '.pipeline-selector',
        'div[role="combobox"]'
      ];
      
      let pipelineElement = null;
      
      for (const selector of pipelineSelectors) {
        const element = await page.$(selector);
        if (element && await element.isVisible()) {
          pipelineElement = element;
          console.log(`Found pipeline element with selector: ${selector}`);
          break;
        }
      }
      
      if (pipelineElement) {
        // Look for a button that might be the edit button to the right
        const editButtons = await page.$$('button');
        let editButton = null;
        
        const pipelineBox = await pipelineElement.boundingBox();
        
        for (const button of editButtons) {
          if (button === pipelineElement) continue;
          
          const buttonBox = await button.boundingBox();
          if (!buttonBox) continue;
          
          // Check if the button is to the right of the pipeline element
          if (buttonBox.x > pipelineBox.x + pipelineBox.width && 
              Math.abs(buttonBox.y - pipelineBox.y) < 20) {
            editButton = button;
            console.log('Found potential edit button based on position');
            break;
          }
        }
        
        if (editButton) {
          await editButton.screenshot({
            path: path.join(editModalDir, 'edit-button-alternative.png')
          });
          
          await editButton.click();
          console.log('Clicked potential edit button');
          
          await delay(1000);
          
          // Look for the modal
          const modal = await page.$('div:has-text("Edit Pipeline")');
          if (modal) {
            console.log('Found Edit Pipeline modal');
            await page.screenshot({
              path: path.join(editModalDir, 'with-edit-modal-alternative.png'),
              fullPage: false
            });
          } else {
            console.log('Could not find Edit Pipeline modal');
          }
        } else {
          console.log('Could not find edit button near pipeline element');
        }
      } else {
        console.log('Could not find any pipeline selector element');
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await delay(1000);
    await context.close();
    await browser.close();
    console.log('Pipeline edit modal capture complete');
  }
})(); 