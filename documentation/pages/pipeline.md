# Pipeline Page Documentation

## Overview

The Pipeline page is a critical component of the Tez Frontend, providing a kanban-style view for managing deals through various stages of the sales process. This interface allows users to visualize their sales pipeline, organize deals by stage, and efficiently track progress toward closing.

## Key Components

### Pipeline Header

The header section contains essential navigation and filtering tools:

- **Pipeline Selector**: Dropdown menu to switch between different pipeline configurations (e.g., Main Pipeline, Enterprise Deals, Small Business)
- **View Toggle**: Switch between Kanban view (default) and List view for different visualization options
- **Filter Controls**: UI elements to filter deals by various criteria including:
  - Priority (High, Medium, Low)
  - Deal Owner
  - Value Range
  - Last Updated Time
- **Search Bar**: Real-time search functionality to quickly find specific deals
- **Add Deal Button**: Button to create a new deal directly from the pipeline view

### Pipeline Columns

The main pipeline view consists of multiple columns representing sales stages, such as:

1. **Lead**: Initial contact or prospect identification
2. **Qualified**: Prospects that match your ideal customer profile
3. **Meeting Scheduled**: Deals with upcoming meetings or calls
4. **Proposal Sent**: Deals where a proposal or quote has been sent
5. **Negotiation**: Active price or terms negotiations
6. **Closed Won**: Successfully closed deals
7. **Closed Lost**: Deals that didn't convert

Each column displays:
- Stage name
- Count of deals in that stage
- Total value of deals in that stage
- Color-coded indicators for stage performance

### Deal Cards

Individual deal cards appear within pipeline columns and contain:

- **Deal Name**: The name or title of the deal
- **Company**: Associated company or organization
- **Value**: Monetary value of the deal
- **Priority Indicator**: Visual indicator (High/Medium/Low)
- **Owner**: Team member responsible for the deal
- **Last Activity**: Timestamp of most recent activity
- **Deal Age**: Time since deal creation
- **Progress Indicator**: Visual representation of deal progress

Deal cards support drag-and-drop functionality, allowing users to move deals between stages by dragging them to the appropriate column.

### Edit Pipeline Modal

An admin modal interface for customizing the pipeline, including:

- **Pipeline Name Editing**: Change the name of the current pipeline
- **Stage Management**: Add, remove, or reorder pipeline stages
- **Stage Color Customization**: Assign colors to different stages
- **Stage Properties**: Configure properties like probability percentages
- **Archive/Delete Options**: Controls for archiving or deleting pipelines

## Usage Guide

1. **Pipeline Navigation**:
   - Use the dropdown to switch between different pipelines
   - Toggle between Kanban and List views based on your preference
   - Use filters to focus on specific deal segments

2. **Deal Management**:
   - Create new deals using the "Add Deal" button
   - Move deals through stages by dragging and dropping cards
   - Click on a deal card to view or edit detailed information

3. **Pipeline Customization**:
   - Edit pipeline stages via the "Edit Pipeline" button
   - Customize stage names, colors, and order to match your sales process
   - Add new stages as your process evolves

4. **Performance Analysis**:
   - Monitor deals per stage to identify bottlenecks
   - Track stage transition times to optimize your sales cycle
   - Use column totals to assess projected revenue by stage

5. **Team Collaboration**:
   - Easily view which team member owns each deal
   - Monitor recent activities to stay informed of progress
   - Use the pipeline as a visual aid during team meetings

## Technical Implementation

The Pipeline page leverages several key technologies:

- **React Beautiful DND** (@hello-pangea/dnd): For smooth drag-and-drop functionality between columns
- **Context API**: To manage and share pipeline state across components
- **Tailwind CSS**: For responsive and consistent styling across devices
- **Custom Hooks**: For optimized state management and API interactions

The page communicates with backend services to:
- Fetch pipeline configurations and deal data
- Update deal stages when cards are moved
- Create new deals and modify existing ones
- Apply filters and search criteria to the displayed deals

## Best Practices

- Regularly update deal stages to maintain accurate pipeline visibility
- Use filters to focus on specific segments when managing large numbers of deals
- Review pipeline analytics to identify bottlenecks in your sales process
- Customize pipeline stages to match your organization's specific sales methodology
- Train team members on consistent use of the pipeline to ensure data integrity
- Conduct regular pipeline reviews to keep data clean and actionable 