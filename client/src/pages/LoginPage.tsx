import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  return (
    <div className="page login-page">
      <div className="page-container">
        <h2>🏟️ Stadium Entrance</h2>
        <p className="page-description">Login to access your task management dashboard</p>
        
        <div className="placeholder-content">
          <p>Login form will be implemented here</p>
          <ul>
            <li>Username/Email input</li>
            <li>Password input</li>
            <li>Login button</li>
            <li>Google OAuth button</li>
          </ul>
        </div>

        <div className="page-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
