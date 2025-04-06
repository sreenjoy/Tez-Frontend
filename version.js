/**
 * Tez Frontend Version Information
 * 
 * This file is used to track version information across all Tez repositories.
 * It serves as the single source of truth for version numbers and is used
 * by the integration process to ensure consistent versioning.
 * 
 * When updating versions:
 * 1. Update the version number here
 * 2. The git hook will automatically sync it to package.json
 * 3. The integration process will propagate it to feature repositories
 */

module.exports = {
  // Main version of the Tez Frontend application
  version: '0.1.0',
  
  // Last updated timestamp
  lastUpdated: new Date().toISOString(),
  
  // Feature versions - used to track compatibility between features
  features: {
    core: '0.1.0',
    dashboard: '0.1.0',
    pipeline: '0.1.0',
    deal: '0.1.0',
    'ai-assistant': '0.1.0'
  },
  
  // Minimum compatible versions of dependencies
  dependencies: {
    node: '18.0.0',
    npm: '8.0.0'
  },
  
  // Check if a feature version is compatible
  isCompatible: function(feature, version) {
    if (!this.features[feature]) {
      return false;
    }
    
    const [thisMajor, thisMinor] = this.features[feature].split('.').map(Number);
    const [otherMajor, otherMinor] = version.split('.').map(Number);
    
    // Major version must match exactly
    if (thisMajor !== otherMajor) {
      return false;
    }
    
    // Feature version cannot be ahead of main version
    return otherMinor <= thisMinor;
  }
}; 