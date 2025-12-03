import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Test credentials
const testUser = {
  username: 'testathlete',
  email: 'testathlete@example.com',
  password: 'TestPassword123!'
};

let authToken = '';
let createdTaskId = '';

// Helper function to log test results
const logTest = (name, success, details = '') => {
  const icon = success ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (details) console.log(`   ${details}`);
};

// Test runner
async function runTests() {
  console.log('🏃 Starting Task API Tests...\n');

  try {
    // 1. Register or login to get auth token
    console.log('📝 Step 1: Authentication');
    try {
      const registerRes = await axios.post(`${API_URL}/auth/register`, testUser);
      authToken = registerRes.data.token;
      logTest('Register new user', true, `Token: ${authToken.substring(0, 20)}...`);
    } catch (error) {
      if (error.response?.status === 409) {
        // User exists, try login
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
          username: testUser.username,
          password: testUser.password
        });
        authToken = loginRes.data.token;
        logTest('Login existing user', true, `Token: ${authToken.substring(0, 20)}...`);
      } else {
        throw error;
      }
    }

    const headers = { Authorization: `Bearer ${authToken}` };

    // 2. Test GET /api/tasks (empty list initially)
    console.log('\n📋 Step 2: Fetch all tasks (should be empty or existing)');
    const getTasksRes = await axios.get(`${API_URL}/tasks`, { headers });
    logTest('GET /api/tasks', true, `Found ${getTasksRes.data.count} tasks`);

    // 3. Test POST /api/tasks (create new task)
    console.log('\n➕ Step 3: Create new task');
    const newTask = {
      title: 'Complete sprint training',
      description: '5x100m sprints with 2min rest',
      status: 'todo',
      priority: 'high'
    };
    const createRes = await axios.post(`${API_URL}/tasks`, newTask, { headers });
    createdTaskId = createRes.data.task.id;
    logTest('POST /api/tasks', createRes.status === 201, `Task ID: ${createdTaskId}`);
    console.log(`   Title: ${createRes.data.task.title}`);
    console.log(`   Status: ${createRes.data.task.status}`);
    console.log(`   Priority: ${createRes.data.task.priority}`);

    // 4. Test GET /api/tasks/:id (fetch specific task)
    console.log('\n🔍 Step 4: Fetch specific task');
    const getTaskRes = await axios.get(`${API_URL}/tasks/${createdTaskId}`, { headers });
    logTest('GET /api/tasks/:id', true, `Retrieved task: ${getTaskRes.data.task.title}`);

    // 5. Test PUT /api/tasks/:id (update task)
    console.log('\n✏️ Step 5: Update task');
    const updateData = {
      status: 'in-progress',
      description: 'Updated: 5x100m sprints with 2min rest - Started!'
    };
    const updateRes = await axios.put(`${API_URL}/tasks/${createdTaskId}`, updateData, { headers });
    logTest('PUT /api/tasks/:id', true, `Status: ${updateRes.data.task.status}`);
    console.log(`   Updated description: ${updateRes.data.task.description}`);

    // 6. Test ownership verification (try to access with wrong user)
    console.log('\n🔒 Step 6: Test ownership verification');
    try {
      // Create another user
      const otherUser = {
        username: 'otherathlete',
        email: 'other@example.com',
        password: 'OtherPass123!'
      };
      let otherToken = '';
      try {
        const otherRegRes = await axios.post(`${API_URL}/auth/register`, otherUser);
        otherToken = otherRegRes.data.token;
      } catch (error) {
        if (error.response?.status === 409) {
          const otherLoginRes = await axios.post(`${API_URL}/auth/login`, {
            username: otherUser.username,
            password: otherUser.password
          });
          otherToken = otherLoginRes.data.token;
        }
      }

      // Try to access first user's task with second user's token
      await axios.get(`${API_URL}/tasks/${createdTaskId}`, {
        headers: { Authorization: `Bearer ${otherToken}` }
      });
      logTest('Ownership verification', false, 'Should have been denied!');
    } catch (error) {
      if (error.response?.status === 403) {
        logTest('Ownership verification', true, 'Access correctly denied (403)');
      } else {
        logTest('Ownership verification', false, `Unexpected error: ${error.response?.status}`);
      }
    }

    // 7. Test DELETE /api/tasks/:id (delete task)
    console.log('\n🗑️ Step 7: Delete task');
    const deleteRes = await axios.delete(`${API_URL}/tasks/${createdTaskId}`, { headers });
    logTest('DELETE /api/tasks/:id', true, deleteRes.data.message);

    // 8. Verify task is deleted
    console.log('\n✔️ Step 8: Verify deletion');
    try {
      await axios.get(`${API_URL}/tasks/${createdTaskId}`, { headers });
      logTest('Verify deletion', false, 'Task still exists!');
    } catch (error) {
      if (error.response?.status === 404) {
        logTest('Verify deletion', true, 'Task not found (404) - correctly deleted');
      } else {
        logTest('Verify deletion', false, `Unexpected error: ${error.response?.status}`);
      }
    }

    // 9. Test validation errors
    console.log('\n⚠️ Step 9: Test validation');
    try {
      await axios.post(`${API_URL}/tasks`, { title: '' }, { headers });
      logTest('Empty title validation', false, 'Should have been rejected!');
    } catch (error) {
      if (error.response?.status === 400) {
        logTest('Empty title validation', true, 'Empty title correctly rejected (400)');
      }
    }

    // 10. Test authentication requirement
    console.log('\n🔐 Step 10: Test authentication requirement');
    try {
      await axios.get(`${API_URL}/tasks`);
      logTest('Auth requirement', false, 'Should require authentication!');
    } catch (error) {
      if (error.response?.status === 401) {
        logTest('Auth requirement', true, 'Correctly requires authentication (401)');
      }
    }

    console.log('\n✨ All tests completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

runTests();
