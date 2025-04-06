#!/usr/bin/env node

/**
 * Feature Compatibility Test Script
 * 
 * This script tests if features from different repositories work together by:
 * 1. Setting up a temporary test environment
 * 2. Pulling feature repositories
 * 3. Integrating features into a test application
 * 4. Running integration tests
 * 5. Generating a compatibility report
 * 
 * Usage:
 *   node test-compatibility.js [--features=feature1,feature2] [--verbose]
 * 
 * Example:
 *   node test-compatibility.js --features=pipeline,ai-assistant --verbose
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { EOL } = require('os');

// Parse arguments
const args = process.argv.slice(2);
const options = {
  features: [],
  verbose: false,
  clean: false
};

args.forEach(arg => {
  if (arg.startsWith('--features=')) {
    options.features = arg.replace('--features=', '').split(',');
  } else if (arg === '--verbose') {
    options.verbose = true;
  } else if (arg === '--clean') {
    options.clean = true;
  }
});

// Configuration
const config = {
  testDir: path.join(__dirname, '..', 'test-compatibility'),
  repos: {
    main: {
      name: 'Tez-Frontend',
      url: 'https://github.com/yourusername/Tez-Frontend.git',
      branch: 'main'
    },
    features: [
      {
        name: 'pipeline',
        url: 'https://github.com/yourusername/Tez-Pipeline.git',
        branch: 'main',
        components: ['PipelineBoard', 'PipelineCard', 'PipelineHeader'],
        pages: ['pipeline'],
        tests: ['pipeline-integration.test.js']
      },
      {
        name: 'dashboard',
        url: 'https://github.com/yourusername/Tez-Dashboard.git',
        branch: 'main',
        components: ['DashboardMetrics', 'DashboardCharts', 'DashboardHeader'],
        pages: ['dashboard'],
        tests: ['dashboard-integration.test.js']
      },
      {
        name: 'ai-assistant',
        url: 'https://github.com/yourusername/Tez-AI-Assistant.git',
        branch: 'main',
        components: ['AITraining', 'QATesting', 'DataManagement'],
        pages: ['ai-assistant'],
        tests: ['ai-assistant-integration.test.js']
      },
      {
        name: 'deal',
        url: 'https://github.com/yourusername/Tez-Deal.git',
        branch: 'main',
        components: ['DealHeader', 'DealTimeline', 'DealInfo'],
        pages: ['deal/[id]'],
        tests: ['deal-integration.test.js']
      }
    ]
  },
  testCommands: [
    'npm run lint',
    'npm run test:integration',
    'npm run build'
  ]
};

// Filter features if specific ones are requested
if (options.features.length > 0) {
  config.repos.features = config.repos.features.filter(
    feature => options.features.includes(feature.name)
  );
}

// Utility functions
function log(message, isVerbose = false) {
  if (!isVerbose || options.verbose) {
    console.log(message);
  }
}

function exec(command, cwd = process.cwd()) {
  try {
    log(`Running: ${command}`, true);
    return execSync(command, { 
      cwd, 
      stdio: options.verbose ? 'inherit' : 'pipe',
      encoding: 'utf8'
    });
  } catch (error) {
    log(`Error executing: ${command}`, false);
    log(error.message, false);
    if (error.stdout) log(error.stdout, true);
    if (error.stderr) log(error.stderr, true);
    throw new Error(`Command failed: ${command}`);
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`, true);
  }
}

function cleanup() {
  if (options.clean && fs.existsSync(config.testDir)) {
    fs.rmSync(config.testDir, { recursive: true, force: true });
    log(`Cleaned up directory: ${config.testDir}`);
  }
}

// Main functions
function setupTestEnvironment() {
  log('Setting up test environment...');
  ensureDir(config.testDir);
  
  // Clone or update main repository
  const mainRepoDir = path.join(config.testDir, config.repos.main.name);
  if (!fs.existsSync(mainRepoDir)) {
    log(`Cloning main repository: ${config.repos.main.name}...`);
    exec(`git clone ${config.repos.main.url} ${mainRepoDir}`);
  } else {
    log(`Updating main repository: ${config.repos.main.name}...`, true);
    exec(`git fetch origin && git reset --hard origin/${config.repos.main.branch}`, mainRepoDir);
  }
  
  // Install dependencies in main repo
  log('Installing dependencies in main repository...', true);
  exec('npm ci', mainRepoDir);
  
  return mainRepoDir;
}

function fetchFeatureRepositories() {
  log('Fetching feature repositories...');
  const features = [];
  
  for (const feature of config.repos.features) {
    log(`Fetching feature: ${feature.name}...`);
    const featureDir = path.join(config.testDir, feature.name);
    
    if (!fs.existsSync(featureDir)) {
      log(`Cloning feature repository: ${feature.name}...`);
      exec(`git clone ${feature.url} ${featureDir}`);
    } else {
      log(`Updating feature repository: ${feature.name}...`, true);
      exec(`git fetch origin && git reset --hard origin/${feature.branch}`, featureDir);
    }
    
    // Get latest commit info
    const commitHash = exec('git rev-parse HEAD', featureDir).trim();
    const commitDate = exec('git show -s --format=%ci', featureDir).trim();
    const commitMessage = exec('git show -s --format=%s', featureDir).trim();
    
    features.push({
      ...feature,
      dir: featureDir,
      commit: {
        hash: commitHash,
        date: commitDate,
        message: commitMessage
      }
    });
    
    // Install dependencies in feature repo
    log(`Installing dependencies in ${feature.name}...`, true);
    exec('npm ci', featureDir);
  }
  
  return features;
}

function integrateFeatures(mainRepoDir, features) {
  log('Integrating features into test environment...');
  
  for (const feature of features) {
    log(`Integrating feature: ${feature.name}...`);
    
    // Copy components
    if (feature.components && feature.components.length > 0) {
      for (const component of feature.components) {
        const sourceComponentDir = path.join(feature.dir, 'components', component);
        const targetComponentDir = path.join(mainRepoDir, 'components', component);
        
        if (fs.existsSync(sourceComponentDir)) {
          ensureDir(path.dirname(targetComponentDir));
          exec(`cp -r "${sourceComponentDir}" "${targetComponentDir}"`);
          log(`Copied component: ${component}`, true);
        } else {
          log(`Warning: Component not found: ${component}`, false);
        }
      }
    }
    
    // Copy pages
    if (feature.pages && feature.pages.length > 0) {
      for (const page of feature.pages) {
        const sourcePage = path.join(feature.dir, 'pages', page);
        const targetPage = path.join(mainRepoDir, 'pages', page);
        
        if (fs.existsSync(sourcePage)) {
          ensureDir(path.dirname(targetPage));
          exec(`cp -r "${sourcePage}" "${targetPage}"`);
          log(`Copied page: ${page}`, true);
        } else {
          log(`Warning: Page not found: ${page}`, false);
        }
      }
    }
    
    // Copy integration tests
    if (feature.tests && feature.tests.length > 0) {
      const targetTestDir = path.join(mainRepoDir, 'tests', 'integration');
      ensureDir(targetTestDir);
      
      for (const test of feature.tests) {
        const sourceTest = path.join(feature.dir, 'tests', 'integration', test);
        const targetTest = path.join(targetTestDir, test);
        
        if (fs.existsSync(sourceTest)) {
          exec(`cp "${sourceTest}" "${targetTest}"`);
          log(`Copied test: ${test}`, true);
        } else {
          log(`Warning: Test not found: ${test}`, false);
        }
      }
    }
  }
}

function runCompatibilityTests(mainRepoDir) {
  log('Running compatibility tests...');
  const results = {
    successful: [],
    failed: []
  };
  
  for (const command of config.testCommands) {
    log(`Running: ${command}`);
    try {
      exec(command, mainRepoDir);
      results.successful.push(command);
    } catch (error) {
      results.failed.push({
        command,
        error: error.message
      });
    }
  }
  
  return results;
}

function generateReport(features, testResults) {
  const reportPath = path.join(config.testDir, 'compatibility-report.md');
  
  // Create report content
  let report = `# Feature Compatibility Test Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  // Features included
  report += `## Features Tested\n\n`;
  features.forEach(feature => {
    report += `### ${feature.name}\n\n`;
    report += `- Repository: ${feature.url}\n`;
    report += `- Branch: ${feature.branch}\n`;
    report += `- Commit: ${feature.commit.hash}\n`;
    report += `- Date: ${feature.commit.date}\n`;
    report += `- Message: ${feature.commit.message}\n\n`;
  });
  
  // Test results
  report += `## Test Results\n\n`;
  
  if (testResults.successful.length > 0) {
    report += `### Successful Tests\n\n`;
    testResults.successful.forEach(command => {
      report += `- ✅ ${command}\n`;
    });
    report += `\n`;
  }
  
  if (testResults.failed.length > 0) {
    report += `### Failed Tests\n\n`;
    testResults.failed.forEach(fail => {
      report += `- ❌ ${fail.command}\n`;
      report += `  Error: ${fail.error}\n\n`;
    });
  }
  
  // Compatibility summary
  const totalTests = testResults.successful.length + testResults.failed.length;
  const successRate = Math.round((testResults.successful.length / totalTests) * 100);
  
  report += `## Compatibility Summary\n\n`;
  report += `- Total tests: ${totalTests}\n`;
  report += `- Successful: ${testResults.successful.length}\n`;
  report += `- Failed: ${testResults.failed.length}\n`;
  report += `- Success rate: ${successRate}%\n\n`;
  
  // Overall result
  if (testResults.failed.length === 0) {
    report += `**Result: ✅ COMPATIBLE** - All features are compatible and can be integrated.\n`;
  } else {
    report += `**Result: ⚠️ PARTIALLY COMPATIBLE** - Some tests failed, see details above.\n`;
  }
  
  // Write report to file
  fs.writeFileSync(reportPath, report);
  log(`Compatibility report generated: ${reportPath}`);
  
  // Return overall compatibility status
  return {
    compatible: testResults.failed.length === 0,
    reportPath,
    successRate
  };
}

// Main execution
function main() {
  try {
    cleanup();
    const mainRepoDir = setupTestEnvironment();
    const features = fetchFeatureRepositories();
    integrateFeatures(mainRepoDir, features);
    const testResults = runCompatibilityTests(mainRepoDir);
    const compatibilityStatus = generateReport(features, testResults);
    
    log('\n=================================');
    log(`Compatibility Test Results: ${compatibilityStatus.compatible ? '✅ PASS' : '⚠️ PARTIAL'}`);
    log(`Success Rate: ${compatibilityStatus.successRate}%`);
    log(`Report: ${compatibilityStatus.reportPath}`);
    log('=================================\n');
    
    // Output for CI environments
    if (process.env.CI) {
      console.log(`::set-output name=compatible::${compatibilityStatus.compatible}`);
      console.log(`::set-output name=success_rate::${compatibilityStatus.successRate}`);
      console.log(`::set-output name=report_path::${compatibilityStatus.reportPath}`);
    }
    
    return compatibilityStatus.compatible ? 0 : 1;
  } catch (error) {
    log(`Compatibility test failed: ${error.message}`);
    return 1;
  }
}

// Run the script
const exitCode = main();
if (exitCode !== 0) {
  process.exit(exitCode);
} 