# PWA Manual Testing Checklist

This document provides a comprehensive checklist for manually testing PWA features that require browser interaction. These tests complement the automated E2E test suite.

## Prerequisites

- ✅ Server running on `http://localhost:5000`
- ✅ Client running on `http://localhost:5173`
- ✅ Modern browser (Chrome, Edge, Firefox, or Safari)
- ✅ Test user account created

---

## Test Suite 1: PWA Installation (Req 3.1, 3.2, 3.5)

### Test 1.1: PWA Installability
**Steps:**
1. Open Chrome/Edge browser
2. Navigate to `http://localhost:5173`
3. Look for install prompt in address bar or app menu

**Expected Results:**
- [ ] Install button appears in browser UI
- [ ] Clicking install shows native installation dialog
- [ ] App name "Sports Task Manager" displayed correctly
- [ ] App icon visible in installation dialog

### Test 1.2: Install PWA
**Steps:**
1. Click the install button
2. Confirm installation in dialog
3. Check desktop/home screen for app icon

**Expected Results:**
- [ ] App installs successfully
- [ ] App icon appears on desktop/home screen
- [ ] App can be launched from installed icon
- [ ] App opens in standalone window (no browser UI)

### Test 1.3: PWA Manifest Validation
**Steps:**
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Manifest" in left sidebar

**Expected Results:**
- [ ] Manifest loads without errors
- [ ] Name: "Sports Task Manager"
- [ ] Short name: "SportsTasks"
- [ ] Display mode: "standalone"
- [ ] Theme color: Sports blue (#0066CC)
- [ ] Icons: 192x192 and 512x512 present

---

## Test Suite 2: Service Worker & Caching (Req 3.3, 3.4, 4.1)

### Test 2.1: Service Worker Registration
**Steps:**
1. Open DevTools → Application tab
2. Click "Service Workers" in left sidebar

**Expected Results:**
- [ ] Service worker registered and activated
- [ ] Status shows "activated and is running"
- [ ] Source file path displayed

### Test 2.2: Cache Storage
**Steps:**
1. Open DevTools → Application tab
2. Click "Cache Storage" in left sidebar
3. Expand cache entries

**Expected Results:**
- [ ] Workbox caches created
- [ ] Static assets cached (HTML, CSS, JS)
- [ ] App icons cached
- [ ] Manifest cached

### Test 2.3: Offline Asset Loading
**Steps:**
1. Load the application fully
2. Open DevTools → Network tab
3. Check "Offline" checkbox
4. Refresh the page

**Expected Results:**
- [ ] Page loads from cache
- [ ] UI renders correctly
- [ ] Static assets load from cache
- [ ] No network errors for cached resources

---

## Test Suite 3: Offline Functionality (Req 4.1, 4.2, 4.3, 4.4)

### Test 3.1: Offline Detection
**Steps:**
1. Login to the application
2. Navigate to Dashboard
3. Open DevTools → Network tab
4. Enable "Offline" mode

**Expected Results:**
- [ ] Offline indicator appears in UI
- [ ] Connection status shows "Offline"
- [ ] Previously loaded tasks still visible
- [ ] UI remains functional

### Test 3.2: View Cached Tasks Offline
**Steps:**
1. While online, view your task list
2. Go offline (DevTools → Network → Offline)
3. Navigate between pages
4. Return to Dashboard

**Expected Results:**
- [ ] Tasks remain visible offline
- [ ] Task details accessible
- [ ] No data loss when offline
- [ ] Cached data indicator shown

### Test 3.3: Create Task Offline
**Steps:**
1. Go offline
2. Click "Create Task" button
3. Fill in task details
4. Submit the form

**Expected Results:**
- [ ] Task appears in UI immediately
- [ ] Task marked as "pending sync"
- [ ] Sync queue indicator shows 1 pending operation
- [ ] No error messages displayed

### Test 3.4: Update Task Offline
**Steps:**
1. While offline, select an existing task
2. Change status or description
3. Save changes

**Expected Results:**
- [ ] Changes reflected in UI immediately
- [ ] Update queued for sync
- [ ] Sync queue count increases
- [ ] Optimistic UI update works

### Test 3.5: Delete Task Offline
**Steps:**
1. While offline, select a task
2. Click delete button
3. Confirm deletion

**Expected Results:**
- [ ] Task removed from UI
- [ ] Deletion queued for sync
- [ ] Sync queue indicator updated
- [ ] Can undo if needed

### Test 3.6: Sync When Back Online
**Steps:**
1. Perform offline operations (create, update, delete)
2. Go back online (uncheck Offline in DevTools)
3. Wait for automatic sync

**Expected Results:**
- [ ] Sync indicator shows "Syncing..."
- [ ] All queued operations processed
- [ ] Server confirms operations
- [ ] Sync queue clears
- [ ] Success message displayed
- [ ] No conflicts or errors

---

## Test Suite 4: Real-time Updates (Req 7.1, 7.2, 7.3, 7.4)

### Test 4.1: WebSocket Connection
**Steps:**
1. Login to application
2. Open DevTools → Console
3. Look for WebSocket connection messages

**Expected Results:**
- [ ] WebSocket connects successfully
- [ ] Connection status shows "Connected"
- [ ] Socket ID logged in console
- [ ] No connection errors

### Test 4.2: Real-time Task Creation
**Steps:**
1. Open app in two browser windows (same user)
2. In Window 1, create a new task
3. Observe Window 2

**Expected Results:**
- [ ] New task appears in Window 2 immediately
- [ ] No page refresh needed
- [ ] Task details match Window 1
- [ ] Animation/notification shown

### Test 4.3: Real-time Task Updates
**Steps:**
1. Open app in two windows
2. In Window 1, update a task status
3. Observe Window 2

**Expected Results:**
- [ ] Task updates in Window 2 instantly
- [ ] Status change reflected
- [ ] No manual refresh needed
- [ ] Update animation shown

### Test 4.4: Real-time Task Deletion
**Steps:**
1. Open app in two windows
2. In Window 1, delete a task
3. Observe Window 2

**Expected Results:**
- [ ] Task removed from Window 2
- [ ] Deletion happens immediately
- [ ] No errors in console
- [ ] Smooth removal animation

### Test 4.5: Reconnection After Disconnect
**Steps:**
1. Login and connect
2. Go offline briefly
3. Go back online

**Expected Results:**
- [ ] WebSocket reconnects automatically
- [ ] Connection status updates
- [ ] Real-time updates resume
- [ ] No data loss during disconnect

---

## Test Suite 5: Four Pages Navigation (Req 5.1, 5.2, 5.3, 5.4)

### Test 5.1: Login Page
**URL:** `http://localhost:5173/login`

**Expected Results:**
- [ ] Page loads with sports theme
- [ ] Username and password fields present
- [ ] "Login" button functional
- [ ] "Google Sign In" button present
- [ ] Link to Register page works
- [ ] Form validation works
- [ ] Error messages display correctly

### Test 5.2: Register Page
**URL:** `http://localhost:5173/register`

**Expected Results:**
- [ ] Registration form displays
- [ ] Username, email, password fields present
- [ ] Password confirmation field works
- [ ] Validation messages show
- [ ] "Register" button functional
- [ ] Link to Login page works
- [ ] Sports-themed styling applied

### Test 5.3: Dashboard Page (Protected)
**URL:** `http://localhost:5173/dashboard`

**Expected Results:**
- [ ] Redirects to login if not authenticated
- [ ] Shows task list when authenticated
- [ ] "Create Task" button works
- [ ] Task cards display correctly
- [ ] Filter by status works
- [ ] Sports scoreboard theme visible
- [ ] Real-time updates work
- [ ] Connection status indicator present

### Test 5.4: Profile Page (Protected)
**URL:** `http://localhost:5173/profile`

**Expected Results:**
- [ ] Redirects to login if not authenticated
- [ ] User info displays correctly
- [ ] Avatar/display name shown
- [ ] Email address visible
- [ ] "Logout" button works
- [ ] PWA installation status shown
- [ ] Sports player card theme applied
- [ ] Settings accessible

### Test 5.5: Navigation Component
**Steps:**
1. Login to application
2. Use navigation menu
3. Visit all four pages

**Expected Results:**
- [ ] Navigation visible on all pages
- [ ] Active route highlighted
- [ ] All links functional
- [ ] User info shown when authenticated
- [ ] Logout button accessible
- [ ] Sports team colors applied
- [ ] Responsive on mobile

---

## Test Suite 6: Google OAuth Flow (Req 1.2)

### Test 6.1: Initiate OAuth
**Steps:**
1. Go to Login page
2. Click "Sign in with Google" button

**Expected Results:**
- [ ] Redirects to Google login page
- [ ] Google consent screen appears
- [ ] App name displayed correctly
- [ ] Requested permissions shown

### Test 6.2: Complete OAuth
**Steps:**
1. Select Google account
2. Grant permissions
3. Wait for redirect

**Expected Results:**
- [ ] Redirects back to application
- [ ] User automatically logged in
- [ ] JWT token stored
- [ ] Redirects to Dashboard
- [ ] User info populated from Google

### Test 6.3: OAuth Error Handling
**Steps:**
1. Initiate OAuth
2. Deny permissions or cancel

**Expected Results:**
- [ ] Returns to login page
- [ ] Error message displayed
- [ ] Can retry OAuth
- [ ] No application crash

---

## Test Suite 7: Complete User Journey (Integration)

### Test 7.1: New User Journey
**Steps:**
1. Open application (not logged in)
2. Click "Register"
3. Create account
4. Verify redirect to Dashboard
5. Create first task
6. Update task status
7. View task details
8. Delete task
9. Visit Profile page
10. Logout

**Expected Results:**
- [ ] All steps complete without errors
- [ ] Smooth transitions between pages
- [ ] Data persists correctly
- [ ] Real-time updates work
- [ ] Sports theme consistent throughout
- [ ] No console errors

### Test 7.2: Returning User Journey
**Steps:**
1. Open application
2. Login with existing account
3. View existing tasks
4. Create new task
5. Receive real-time update (if available)
6. Go offline
7. Make changes offline
8. Go back online
9. Verify sync
10. Install PWA

**Expected Results:**
- [ ] Login successful
- [ ] Previous tasks loaded
- [ ] New tasks created
- [ ] Real-time updates received
- [ ] Offline mode works
- [ ] Sync completes successfully
- [ ] PWA installs correctly

---

## Test Suite 8: Cross-Browser Testing

### Test 8.1: Chrome/Edge
- [ ] All features work
- [ ] PWA installable
- [ ] Service worker registers
- [ ] Offline mode functional

### Test 8.2: Firefox
- [ ] All features work
- [ ] PWA installable
- [ ] Service worker registers
- [ ] Offline mode functional

### Test 8.3: Safari (iOS/macOS)
- [ ] All features work
- [ ] Add to Home Screen works
- [ ] Service worker registers
- [ ] Offline mode functional

### Test 8.4: Mobile Browsers
- [ ] Responsive design works
- [ ] Touch interactions smooth
- [ ] PWA installable on mobile
- [ ] Offline mode on mobile

---

## Test Suite 9: Performance & UX

### Test 9.1: Load Performance
- [ ] Initial page load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] Smooth animations
- [ ] No layout shifts

### Test 9.2: Sports Theme Consistency
- [ ] Color palette consistent
- [ ] Athletic fonts used
- [ ] Sports metaphors clear
- [ ] Icons appropriate
- [ ] Energetic feel maintained

### Test 9.3: Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Sufficient color contrast
- [ ] Focus indicators visible
- [ ] ARIA labels present

---

## Summary Checklist

### Critical Features (Must Pass)
- [ ] User registration and login work
- [ ] Task CRUD operations functional
- [ ] PWA installable
- [ ] Service worker active
- [ ] Offline mode works
- [ ] Sync queue processes correctly
- [ ] Real-time updates functional
- [ ] All four pages accessible
- [ ] Navigation works
- [ ] Sports theme applied

### Optional Features (Nice to Have)
- [ ] Google OAuth works
- [ ] Cross-browser compatible
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Accessibility compliant

---

## Notes

- Run automated E2E tests first: `node test-e2e.js`
- Test on multiple browsers and devices
- Document any issues found
- Take screenshots of failures
- Check browser console for errors
- Monitor network tab for failed requests

## Requirements Coverage

This manual test checklist validates:
- **Req 1.1, 1.2**: User authentication (local and OAuth)
- **Req 2.1-2.4**: Task CRUD operations
- **Req 3.1, 3.2, 3.5**: PWA installation and manifest
- **Req 4.1-4.4**: Offline functionality and sync
- **Req 5.1-5.4**: Four pages and navigation
- **Req 7.1-7.4**: Real-time WebSocket updates
