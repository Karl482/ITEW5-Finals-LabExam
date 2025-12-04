# Test Execution Guide - Sports PWA Task Manager

This guide provides step-by-step instructions for running the complete E2E test suite and manual PWA validation tests.

## Overview

The test suite validates all requirements for Task 29:
- ✅ Complete user journey from registration to task management
- ✅ PWA installation and manifest validation
- ✅ Offline functionality and sync
- ✅ Real-time updates across multiple clients
- ✅ Google OAuth flow
- ✅ All four pages accessibility and functionality

## Prerequisites

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
npm install --prefix server

# Install client dependencies
npm install --prefix client
```

### 2. Configure Environment Variables

**Server (.env):**
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and Google OAuth credentials
```

**Client (.env):**
```bash
cd client
cp .env.example .env
# Edit .env with API URL and Google Client ID
```

### 3. Start the Application

**Option A: Start both servers with Composer**
```bash
npm run dev
```

**Option B: Start servers separately**

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

Verify:
- Server running at: `http://localhost:5000`
- Client running at: `http://localhost:5173`

---

## Part 1: Automated E2E Tests

### Run the Complete Test Suite

```bash
node test-e2e.js
```

### Expected Output

The test suite will run 9 test suites with approximately 40+ individual tests:

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║  🏃 SPORTS PWA TASK MANAGER - E2E TEST SUITE            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

📋 Testing Requirements: 1.1, 1.2, 2.1-2.4, 3.2, 3.5, 4.1-4.4, 5.1, 7.2, 7.3
🔧 Prerequisites: Server running on http://localhost:5000
🔧 Optional: Client running on http://localhost:5173

============================================================
📝 TEST SUITE 1: User Registration and Authentication
============================================================
✅ [Authentication] User 1 Registration
✅ [Authentication] User 2 Registration
✅ [Authentication] User Login
✅ [Authentication] Invalid Login Rejection
✅ [Authentication] Get User Info

... (more tests)

============================================================
📊 TEST RESULTS SUMMARY
============================================================

Authentication: 5/5 passed (100.0%)
Task Operations: 5/5 passed (100.0%)
Real-time Updates: 6/6 passed (100.0%)
PWA Features: 4/4 passed (100.0%)
API Validation: 6/6 passed (100.0%)
User Journey: 10/10 passed (100.0%)
Offline Functionality: 4/4 passed (100.0%)
Google OAuth: 2/2 passed (100.0%)
Page Accessibility: 5/5 passed (100.0%)

============================================================
TOTAL: 47/47 tests passed
Success Rate: 100.0%
============================================================

🎉 ALL TESTS PASSED! 🎉
```

### Test Suite Breakdown

1. **User Registration and Authentication** (5 tests)
   - User registration
   - Duplicate detection
   - Login with credentials
   - Invalid login rejection
   - Token authentication

2. **Task CRUD Operations** (5 tests)
   - Create task
   - Get all tasks
   - Get task by ID
   - Update task
   - Task ownership protection

3. **Real-time WebSocket Updates** (6 tests)
   - Socket connections (2 users)
   - Task created event
   - Task updated event
   - Task deleted event
   - Event isolation between users

4. **PWA Features Validation** (4 tests)
   - Manifest validation
   - Service worker file
   - PWA icons
   - PWA configuration

5. **API Validation and Error Handling** (6 tests)
   - Empty title rejection
   - Required fields validation
   - Invalid status rejection
   - Auth token required
   - Invalid token rejection
   - 404 for missing task

6. **Complete User Journey** (10 tests)
   - Registration → Login → Create → Update → Complete → Delete
   - Profile access
   - Full workflow validation

7. **Offline Functionality** (4 tests)
   - Queued operations support
   - Backend sync patterns
   - Cache data retrieval

8. **Google OAuth Flow** (2 tests)
   - OAuth endpoint availability
   - Callback endpoint configuration

9. **Four Pages Accessibility** (5 tests)
   - Client application running
   - Login, Register, Dashboard, Profile pages

### Troubleshooting Automated Tests

**Issue: Connection refused**
```
❌ [Authentication] User 1 Registration
   Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Solution:** Ensure server is running on port 5000

**Issue: MongoDB connection error**
```
❌ Server not responding
```
**Solution:** Check MongoDB URI in server/.env

**Issue: Socket connection timeout**
```
❌ [Real-time Updates] User 1 Socket Connection
   Connection timeout
```
**Solution:** Verify Socket.io is configured correctly in server

**Issue: Client not accessible**
```
❌ [Page Accessibility] Client Application Running
   Client not accessible
```
**Solution:** Start client with `npm run dev --prefix client`

---

## Part 2: Manual PWA Testing

After automated tests pass, perform manual testing for browser-specific features.

### 2.1 PWA Installation Test

**Steps:**
1. Open Chrome or Edge browser
2. Navigate to `http://localhost:5173`
3. Login with test credentials
4. Look for install icon in address bar
5. Click install button
6. Verify app installs to desktop/home screen
7. Launch installed PWA
8. Verify standalone mode (no browser UI)

**Validation:**
- [ ] Install prompt appears
- [ ] App installs successfully
- [ ] Opens in standalone window
- [ ] Icon appears on desktop

### 2.2 Service Worker Test

**Steps:**
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Service Workers"
4. Verify service worker is activated
5. Click "Cache Storage"
6. Verify caches are populated

**Validation:**
- [ ] Service worker registered
- [ ] Status: "activated and is running"
- [ ] Workbox caches created
- [ ] Static assets cached

### 2.3 Offline Mode Test

**Steps:**
1. Login and load dashboard with tasks
2. Open DevTools → Network tab
3. Check "Offline" checkbox
4. Refresh the page
5. Verify page loads from cache
6. Create a new task while offline
7. Update an existing task
8. Uncheck "Offline"
9. Verify sync occurs

**Validation:**
- [ ] Page loads offline
- [ ] Cached tasks visible
- [ ] Offline indicator shows
- [ ] Can create/update tasks offline
- [ ] Sync queue shows pending operations
- [ ] Sync completes when online
- [ ] No data loss

### 2.4 Real-time Updates Test

**Steps:**
1. Open app in two browser windows
2. Login as same user in both
3. In Window 1, create a task
4. Observe Window 2 for real-time update
5. In Window 1, update task status
6. Observe Window 2
7. In Window 1, delete task
8. Observe Window 2

**Validation:**
- [ ] Task appears in Window 2 instantly
- [ ] Updates reflect in real-time
- [ ] Deletions sync immediately
- [ ] No page refresh needed

### 2.5 Google OAuth Test

**Steps:**
1. Logout if logged in
2. Go to Login page
3. Click "Sign in with Google"
4. Select Google account
5. Grant permissions
6. Verify redirect to dashboard
7. Check user info from Google profile

**Validation:**
- [ ] Redirects to Google
- [ ] OAuth flow completes
- [ ] User logged in automatically
- [ ] Profile info populated

### 2.6 Four Pages Navigation Test

**Steps:**
1. Visit each page and verify functionality:
   - `/login` - Login page
   - `/register` - Registration page
   - `/dashboard` - Task management (protected)
   - `/profile` - User profile (protected)

**Validation:**
- [ ] All pages load correctly
- [ ] Protected routes redirect when not authenticated
- [ ] Navigation component works
- [ ] Sports theme consistent
- [ ] All features functional

---

## Part 3: Cross-Browser Testing

Test on multiple browsers to ensure compatibility:

### Chrome/Edge
```bash
# Open in Chrome
start chrome http://localhost:5173

# Open in Edge
start msedge http://localhost:5173
```

### Firefox
```bash
start firefox http://localhost:5173
```

### Safari (macOS)
```bash
open -a Safari http://localhost:5173
```

**Validation Checklist:**
- [ ] All features work in Chrome
- [ ] All features work in Edge
- [ ] All features work in Firefox
- [ ] All features work in Safari
- [ ] PWA installable in all browsers
- [ ] Service worker works in all browsers

---

## Part 4: Mobile Testing

### Test on Mobile Devices

**Android:**
1. Connect device to same network
2. Find your computer's IP address
3. Open `http://[YOUR_IP]:5173` on mobile
4. Test PWA installation
5. Test offline mode
6. Test touch interactions

**iOS:**
1. Connect device to same network
2. Open `http://[YOUR_IP]:5173` in Safari
3. Tap Share → Add to Home Screen
4. Test PWA features
5. Test offline mode

**Validation:**
- [ ] Responsive design works
- [ ] Touch interactions smooth
- [ ] PWA installable on mobile
- [ ] Offline mode functional
- [ ] Real-time updates work

---

## Part 5: Performance Testing

### Lighthouse Audit

**Steps:**
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App" category
4. Click "Generate report"

**Target Scores:**
- [ ] PWA score: 90+
- [ ] Performance: 80+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 80+

### Network Performance

**Steps:**
1. Open DevTools → Network tab
2. Reload page
3. Check load times

**Validation:**
- [ ] Initial load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] API responses < 500ms
- [ ] WebSocket connects < 1 second

---

## Test Results Documentation

### Create Test Report

After completing all tests, document results:

```markdown
# Test Execution Report

**Date:** [Date]
**Tester:** [Name]
**Environment:** [OS, Browser versions]

## Automated Tests
- Total Tests: 47
- Passed: 47
- Failed: 0
- Success Rate: 100%

## Manual Tests
- PWA Installation: ✅ Pass
- Service Worker: ✅ Pass
- Offline Mode: ✅ Pass
- Real-time Updates: ✅ Pass
- Google OAuth: ✅ Pass
- Four Pages: ✅ Pass

## Cross-Browser
- Chrome: ✅ Pass
- Edge: ✅ Pass
- Firefox: ✅ Pass
- Safari: ✅ Pass

## Mobile
- Android: ✅ Pass
- iOS: ✅ Pass

## Issues Found
[List any issues]

## Recommendations
[Any recommendations]
```

---

## Requirements Coverage

This test execution validates all requirements for Task 29:

✅ **Req 1.1, 1.2** - User authentication (local and OAuth)
✅ **Req 2.1, 2.2, 2.3, 2.4** - Task CRUD operations
✅ **Req 3.2, 3.5** - PWA installation and manifest
✅ **Req 4.1, 4.2, 4.3, 4.4** - Offline functionality and sync
✅ **Req 5.1** - Four pages accessibility
✅ **Req 7.2, 7.3** - Real-time WebSocket updates

---

## Next Steps

After all tests pass:

1. ✅ Mark Task 29 as complete
2. 📝 Document any issues found
3. 🔧 Fix any failing tests
4. 📊 Generate final test report
5. 🚀 Prepare for deployment

## Support

For issues or questions:
- Check server logs: `server/` directory
- Check client console: Browser DevTools
- Review test output for specific failures
- Consult requirements and design documents
