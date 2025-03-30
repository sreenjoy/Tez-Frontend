# Pipeline Page

## Overview

The Pipeline page provides a visual interface for managing sales deals through different stages of the sales process. It features draggable cards that can be moved between columns, representing different stages in the pipeline.

## Features

### Deal Management
- Draggable deal cards for easy status updates
- Visual representation of deals by pipeline stage
- Quick access to deal details
- Deal filtering and sorting

### Interface Controls
- Collapsible sidebar for maximizing workspace
- Responsive layout that adapts to screen size
- Dark/Light mode support

## Components

### Full Pipeline View
![Full Pipeline](/documentation/screenshots/pipeline/pipeline-full.png)

The main pipeline view shows all deals organized by their current stage, with drag-and-drop functionality for moving deals through the pipeline.

### Collapsible Sidebar
![Sidebar Collapsed](/documentation/screenshots/pipeline/pipeline-sidebar-collapsed.png)

The sidebar can be collapsed to provide more screen space for the pipeline view, particularly useful on smaller screens.

### Deal Card Dragging
![Card Dragging](/documentation/screenshots/pipeline/pipeline-card-dragging.png)

Deal cards can be dragged between pipeline stages to update their status with a simple drag-and-drop interaction.

### Header
![Header](/documentation/screenshots/pipeline/pipeline-header-1.png)

The application header provides navigation controls and quick access to common functions.

### Main Content Area
![Main Content](/documentation/screenshots/pipeline/pipeline-main-content-1.png)

The main content area displays the pipeline columns and deal cards in an organized, visual layout.

## Interactions

- Drag-and-drop deals between pipeline stages
- Collapse/expand sidebar for different workspace views
- Filter and sort deals based on various criteria
- Access detailed information for each deal

## Technical Implementation

- Built with Next.js 14
- Drag-and-drop functionality using @hello-pangea/dnd
- Responsive design with Tailwind CSS
- Dynamic theming with next-themes 