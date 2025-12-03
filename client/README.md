# Sports PWA Task Manager - Client

React-based Progressive Web Application with sports-themed task management interface.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── Navigation.tsx       # Main navigation component
│   ├── pages/
│   │   ├── LoginPage.tsx        # Login page
│   │   ├── RegisterPage.tsx     # Registration page
│   │   ├── DashboardPage.tsx    # Main dashboard
│   │   └── TaskDetailPage.tsx   # Task detail view
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles
│   └── App.css                  # App-level styles
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
└── tsconfig.json               # TypeScript configuration
```

## Available Routes

- `/` or `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Task dashboard (main view)
- `/tasks/:id` - Individual task detail page

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

API requests to `/api/*` are proxied to `http://localhost:5000` (backend server).

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Sports Theme

The application uses a sports-themed color palette:

- **Primary Blue** (#0066CC) - Team spirit
- **Victory Green** (#00AA44) - Success/completion
- **Championship Gold** (#FFB700) - Highlights
- **Referee Yellow** (#FFC107) - Alerts
- **Red Card** (#DC3545) - Errors/deletions
- **Stadium Gray** (#6C757D) - Secondary text

## Next Steps

The current implementation includes:
- ✅ React app with TypeScript
- ✅ React Router v6 configuration
- ✅ Four main pages with placeholder content
- ✅ Navigation component with active route highlighting
- ✅ Sports-themed styling
- ✅ API proxy configuration

To be implemented in subsequent tasks:
- Authentication context and state management
- Login and registration forms
- Task CRUD operations
- Real-time WebSocket integration
- PWA features (service worker, manifest)
- Offline capabilities
