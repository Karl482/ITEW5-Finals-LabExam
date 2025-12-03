import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

console.log('🧪 Testing Backend Error Handling and Validation\n');

// Test 1: Invalid registration - short username
async function testInvalidUsername() {
  console.log('Test 1: Invalid username (too short)');
  try {
    await axios.post(`${API_URL}/auth/register`, {
      username: 'ab',
      email: 'test@example.com',
      password: 'Password123'
    });
    console.log('❌ Should have failed\n');
  } catch (error) {
    if (error.response) {
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Test 2: Invalid registration - weak password
async function testWeakPassword() {
  console.log('Test 2: Weak password (no uppercase/number)');
  try {
    await axios.post(`${API_URL}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password'
    });
    console.log('❌ Should have failed\n');
  } catch (error) {
    if (error.response) {
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Test 3: Invalid registration - bad email
async function testInvalidEmail() {
  console.log('Test 3: Invalid email format');
  try {
    await axios.post(`${API_URL}/auth/register`, {
      username: 'testuser',
      email: 'notanemail',
      password: 'Password123'
    });
    console.log('❌ Should have failed\n');
  } catch (error) {
    if (error.response) {
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Test 4: Missing fields
async function testMissingFields() {
  console.log('Test 4: Missing required fields');
  try {
    await axios.post(`${API_URL}/auth/register`, {
      username: 'testuser'
    });
    console.log('❌ Should have failed\n');
  } catch (error) {
    if (error.response) {
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Test 5: Invalid task creation without auth
async function testUnauthorizedTaskCreation() {
  console.log('Test 5: Create task without authentication');
  try {
    await axios.post(`${API_URL}/tasks`, {
      title: 'Test Task'
    });
    console.log('❌ Should have failed\n');
  } catch (error) {
    if (error.response) {
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Test 6: Invalid task ID format
async function testInvalidTaskId() {
  console.log('Test 6: Get task with invalid ID format');
  try {
    await axios.get(`${API_URL}/tasks/invalid-id`, {
      headers: {
        Authorization: 'Bearer fake-token'
      }
    });
    console.log('❌ Should have failed\n');
  } catch (error) {
    if (error.response) {
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Test 7: 404 Not Found
async function testNotFound() {
  console.log('Test 7: Access non-existent route');
  try {
    await axios.get(`${API_URL}/nonexistent`);
    console.log('❌ Should have failed\n');
  } catch (error) {
    if (error.response) {
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Test 8: Valid registration
async function testValidRegistration() {
  console.log('Test 8: Valid registration');
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'Password123'
    });
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
    console.log();
    return response.data.token;
  } catch (error) {
    if (error.response) {
      console.log('❌ Failed:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Test 9: Create task with invalid data
async function testInvalidTaskCreation(token) {
  console.log('Test 9: Create task with invalid data (empty title)');
  try {
    await axios.post(`${API_URL}/tasks`, {
      title: '',
      description: 'Test'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('❌ Should have failed\n');
  } catch (error) {
    if (error.response) {
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Test 10: Create task with invalid status
async function testInvalidTaskStatus(token) {
  console.log('Test 10: Create task with invalid status');
  try {
    await axios.post(`${API_URL}/tasks`, {
      title: 'Test Task',
      status: 'invalid-status'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('❌ Should have failed\n');
  } catch (error) {
    if (error.response) {
      console.log('✅ Status:', error.response.status);
      console.log('✅ Error:', JSON.stringify(error.response.data, null, 2));
      console.log();
    }
  }
}

// Run all tests
async function runTests() {
  await testInvalidUsername();
  await testWeakPassword();
  await testInvalidEmail();
  await testMissingFields();
  await testUnauthorizedTaskCreation();
  await testInvalidTaskId();
  await testNotFound();
  
  const token = await testValidRegistration();
  if (token) {
    await testInvalidTaskCreation(token);
    await testInvalidTaskStatus(token);
  }
  
  console.log('✅ All validation tests completed!');
}

runTests().catch(console.error);
