#!/bin/bash

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Check if the server is running
if ! curl -s http://localhost:3001 > /dev/null; then
  echo "❌ Error: The development server is not running on port 3001."
  echo "Please start the server with 'npm run dev' first."
  exit 1
fi

# Create directories if they don't exist
mkdir -p documentation/screenshots

# Run the screenshot generator
echo "🖼️  Generating screenshots..."
node screenshot-generator.js

echo "✅ Documentation screenshots generated!"
echo "📂 Screenshots are saved in documentation/screenshots/"
echo "📝 Documentation can be found in documentation/" 