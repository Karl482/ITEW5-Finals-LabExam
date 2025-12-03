# Sports Theme Styling Guide

## Overview
This document describes the sports-themed styling applied across the Sports PWA Task Manager application.

## Color Palette

### Primary Colors
- **Primary Blue** (`#0066CC`): Team spirit, main brand color
- **Victory Green** (`#00AA44`): Success, completed tasks
- **Championship Gold** (`#FFB700`): Highlights, active states
- **Referee Yellow** (`#FFC107`): Warnings, alerts
- **Red Card** (`#DC3545`): Errors, deletions, critical actions
- **Stadium Gray** (`#6C757D`): Secondary text, neutral elements

### Supporting Colors
- **White** (`#FFFFFF`): Backgrounds, text on dark
- **Light Gray** (`#F8F9FA`): Subtle backgrounds
- **Dark Gray** (`#343A40`): Primary text

## Typography

### Fonts
- **Headers**: Oswald (athletic, bold style)
- **Body**: Roboto (clean, readable)

### Font Weights
- Regular: 400
- Medium: 500
- Semi-bold: 600
- Bold: 700

## Sports Metaphors & Icons

### Task Status Icons
- 📋 **To Do**: Clipboard (game plan)
- ⚡ **In Progress**: Lightning bolt (action, energy)
- 🏆 **Completed**: Trophy (victory)

### Priority Icons
- 🔥 **High**: Fire (urgent, hot)
- ⚠️ **Medium**: Warning sign (attention needed)
- 📌 **Low**: Pin (noted, but not urgent)

### Other Icons
- 🎯 Target: Goals, objectives
- ⏱️ Stopwatch: Due dates, timing
- 📊 Chart: Dashboard, statistics
- ➕ Plus: Create new
- 🗑️ Trash: Delete
- ↻ Refresh: Status change
- 🔴 Live indicator: Real-time updates
- 🏆 Trophy: Brand icon in navigation

## Component Styling

### Navigation
- Gradient background (blue to darker blue)
- Gold bottom border (championship stripe)
- Active links highlighted with gold background
- Trophy icon in brand name
- Text shadow for depth

### Task Cards
- Left border color indicates status
- Hover effect: lift and shadow
- Status-specific styling:
  - Todo: Blue accent
  - In Progress: Gold accent
  - Completed: Green accent with reduced opacity
- Priority badges with color-coded backgrounds
- Smooth transitions on all interactions

### Buttons
- Gradient backgrounds for primary actions
- Hover effects: lift with enhanced shadow
- Active state: slight scale down
- Disabled state: reduced opacity
- Color-coded by action type:
  - Primary: Blue gradient
  - Success/Create: Green gradient
  - Danger/Delete: Red gradient
  - Secondary: Gray with hover transform

### Forms
- Focus states with colored shadows
- Consistent border radius (8px)
- Smooth transitions on all interactions
- Error states with red card color
- Disabled states with reduced opacity

### Modals
- Gradient headers matching action type
- Smooth slide-up animation
- Backdrop blur effect
- Rounded corners for modern look

### Dashboard
- Stats cards with left border indicators
- Hover lift effect on cards
- Filter buttons with active state highlighting
- Real-time badge with pulse animation
- Empty states with encouraging messaging

## Animations

### Keyframe Animations
- **fadeIn**: Smooth opacity transition
- **slideIn**: Vertical slide with fade
- **pulse**: Breathing effect for live indicators
- **bounce**: Playful bounce effect
- **spin**: Loading spinner rotation
- **slideDown**: Top-down entrance
- **slideUp**: Bottom-up entrance

### Transition Effects
- All interactive elements: 0.3s ease
- Hover transforms: translateY(-2px to -4px)
- Active states: scale(0.98)
- Shadow enhancements on hover

## Responsive Design

### Breakpoints
- Mobile: max-width 768px
- Adjustments:
  - Stacked layouts
  - Full-width buttons
  - Reduced font sizes
  - Simplified navigation
  - Adjusted padding/spacing

## Accessibility

### Focus States
- Visible focus indicators
- Color contrast ratios meet WCAG standards
- Keyboard navigation support
- ARIA labels on interactive elements

## Custom Scrollbar
- Styled to match theme
- Gray track with blue hover state
- Smooth transitions

## Best Practices

1. **Consistency**: Use CSS variables for all colors
2. **Performance**: Use transform for animations (GPU accelerated)
3. **Accessibility**: Maintain color contrast ratios
4. **Responsiveness**: Test on multiple screen sizes
5. **Sports Metaphors**: Use throughout UI for cohesive theme
6. **Gradients**: Apply to primary actions for depth
7. **Shadows**: Use for elevation and hierarchy
8. **Transitions**: Keep smooth and consistent (0.3s ease)

## Future Enhancements

- Add more sports-related illustrations
- Implement dark mode with stadium night theme
- Add sound effects for task completion (crowd cheer)
- Animated confetti for completed tasks
- Team/league themed color schemes
- Achievement badges and streaks
