/**
 * Tez Feature Integration Script
 * 
 * This script integrates code from multiple feature repositories into the main Tez-Frontend repository.
 * It clones or updates feature repositories, then copies their components and pages into the main codebase.
 * 
 * Usage: node scripts/integrate-features.js [--feature feature-name]
 * Options:
 *   --feature feature-name  Only integrate a specific feature
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
let specificFeature = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--feature' && args[i + 1]) {
    specificFeature = args[i + 1];
    break;
  }
}

// Configuration
const config = {
  // Directory for temporarily cloning repositories
  tmpDir: path.join(__dirname, '..', 'tmp-features'),
  
  // Target directories in the main repository
  targetDirs: {
    components: path.join(__dirname, '..', 'src/components'),
    pages: path.join(__dirname, '..', 'src/app'),
    styles: path.join(__dirname, '..', 'src/styles'),
    utils: path.join(__dirname, '..', 'src/utils'),
    constants: path.join(__dirname, '..', 'src/constants'),
    hooks: path.join(__dirname, '..', 'src/hooks'),
  },
  
  // Feature repositories to integrate
  features: [
    { 
      name: 'dashboard', 
      repo: 'https://github.com/yourusername/Tez-Dashboard.git',
      branch: 'main',
      paths: {
        components: 'src/components/dashboard',
        pages: 'src/app/dashboard',
        styles: 'src/styles/dashboard',
        utils: 'src/utils/dashboard',
        hooks: 'src/hooks/dashboard',
      }
    },
    { 
      name: 'pipeline', 
      repo: 'https://github.com/yourusername/Tez-Pipeline.git',
      branch: 'main',
      paths: {
        components: 'src/components/pipeline',
        pages: 'src/app/pipeline',
        styles: 'src/styles/pipeline',
        utils: 'src/utils/pipeline',
        hooks: 'src/hooks/pipeline',
      }
    },
    { 
      name: 'ai-assistant', 
      repo: 'https://github.com/yourusername/Tez-AI-Assistant.git',
      branch: 'main',
      paths: {
        components: 'src/components/ai-assistant',
        pages: 'src/app/ai-assistant',
        styles: 'src/styles/ai-assistant',
        utils: 'src/utils/ai-assistant',
        hooks: 'src/hooks/ai-assistant',
      }
    },
    { 
      name: 'deal', 
      repo: 'https://github.com/yourusername/Tez-Deal.git',
      branch: 'main',
      paths: {
        components: 'src/components/deal',
        pages: 'src/app/deal',
        styles: 'src/styles/deal',
        utils: 'src/utils/deal',
        hooks: 'src/hooks/deal',
      }
    }
  ]
};

// Filter features if a specific one was requested
if (specificFeature) {
  const feature = config.features.find(f => f.name === specificFeature);
  if (feature) {
    config.features = [feature];
    console.log(`Only integrating feature: ${specificFeature}`);
  } else {
    console.error(`Error: Feature '${specificFeature}' not found in configuration.`);
    process.exit(1);
  }
}

// Ensure temporary directory exists
if (!fs.existsSync(config.tmpDir)) {
  fs.mkdirSync(config.tmpDir, { recursive: true });
}

// Ensure all target directories exist
Object.values(config.targetDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Executes a shell command and returns the output
 * @param {string} command - The command to execute
 * @param {Object} options - Options for child_process.execSync
 * @returns {string} - Command output
 */
function exec(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
  } catch (error) {
    if (options.ignoreError) {
      return '';
    }
    throw error;
  }
}

/**
 * Copies a directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory doesn't exist: ${src}`);
    return;
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  try {
    exec(`cp -r ${src}/* ${dest}/`, { ignoreError: true });
    console.log(`Copied: ${src} -> ${dest}`);
  } catch (error) {
    console.error(`Error copying directory: ${error.message}`);
  }
}

/**
 * Processes a feature repository
 * @param {Object} feature - Feature configuration
 */
function processFeature(feature) {
  console.log(`\n==== Processing Feature: ${feature.name} ====`);
  
  const featureTmpDir = path.join(config.tmpDir, feature.name);
  
  // Clone or update the repository
  if (!fs.existsSync(featureTmpDir)) {
    console.log(`Cloning ${feature.repo}...`);
    exec(`git clone --branch ${feature.branch || 'main'} ${feature.repo} ${featureTmpDir}`);
  } else {
    console.log(`Updating ${feature.name}...`);
    exec(`cd ${featureTmpDir} && git pull origin ${feature.branch || 'main'}`);
  }
  
  // Get the current commit hash for tracking
  const commitHash = exec(`cd ${featureTmpDir} && git rev-parse HEAD`, { silent: true }).trim();
  console.log(`Current commit: ${commitHash}`);
  
  // Copy directories based on the paths configuration
  Object.entries(feature.paths).forEach(([key, srcPath]) => {
    const targetDir = config.targetDirs[key];
    if (!targetDir) {
      return; // Skip if no target directory is configured
    }
    
    const sourcePath = path.join(featureTmpDir, srcPath);
    const destPath = path.join(targetDir, feature.name);
    
    // If sourcePath is a specific file, handle it separately
    if (srcPath.includes('.') && fs.existsSync(path.join(featureTmpDir, srcPath))) {
      const fileName = path.basename(srcPath);
      const destDir = path.dirname(destPath);
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.copyFileSync(sourcePath, path.join(destDir, fileName));
      console.log(`Copied file: ${sourcePath} -> ${path.join(destDir, fileName)}`);
    } else {
      copyDir(sourcePath, destPath);
    }
  });
  
  // Create an integration record
  const integrationRecord = {
    feature: feature.name,
    repository: feature.repo,
    branch: feature.branch || 'main',
    commitHash: commitHash,
    integratedAt: new Date().toISOString()
  };
  
  const recordsDir = path.join(__dirname, '..', '.integration-records');
  if (!fs.existsSync(recordsDir)) {
    fs.mkdirSync(recordsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(recordsDir, `${feature.name}.json`),
    JSON.stringify(integrationRecord, null, 2)
  );
  
  console.log(`Integration record created for ${feature.name}`);
}

/**
 * Main execution function
 */
function main() {
  console.log('=== Starting Tez Feature Integration ===');
  console.log(`Temporary directory: ${config.tmpDir}`);
  console.log(`Features to integrate: ${config.features.map(f => f.name).join(', ')}`);
  
  // Process each feature
  config.features.forEach(processFeature);
  
  // Generate integration report
  const recordsDir = path.join(__dirname, '..', '.integration-records');
  if (fs.existsSync(recordsDir)) {
    const records = fs.readdirSync(recordsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const content = fs.readFileSync(path.join(recordsDir, file), 'utf8');
        return JSON.parse(content);
      });
    
    // Sort records by integration time (newest first)
    records.sort((a, b) => new Date(b.integratedAt) - new Date(a.integratedAt));
    
    // Generate report
    const reportPath = path.join(__dirname, '..', 'integration-report.md');
    const reportContent = generateReport(records);
    fs.writeFileSync(reportPath, reportContent);
    
    console.log(`\nIntegration report generated: ${reportPath}`);
  }
  
  console.log('\n=== Feature Integration Complete ===');
  console.log('You can now run the application to see all features integrated.');
}

/**
 * Generates a markdown report of integrations
 * @param {Array} records - Integration records
 * @returns {string} - Markdown report content
 */
function generateReport(records) {
  const now = new Date().toISOString().split('T')[0];
  
  let report = `# Tez Feature Integration Report\n\n`;
  report += `Generated: ${now}\n\n`;
  report += `## Integrated Features\n\n`;
  
  if (records.length === 0) {
    report += 'No features have been integrated yet.\n';
  } else {
    report += '| Feature | Repository | Branch | Commit | Integrated At |\n';
    report += '|---------|------------|--------|--------|---------------|\n';
    
    records.forEach(record => {
      const shortCommit = record.commitHash.substr(0, 7);
      const date = new Date(record.integratedAt).toLocaleString();
      
      report += `| ${record.feature} | ${record.repository} | ${record.branch} | \`${shortCommit}\` | ${date} |\n`;
    });
  }
  
  return report;
}

// Execute the main function
main(); 