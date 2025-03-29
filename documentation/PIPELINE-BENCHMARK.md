# Pipeline Page Benchmark

## Visual Reference
*[Place screenshots here of the pipeline page in both light and dark mode, including kanban and list views]*

**Light Mode - Kanban View:** 
*[Screenshot 1]*

**Dark Mode - Kanban View:** 
*[Screenshot 2]*

**Light Mode - List View:** 
*[Screenshot 3]*

**Dark Mode - List View:** 
*[Screenshot 4]*

## Performance Metrics
*[Record these metrics using Chrome DevTools Lighthouse]*

| Metric | Value | Notes |
|--------|-------|-------|
| First Contentful Paint | | |
| Time to Interactive | | |
| Speed Index | | |
| Total Bundle Size | | |
| JS Execution Time | | |

## Component Hierarchy
```
- PipelinePage
  |- AppLayout (shared)
  |- Header
     |- PipelineDropdown
     |- SearchComponent
     |- ViewToggle (Kanban/List)
     |- ActionButtons
     |- TeamMembers
     |- ThemeToggle
  |- TabsSection
     |- MainTabs
     |- PriorityDropdown
     |- ActivityDropdown
  |- KanbanView
     |- ColumnContainer
        |- Column (multiple)
           |- ColumnHeader
           |- CardContainer
              |- Card (multiple)
                 |- GroupLogo
                 |- Tags
                 |- Contact
                 |- Priority
                 |- Status
  |- ListView
     |- Table
        |- TableHeader
        |- TableBody
           |- TableRow (multiple)
              |- CompanyCell
              |- StageCell
              |- OwnerCell
              |- PriorityCell
              |- ValueCell
              |- StatusCell
  |- PipelineEditorModal
```

## Key UI Elements

### Header Section
- Pipeline selector dropdown
- Search input for deals
- View toggle between Kanban/List
- Team members avatars with tooltips
- Sync Chats button

### Tabs & Filters
- Main tabs (All, Unread, Unanswered, Follow up)
- Priority filter dropdown
- Activity filter dropdown
- Mentions filter
- General filter button

### Kanban Board
- Multiple columns for pipeline stages
- Draggable cards with company info
- Add card button in each column
- Visual indicators for card status
- Hover effects on cards and columns

### List View
- Sortable table columns
- Rows with company and deal info
- Status indicators
- Priority badges
- Value formatting
- Hover effects on rows

### Cards/Rows Content
- Company logo and name
- Tags with color coding
- Contact/owner info
- Priority indicator
- Deal value
- Status message or task count

## Functionality Checklist
- [ ] Drag and drop works in Kanban view
- [ ] View toggle switches between Kanban and List
- [ ] Filtering by tabs works correctly
- [ ] Search functionality works
- [ ] Card/row clicking opens details
- [ ] Pipeline selector changes active pipeline
- [ ] Team member tooltips show on hover
- [ ] Dark/light mode rendering is consistent
- [ ] Responsive on various screen sizes
- [ ] All hover effects work properly

## Current Implementation Notes
- Drag and drop using @hello-pangea/dnd library
- Complex state management for columns and cards
- Custom CSS for styling cards and columns
- Responsive design with scroll for overflow
- Custom tooltips for hover states
- Card and column formatting based on status

## Identified Issues/Optimization Opportunities
- *[List any issues or areas for improvement here]*
- Excessive re-renders during drag operations
- Large CSS file with some duplicate rules
- Inconsistent card sizing in some views
- Table rows could benefit from virtualization
- Search functionality triggers full re-render
- Some hover effects cause layout shifts
