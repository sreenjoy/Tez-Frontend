# Contributing to Tez Documentation

Thank you for your interest in improving the Tez documentation! This guide explains how to contribute to our documentation and maintain its quality and consistency.

## Documentation Structure

The Tez documentation is organized as follows:

- `README.md` - Overview and navigation for all documentation
- `pages/` - Individual page documentation
  - `dashboard.md` - Dashboard page documentation
  - `pipeline.md` - Pipeline page documentation
  - `deal.md` - Deal page documentation
  - `ai-assistant.md` - AI Assistant page documentation
  - `auth.md` - Authentication page documentation
  - `tasks.md` - Tasks page documentation
  - `inbox.md` - Inbox page documentation
- `api-reference.md` - API endpoint documentation
- `screenshots/` - Directory containing UI screenshots

## Documentation Standards

When contributing to the documentation, please follow these standards:

### File Organization

- Create new documentation in the appropriate directory
- Use kebab-case for filenames (e.g., `user-guide.md`)
- Include a clear title as the first heading in each file
- Organize content with a logical hierarchy of headings

### Content Guidelines

- **Clarity**: Write in clear, concise language that is easy to understand
- **Completeness**: Cover all important aspects of the feature or functionality
- **Consistency**: Maintain consistent terminology and formatting
- **Accuracy**: Ensure all information is accurate and up-to-date
- **User Focus**: Write from the user's perspective, focusing on tasks and goals

### Formatting

- Use Markdown for all documentation
- Follow heading hierarchy (# for main title, ## for sections, ### for subsections)
- Use bullet points for lists of items
- Use numbered lists for sequential steps or instructions
- Use code blocks with appropriate language syntax highlighting
- Include descriptive alt text for all images

Example:

```markdown
# Feature Title

## Overview

Brief description of the feature.

## Components

- Component 1: Description
- Component 2: Description

## Usage Guide

1. First step
2. Second step
3. Third step

## Code Example

```javascript
// Example code with proper syntax highlighting
const example = "code";
```
```

### Screenshots

- Place screenshots in the `screenshots/` directory
- Organize screenshots in subdirectories by feature (e.g., `screenshots/dashboard/`)
- Use descriptive filenames (e.g., `pipeline-stage-drag.png`)
- Crop screenshots to focus on the relevant UI element
- Use annotations where helpful to highlight specific elements
- Ensure screenshots are up-to-date with the current UI
- Optimize images for web viewing (compress when possible)

## Contribution Process

### For Minor Changes

1. Fork the repository
2. Make your changes
3. Submit a pull request with a clear description of the changes

### For Major Changes

1. Open an issue describing the proposed changes
2. Discuss the approach with the team
3. Fork the repository
4. Create a new branch for your changes
5. Make your changes
6. Submit a pull request referencing the original issue

### Pull Request Guidelines

- Keep changes focused and atomic
- Include a clear description of what was changed and why
- Reference any related issues
- Update the table of contents or navigation if necessary
- Ensure documentation builds correctly if using a documentation generator

## Documentation Testing

Before submitting your changes:

1. Check all links to ensure they work correctly
2. Verify that all code examples are correct and functional
3. Proofread for spelling and grammatical errors
4. Test the documentation with different screen sizes to ensure readability
5. If applicable, test any interactive elements

## Style Guide

### Voice and Tone

- Use active voice rather than passive voice
- Write in a conversational, friendly tone
- Be direct and straightforward
- Avoid jargon unless necessary and defined
- Use second person ("you") to address the reader

### Terminology

- Use consistent terminology throughout the documentation
- Capitalize product names and features as appropriate
- Define abbreviations and technical terms when first used

### Common Terms Reference

| Term | Definition |
|------|------------|
| Pipeline | A sequence of stages representing a sales process |
| Deal | A sales opportunity tracked through the pipeline |
| Stage | A specific phase within a pipeline |
| KPI | Key Performance Indicator |
| RAG | Retrieval Augmented Generation for AI |

## Getting Help

If you have questions about contributing to the documentation:

- Open an issue with the "documentation" label
- Reach out to the documentation team
- Join the #documentation channel in our community chat

Thank you for helping improve the Tez documentation! 