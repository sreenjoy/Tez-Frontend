# Tez Frontend Documentation Guide

This guide explains how to generate comprehensive documentation for the Tez Frontend application.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- A running instance of the Tez Frontend application

## Documentation Scripts

The following scripts are available for documentation generation:

- `generate-docs.sh` - Main script to generate all documentation
- `fix-critters.js` - Fixes CSS optimization issues
- `capture-all-pages.js` - Captures screenshots and generates page documentation
- `generate-full-documentation.js` - Coordinates the entire documentation process

## Generating Documentation

### Method 1: Using the Shell Script (Recommended)

1. Make sure the shell script is executable:
   ```bash
   chmod +x generate-docs.sh
   ```

2. Run the script:
   ```bash
   ./generate-docs.sh
   ```

3. The script will:
   - Install required dependencies
   - Fix any CSS optimization issues
   - Generate screenshots of all pages
   - Create individual page documentation
   - Create a combined documentation file

### Method 2: Manual Process

1. Install required dependencies:
   ```bash
   npm install --save-dev puppeteer critters
   ```

2. Fix CSS optimization issues:
   ```bash
   node fix-critters.js
   ```

3. Ensure the development server is running:
   ```bash
   npm run dev
   ```

4. Generate documentation:
   ```bash
   node generate-full-documentation.js
   ```

## Documentation Output

The documentation process generates the following output:

- `documentation/pages/*.md` - Individual page documentation
- `documentation/screenshots/*/` - Screenshots of each page and its components
- `documentation/COMPLETE-DOCUMENTATION.md` - Combined documentation for all pages

## Included Pages

The documentation covers the following pages:

1. Dashboard (`/dashboard`)
2. Pipeline (`/pipeline`)
3. Deal Details (`/deal/[id]`)
4. AI Assistant (`/ai-assistant`)
5. Authentication (`/auth`)
6. Organization Info (`/organization-info`)
7. Chat Sync (`/chat-sync`)

## Customizing Documentation

To customize the documentation or add new pages:

1. Edit `capture-all-pages.js` and add the new page to the `pages` array
2. Define page-specific elements to capture in the `pageElements` object
3. Add a description for the new page in the `getPageDescription` function
4. Add usage documentation in the `getUsageGuide` function
5. Run the documentation generation script again

## Troubleshooting

### Common Issues

1. **CSS Optimization Error**: If you see errors about 'critters' not being found, run:
   ```bash
   node fix-critters.js
   ```

2. **Development Server Not Running**: Ensure the application is running at http://localhost:3010 or update the `BASE_URL` in `capture-all-pages.js`.

3. **Element Not Found Errors**: If the script can't find specific page elements, check that the selectors in `pageElements` match your current application structure.

### Getting Help

If you encounter issues with the documentation generation, please check:
- The selectors in `capture-all-pages.js` match your current application structure
- The development server is running and accessible
- All required dependencies are installed

## Contributing to Documentation

To improve the documentation:

1. Edit the individual page documentation in `documentation/pages/`
2. Update the screenshot capture selectors in `capture-all-pages.js`
3. Add more detailed usage guides in the `getUsageGuide` function 