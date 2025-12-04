# Quick Test Reference Card

## 🚀 Quick Start (3 Steps)

### 1. Start Servers
```bash
npm run dev
```
*Starts both client and server*

### 2. Run Tests
```bash
node run-e2e-tests.js
```
*Runs automated E2E test suite*

### 3. Manual Testing
Open browser → http://localhost:5173
- Test PWA installation
- Test offline mode
- Test real-time updates

---

## 📋 Test Commands

| Command | Purpose |
|---------|---------|
| `node run-e2e-tests.js` | Run E2E tests with prerequisites check |
| `node test-e2e.js` | Run E2E tests directly |
| `npm run dev` | Start both client and server |
| `npm run dev --prefix server` | Start server only |
| `npm run dev --prefix client` | Start client only |

---

## ✅ Expected Results

### Automated Tests
```
TOTAL: 47/47 tests passed
Success Rate: 100.0%
🎉 ALL TESTS PASSED! 🎉
```

### Test Breakdown
- Authentication: 5 tests
- Task Operations: 5 tests
- Real-time Updates: 6 tests
- PWA Features: 4 tests
- API Validation: 6 tests
- User Journey: 10 tests
- Offline Functionality: 4 tests
- Google OAuth: 2 tests
- Page Accessibility: 5 tests

---

## 🔧 Troubleshooting

### Server Not Running
```bash
cd server
npm run dev
```

### Client Not Running
```bash
cd client
npm run dev
```

### MongoDB Connection Error
Check `server/.env` file:
```
MONGODB_URI=your_mongodb_connection_string
```

### Port Already in Use
Kill process on port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## 📱 Manual Test Checklist

### PWA Installation
- [ ] Install button appears
- [ ] App installs successfully
- [ ] Opens in standalone mode

### Offline Mode
- [ ] Page loads offline
- [ ] Can create tasks offline
- [ ] Sync works when online

### Real-time Updates
- [ ] Open two windows
- [ ] Create task in Window 1
- [ ] Appears in Window 2 instantly

### Four Pages
- [ ] /login - Login page
- [ ] /register - Registration page
- [ ] /dashboard - Task management
- [ ] /profile - User profile

---

## 📊 Requirements Coverage

| Req | Feature | Status |
|-----|---------|--------|
| 1.1 | User registration | ✅ |
| 1.2 | Google OAuth | ✅ |
| 2.1 | Create tasks | ✅ |
| 2.2 | Read tasks | ✅ |
| 2.3 | Update tasks | ✅ |
| 2.4 | Delete tasks | ✅ |
| 3.2 | PWA installation | ✅ |
| 3.5 | PWA manifest | ✅ |
| 4.1 | Offline assets | ✅ |
| 4.2 | Cached content | ✅ |
| 4.3 | Offline queue | ✅ |
| 4.4 | Online sync | ✅ |
| 5.1 | Four pages | ✅ |
| 7.2 | Real-time events | ✅ |
| 7.3 | Real-time UI | ✅ |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `test-e2e.js` | Automated test suite |
| `run-e2e-tests.js` | Test runner with checks |
| `E2E_TESTING_README.md` | Complete testing docs |
| `TEST_EXECUTION_GUIDE.md` | Step-by-step guide |
| `PWA_MANUAL_TEST_CHECKLIST.md` | Manual test checklist |
| `QUICK_TEST_REFERENCE.md` | This file |

---

## 🎯 Test Execution Flow

```
1. Prerequisites Check
   ├─ Server running? ✓
   └─ Client running? ✓

2. Automated Tests (47 tests)
   ├─ Authentication (5)
   ├─ Task Operations (5)
   ├─ Real-time Updates (6)
   ├─ PWA Features (4)
   ├─ API Validation (6)
   ├─ User Journey (10)
   ├─ Offline Functionality (4)
   ├─ Google OAuth (2)
   └─ Page Accessibility (5)

3. Manual Tests
   ├─ PWA Installation
   ├─ Offline Mode
   ├─ Real-time Updates
   └─ Four Pages Navigation

4. Results
   └─ All tests passed ✅
```

---

## 💡 Pro Tips

1. **Run tests before commits**
   ```bash
   node run-e2e-tests.js
   ```

2. **Check server logs if tests fail**
   ```bash
   cd server
   npm run dev
   # Watch console output
   ```

3. **Use DevTools for manual testing**
   - F12 → Application tab (PWA features)
   - F12 → Network tab (Offline mode)
   - F12 → Console (WebSocket logs)

4. **Test in multiple browsers**
   - Chrome (best PWA support)
   - Edge (good PWA support)
   - Firefox (good support)
   - Safari (limited PWA support)

---

## 🆘 Quick Help

**Tests won't run?**
→ Check if servers are running

**Server won't start?**
→ Check MongoDB connection in .env

**Client won't start?**
→ Check if port 5173 is available

**Tests failing?**
→ Review test output for specific errors

**Need more help?**
→ See TEST_EXECUTION_GUIDE.md

---

## ✨ Success Criteria

All tests pass when you see:
```
🎉 ALL TESTS PASSED! 🎉

✅ Requirements Validated:
   - 1.1, 1.2: User authentication
   - 2.1, 2.2, 2.3, 2.4: Task CRUD
   - 3.2, 3.5: PWA features
   - 4.1, 4.2, 4.3, 4.4: Offline functionality
   - 5.1: Four pages
   - 7.2, 7.3: Real-time updates
```

---

**Task 29 Complete!** ✅

All E2E tests implemented and documented.
Ready for production deployment.
