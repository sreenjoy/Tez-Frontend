#!/bin/bash

# Color codes for output formatting
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Tez Frontend Documentation Generator =====${NC}"
echo -e "${YELLOW}This script will generate comprehensive documentation for all pages in the Tez Frontend application.${NC}"
echo

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js before continuing.${NC}"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install npm before continuing.${NC}"
    exit 1
fi

# Install required packages
echo -e "${YELLOW}Installing required packages...${NC}"
npm install --save-dev puppeteer
npm install --save-dev critters

# Fix the 'critters' error if it exists
echo -e "${YELLOW}Fixing potential CSS optimization issues...${NC}"
node fix-critters.js

# Run the documentation generator
echo -e "${YELLOW}Running documentation generator...${NC}"
node generate-full-documentation.js

echo
echo -e "${GREEN}===== Documentation Generation Complete =====${NC}"
echo -e "Documentation has been generated in the ${YELLOW}documentation/${NC} directory."
echo -e "You can view the complete documentation in ${YELLOW}documentation/COMPLETE-DOCUMENTATION.md${NC}"
echo -e "Individual page documentation can be found in ${YELLOW}documentation/pages/${NC}"
echo -e "Screenshots are available in ${YELLOW}documentation/screenshots/${NC}" 