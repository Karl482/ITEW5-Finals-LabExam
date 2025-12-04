/**
 * E2E Test Runner with Prerequisites Check
 * Validates environment before running tests
 */

import axios from 'axios';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = 'http://localhost:5000/api';
const CLIENT_URL = 'http://localhost:5173';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkServer() {
  log('\n🔍 Checking if server is running...', 'cyan');
  try {
    await axios.get(`${API_URL}/auth/me`, {
      validateStatus: () => true // Accept any status
    });
    log('✅ Server is running on http://localhost:5000', 'green');
    return true;
  } catch (error) {
    log('❌ Server is not running on http://localhost:5000', 'red');
    return false;
  }
}

async function checkClient() {
  log('\n🔍 Checking if client is running...', 'cyan');
  try {
    await axios.get(CLIENT_URL, {
      timeout: 3000
    });
    log('✅ Client is running on http://localhost:5173', 'green');
    return true;
  } catch (error) {
    log('⚠️  Client is not running (optional for automated tests)', 'yellow');
    log('   Some tests will be skipped. Start client for full coverage.', 'yellow');
    return false;
  }
}

function printInstructions() {
  log('\n' + '='.repeat(60), 'yellow');
  log('📋 PREREQUISITES NOT MET', 'yellow');
  log('='.repeat(60), 'yellow');
  
  log('\nTo run the E2E tests, you need to start the servers:', 'yellow');
  
  log('\n🔧 Option 1: Start both servers with one command', 'cyan');
  log('   npm run dev', 'white');
  
  log('\n🔧 Option 2: Start servers separately', 'cyan');
  log('   Terminal 1: cd server && npm run dev', 'white');
  log('   Terminal 2: cd client && npm run dev', 'white');
  
  log('\n📝 After servers are running, run this script again:', 'cyan');
  log('   node run-e2e-tests.js', 'white');
  
  log('\n' + '='.repeat(60), 'yellow');
}

async function runTests() {
  log('╔' + '═'.repeat(58) + '╗', 'blue');
  log('║' + ' '.repeat(58) + '║', 'blue');
  log('║  🧪 E2E TEST RUNNER - Sports PWA Task Manager  '.padEnd(59) + '║', 'blue');
  log('║' + ' '.repeat(58) + '║', 'blue');
  log('╚' + '═'.repeat(58) + '╝', 'blue');

  // Check prerequisites
  const serverRunning = await checkServer();
  const clientRunning = await checkClient();

  if (!serverRunning) {
    printInstructions();
    process.exit(1);
  }

  log('\n✅ Prerequisites met! Starting E2E tests...', 'green');
  log('='.repeat(60), 'cyan');

  // Run the actual E2E tests
  return new Promise((resolve, reject) => {
    const testProcess = spawn('node', ['test-e2e.js'], {
      stdio: 'inherit',
      shell: true
    });

    testProcess.on('close', (code) => {
      if (code === 0) {
        log('\n✅ E2E tests completed successfully!', 'green');
        resolve();
      } else {
        log('\n❌ E2E tests failed. Check output above for details.', 'red');
        reject(new Error(`Tests failed with exit code ${code}`));
      }
    });

    testProcess.on('error', (error) => {
      log(`\n❌ Error running tests: ${error.message}`, 'red');
      reject(error);
    });
  });
}

// Run the test runner
runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
