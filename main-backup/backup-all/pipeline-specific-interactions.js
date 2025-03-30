const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'documentation', 'comprehensive', 'test-pipeline-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Helper functions
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const safeScreenshot = async (page, filePath, fullPage = false) => {
  try {
    await page.screenshot({ path: filePath, fullPage });
    console.log(`  Screenshot saved: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`  Failed to capture screenshot: ${err.message}`);
    return false;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  // Start browser
  const browser = await chromium.launch({ headless: false });
  
  // Create themes directories
  for (const theme of ['dark', 'light']) {
    const themeDir = path.join(screenshotsDir, theme);
    ensureDirectoryExists(themeDir);
  }
  
  // Start with dark mode
  let context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'dark',
  });
  
  let page = await context.newPage();
  
  try {
    // Load the pipeline page
    await page.goto('http://localhost:3001/pipeline', { waitUntil: 'networkidle' });
    console.log('Loaded pipeline page in dark mode');
    
    // 1. Capture the main pipeline dropdown menu
    console.log('Looking for pipeline dropdown menu...');
    
    // Try different selectors for the pipeline dropdown
    const pipelineDropdownSelectors = [
      'button:has-text("Pipeline")', 
      'div[role="combobox"]',
      '.pipeline-selector',
      'button:has-text("Main Pipeline")',
      'button.dropdown-toggle'
    ];
    
    let pipelineDropdown = null;
    for (const selector of pipelineDropdownSelectors) {
      console.log(`  Trying selector: ${selector}`);
      const element = await page.$(selector);
      if (element && await element.isVisible()) {
        pipelineDropdown = element;
        console.log(`  Found pipeline dropdown with selector: ${selector}`);
        break;
      }
    }
    
    if (pipelineDropdown) {
      // Click to open dropdown
      await pipelineDropdown.click();
      await delay(1000);
      
      // Capture open dropdown
      await safeScreenshot(page, path.join(screenshotsDir, 'dark', 'pipeline-dropdown-open.png'));
      
      // Close dropdown
      await page.mouse.click(10, 10);
      await delay(500);
    } else {
      console.log('  Pipeline dropdown not found');
    }
    
    // 2. Capture the edit icon popup
    console.log('Looking for edit icon...');
    
    const editIconSelectors = [
      'button[aria-label="Edit"]',
      'button:has-text("Edit")',
      'svg[data-icon="edit"]',
      'button:has(svg[data-icon="edit"])',
      'button:has(svg[data-icon="pencil"])',
      'button.edit-button',
      'button.edit-icon'
    ];
    
    let editIcon = null;
    for (const selector of editIconSelectors) {
      console.log(`  Trying selector: ${selector}`);
      const elements = await page.$$(selector);
      for (const element of elements) {
        if (await element.isVisible()) {
          editIcon = element;
          console.log(`  Found edit icon with selector: ${selector}`);
          break;
        }
      }
      if (editIcon) break;
    }
    
    if (editIcon) {
      // Click edit icon
      await editIcon.click();
      await delay(1000);
      
      // Capture the modal
      await safeScreenshot(page, path.join(screenshotsDir, 'dark', 'pipeline-edit-modal.png'));
      
      // Close modal (try escape key first)
      await page.keyboard.press('Escape');
      await delay(500);
    } else {
      console.log('  Edit icon not found');
    }
    
    // 3. Capture the theme toggle and its effect
    console.log('Looking for theme toggle...');
    
    const themeToggleSelectors = [
      'button[aria-label="Toggle theme"]',
      'button:has-text("Theme")',
      'button.theme-toggle',
      'button[aria-label="Dark mode"]',
      'button[aria-label="Light mode"]',
      'button:has(svg[data-icon="sun"])',
      'button:has(svg[data-icon="moon"])'
    ];
    
    let themeToggle = null;
    for (const selector of themeToggleSelectors) {
      console.log(`  Trying selector: ${selector}`);
      const element = await page.$(selector);
      if (element && await element.isVisible()) {
        themeToggle = element;
        console.log(`  Found theme toggle with selector: ${selector}`);
        break;
      }
    }
    
    if (themeToggle) {
      // Click theme toggle to switch to light mode
      await themeToggle.click();
      await delay(1500); // Wait longer for theme transition
      
      // Capture light mode page
      await safeScreenshot(page, path.join(screenshotsDir, 'light', 'pipeline-full-light.png'), true);
    } else {
      console.log('  Theme toggle not found');
    }
    
    // 4. Capture view mode change
    console.log('Looking for view mode toggle...');
    
    const viewModeSelectors = [
      'button[aria-label="Toggle view"]',
      'button:has-text("View")',
      'button.view-toggle',
      'button:has-text("List")',
      'button:has-text("Kanban")',
      'button:has-text("Board")',
      'button:has-text("Table")'
    ];
    
    let viewModeToggle = null;
    for (const selector of viewModeSelectors) {
      console.log(`  Trying selector: ${selector}`);
      const element = await page.$(selector);
      if (element && await element.isVisible()) {
        viewModeToggle = element;
        console.log(`  Found view mode toggle with selector: ${selector}`);
        break;
      }
    }
    
    if (viewModeToggle) {
      // Click to change view
      await viewModeToggle.click();
      await delay(1000);
      
      // Capture list/table view in light mode
      await safeScreenshot(page, path.join(screenshotsDir, 'light', 'pipeline-list-view.png'), true);
      
      // Click again to go back to board view
      await viewModeToggle.click();
      await delay(1000);
    } else {
      console.log('  View mode toggle not found');
    }
    
    // Close the context and browser
    await context.close();
    await browser.close();
    
    console.log('Specific interactions capture complete');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    await browser.close();
  }
})(); 