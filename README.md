# Sports PWA Task Manager

A full-stack Progressive Web Application with a sports theme for task management, featuring real-time updates, offline capabilities, and Google OAuth authentication.

## Project Structure

```
sports-pwa-task-manager/
├── client/              # React frontend application
│   └── package.json
├── server/              # Express.js backend API
│   └── package.json
├── composer.json        # Composer configuration
├── package.json         # Root workspace configuration
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas account (for cloud database)

## Quick Start

For first-time setup, follow these steps:

```bash
# 1. Install dependencies
npm run install:all

# 2. Set up environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Edit server/.env and add your MongoDB URI and JWT secret
# (See detailed instructions below)

# 4. Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Getting Started

### 1. Install Dependencies

Install all dependencies for both client and server:

```bash
npm run install:all
```

Or using Composer:

```bash
composer install
```

### 2. Environment Configuration

#### Server Environment Setup

1. Copy the example environment file:
   ```bash
   cp server/.env.example server/.env
   ```

2. Edit `server/.env` and configure the following variables:

   **Required Variables:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
     - Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`
     - Replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your actual values
     - Get this from MongoDB Atlas → Database → Connect → Connect your application
   
   - `JWT_SECRET`: A secure random string for JWT token signing
     - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
     - Must be kept secret and never committed to version control
   
   **Optional Variables (for Google OAuth):**
   - `GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth 2.0 Client Secret
   - `GOOGLE_CALLBACK_URL`: OAuth callback URL (default: `http://localhost:5000/api/auth/google/callback`)
   
   **Other Variables:**
   - `PORT`: Server port (default: 5000)
   - `NODE_ENV`: Environment mode (development/production)
   - `CLIENT_URL`: Frontend URL for CORS (default: `http://localhost:5173`)

   **Example `server/.env`:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/sports-pwa?retryWrites=true&w=majority
   JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
   GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwx
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   CLIENT_URL=http://localhost:5173
   ```

#### Client Environment Setup

1. Copy the example environment file:
   ```bash
   cp client/.env.example client/.env
   ```

2. Edit `client/.env` and configure:

   **Required Variables:**
   - `VITE_API_URL`: Backend API URL (default: `http://localhost:5000`)
   
   **Optional Variables:**
   - `VITE_GOOGLE_CLIENT_ID`: Google OAuth Client ID (same as server, for client-side OAuth button)

   **Example `client/.env`:**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

### 3. MongoDB Atlas Setup

If you don't have a MongoDB Atlas account:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from "Connect" → "Connect your application"
6. Copy the connection string to `MONGODB_URI` in `server/.env`

### 4. Run Development Servers

Start both frontend and backend concurrently:

```bash
npm run dev
```

Or using Composer:

```bash
composer run dev
```

This will start:
- **Client application** on `http://localhost:5173` (Vite dev server)
- **API server** on `http://localhost:5000` (Express with nodemon)

You should see output confirming:
- ✅ MongoDB Connected: [your-cluster].mongodb.net
- 📊 Database: [your-database-name]
- 🚀 Server running on port 5000
- 🌍 Environment: development
- 🎯 API URL: http://localhost:5000
- 🔌 WebSocket server ready
- ⚽ Sports PWA Task Manager API is ready!
- VITE v5.x.x ready in [time]ms
- ➜ Local: http://localhost:5173/

### 5. Verify Setup

1. Open `http://localhost:5173` in your browser
2. The application should load without errors
3. Check browser console for any connection issues
4. Try registering a new user to test database connectivity

For a comprehensive verification checklist, see [SETUP_VERIFICATION.md](./SETUP_VERIFICATION.md).

## Environment Variables Reference

### Server Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Port for Express server |
| `NODE_ENV` | No | development | Environment mode |
| `MONGODB_URI` | **Yes** | - | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | - | Secret key for JWT signing |
| `GOOGLE_CLIENT_ID` | No | - | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | No | - | Google OAuth Client Secret |
| `GOOGLE_CALLBACK_URL` | No | http://localhost:5000/api/auth/google/callback | OAuth callback URL |
| `CLIENT_URL` | No | http://localhost:5173 | Frontend URL for CORS |

### Client Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | http://localhost:5000 | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | No | - | Google OAuth Client ID |

**Note:** All Vite environment variables must be prefixed with `VITE_` to be exposed to the client.

## Available Scripts

### Root Level

- `npm run dev` - Start both client and server in development mode with hot-reload
- `npm run install:all` - Install dependencies for all workspaces
- `composer run dev` - Alternative way to start development servers (same as npm run dev)
- `composer run install-deps` - Alternative way to install dependencies
- `composer run build` - Build client application for production

### Client (Frontend)

```bash
cd client
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Server (Backend)

```bash
cd server
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start without auto-restart
```

## Development Features

### Hot Reload

Both client and server support hot-reload during development:

- **Frontend**: Vite provides instant HMR (Hot Module Replacement)
- **Backend**: Nodemon automatically restarts the server when files change

### API Proxy

The Vite dev server is configured to proxy API requests to the backend:

- Frontend requests to `/api/*` are automatically forwarded to `http://localhost:5000`
- No CORS issues during development
- Configured in `client/vite.config.js`

**Example:**
```javascript
// In your React components, you can make requests like:
axios.get('/api/tasks')  // Proxied to http://localhost:5000/api/tasks
axios.post('/api/auth/login', data)  // Proxied to http://localhost:5000/api/auth/login
```

**Proxy Configuration (client/vite.config.js):**
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

### MongoDB Connection

The server displays detailed connection information on startup:

```
✅ MongoDB Connected: cluster0.abc123.mongodb.net
📊 Database: sports-pwa
🚀 Server running on port 5000
🔌 WebSocket server ready
```

If connection fails, check:
1. MongoDB URI format is correct
2. Database user credentials are valid
3. IP address is whitelisted in MongoDB Atlas
4. Network connectivity

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: bad auth"**
- Check username and password in `MONGODB_URI`
- Ensure password special characters are URL-encoded
- Verify database user exists in MongoDB Atlas

**Error: "MongooseServerSelectionError"**
- Check network connectivity
- Verify IP address is whitelisted in MongoDB Atlas (Network Access)
- Ensure cluster is running (not paused)

**Error: "ECONNREFUSED"**
- MongoDB URI format is incorrect
- Cluster hostname is wrong

### Port Already in Use

**Error: "EADDRINUSE: address already in use"**
- Another process is using port 5000 or 5173
- Kill the process: `npx kill-port 5000 5173`
- Or change ports in `.env` files

### Environment Variables Not Loading

- Ensure `.env` files exist (not just `.env.example`)
- Restart development servers after changing `.env` files
- Check for typos in variable names
- Client variables must start with `VITE_`

### Google OAuth Not Working

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check authorized redirect URIs in Google Cloud Console
- Ensure callback URL matches: `http://localhost:5000/api/auth/google/callback`
- Google OAuth requires HTTPS in production

### Hot Reload Not Working

**Frontend:**
- Check Vite dev server is running
- Clear browser cache
- Check for syntax errors in console

**Backend:**
- Verify nodemon is installed
- Check `server/package.json` has correct dev script
- Look for syntax errors preventing restart

## Features

- ✅ User authentication (local and Google OAuth)
- ✅ Real-time task updates via WebSocket
- ✅ Offline support with Service Worker
- ✅ Progressive Web App (installable)
- ✅ Sports-themed UI
- ✅ RESTful API
- ✅ Cloud-hosted MongoDB

## Tech Stack

**Frontend:**
- React 18
- React Router v6
- Socket.io Client
- Workbox (Service Worker)
- Vite

**Backend:**
- Node.js
- Express.js
- Socket.io
- Passport.js (Google OAuth)
- Mongoose
- JWT

**Database:**
- MongoDB Atlas

## License

MIT
