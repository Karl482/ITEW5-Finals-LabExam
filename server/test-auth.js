/**
 * Simple test script to verify authentication endpoints
 * Run with: node test-auth.js
 */

const API_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  username: 'testathlete',
  email: 'test@athlete.com',
  password: 'password123'
};

let authToken = '';

// Helper function to make HTTP requests
async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error.message);
    return { status: 0, data: { error: error.message } };
  }
}

// Test 1: Register a new user
async function testRegister() {
  console.log('\n🧪 Test 1: Register new user');
  console.log('POST /api/auth/register');
  console.log('Body:', testUser);

  const result = await makeRequest('/auth/register', 'POST', testUser);
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 201 && result.data.token) {
    authToken = result.data.token;
    console.log('✅ Registration successful!');
    return true;
  } else {
    console.log('❌ Registration failed!');
    return false;
  }
}

// Test 2: Try to register with duplicate username
async function testDuplicateRegister() {
  console.log('\n🧪 Test 2: Register with duplicate username (should fail)');
  console.log('POST /api/auth/register');

  const result = await makeRequest('/auth/register', 'POST', testUser);
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 409) {
    console.log('✅ Duplicate detection working!');
    return true;
  } else {
    console.log('❌ Duplicate detection failed!');
    return false;
  }
}

// Test 3: Login with correct credentials
async function testLogin() {
  console.log('\n🧪 Test 3: Login with correct credentials');
  console.log('POST /api/auth/login');
  console.log('Body:', { username: testUser.username, password: testUser.password });

  const result = await makeRequest('/auth/login', 'POST', {
    username: testUser.username,
    password: testUser.password
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 200 && result.data.token) {
    authToken = result.data.token;
    console.log('✅ Login successful!');
    return true;
  } else {
    console.log('❌ Login failed!');
    return false;
  }
}

// Test 4: Login with incorrect password
async function testInvalidLogin() {
  console.log('\n🧪 Test 4: Login with incorrect password (should fail)');
  console.log('POST /api/auth/login');

  const result = await makeRequest('/auth/login', 'POST', {
    username: testUser.username,
    password: 'wrongpassword'
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 401) {
    console.log('✅ Invalid credentials detected!');
    return true;
  } else {
    console.log('❌ Invalid credentials not detected!');
    return false;
  }
}

// Test 5: Get current user with token
async function testGetMe() {
  console.log('\n🧪 Test 5: Get current user with valid token');
  console.log('GET /api/auth/me');
  console.log('Authorization: Bearer [token]');

  const result = await makeRequest('/auth/me', 'GET', null, authToken);
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 200 && result.data.user) {
    console.log('✅ Token authentication working!');
    return true;
  } else {
    console.log('❌ Token authentication failed!');
    return false;
  }
}

// Test 6: Get current user without token
async function testGetMeNoToken() {
  console.log('\n🧪 Test 6: Get current user without token (should fail)');
  console.log('GET /api/auth/me');

  const result = await makeRequest('/auth/me', 'GET');
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 401) {
    console.log('✅ Unauthorized access blocked!');
    return true;
  } else {
    console.log('❌ Unauthorized access not blocked!');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🏃 Starting Authentication Tests...');
  console.log('Make sure the server is running on http://localhost:5000');
  
  const results = [];
  
  results.push(await testRegister());
  results.push(await testDuplicateRegister());
  results.push(await testLogin());
  results.push(await testInvalidLogin());
  results.push(await testGetMe());
  results.push(await testGetMeNoToken());

  const passed = results.filter(r => r).length;
  const total = results.length;

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  console.log('='.repeat(50));

  if (passed === total) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Please review the output above.');
  }
}

runTests();
