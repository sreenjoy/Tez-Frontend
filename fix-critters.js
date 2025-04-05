// Script to fix the "Cannot find module 'critters'" error
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking for critters package...');

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('package.json not found!');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check if critters is in dependencies or devDependencies
const hasCritters = (packageJson.dependencies && packageJson.dependencies.critters) || 
                    (packageJson.devDependencies && packageJson.devDependencies.critters);

if (!hasCritters) {
  console.log('Critters package not found in dependencies. Installing...');
  
  try {
    // Install critters
    execSync('npm install --save-dev critters', { stdio: 'inherit' });
    console.log('Successfully installed critters package.');
    
    // Update package.json to include critters in devDependencies
    const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!updatedPackageJson.devDependencies.critters) {
      console.error('Failed to add critters to package.json devDependencies.');
    } else {
      console.log('Verified critters is now in package.json devDependencies.');
    }
  } catch (error) {
    console.error('Failed to install critters:', error.message);
    process.exit(1);
  }
} else {
  console.log('Critters package already installed.');
}

console.log('Checking Next.js configuration...');

// Ensure next.config.js has optimizeCss enabled
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (!fs.existsSync(nextConfigPath)) {
  console.warn('next.config.js not found. Creating a new one with optimizeCss enabled.');
  
  const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig;
`;
  
  fs.writeFileSync(nextConfigPath, nextConfigContent);
  console.log('Created next.config.js with optimizeCss enabled.');
} else {
  let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Check if optimizeCss is already enabled
  if (!nextConfigContent.includes('optimizeCss: true')) {
    console.log('Enabling optimizeCss in next.config.js...');
    
    // Simple approach to add optimizeCss to experimental section
    if (nextConfigContent.includes('experimental: {')) {
      // Add to existing experimental section
      nextConfigContent = nextConfigContent.replace(
        /experimental: \{/,
        'experimental: {\n    optimizeCss: true,'
      );
    } else if (nextConfigContent.includes('const nextConfig = {')) {
      // Add new experimental section
      nextConfigContent = nextConfigContent.replace(
        /const nextConfig = \{/,
        'const nextConfig = {\n  experimental: {\n    optimizeCss: true,\n  },'
      );
    } else {
      console.warn('Could not automatically update next.config.js. Please add optimizeCss manually.');
    }
    
    fs.writeFileSync(nextConfigPath, nextConfigContent);
    console.log('Updated next.config.js with optimizeCss enabled.');
  } else {
    console.log('optimizeCss is already enabled in next.config.js.');
  }
}

console.log('\nFixes applied. Please restart your Next.js development server.'); 