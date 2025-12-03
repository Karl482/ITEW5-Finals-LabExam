import { Link } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  return (
    <div className="page register-page">
      <div className="page-container">
        <h2>🏆 Team Signup</h2>
        <p className="page-description">Create your account to start managing tasks</p>
        
        <div className="placeholder-content">
          <p>Registration form will be implemented here</p>
          <ul>
            <li>Username input</li>
            <li>Email input</li>
            <li>Password input</li>
            <li>Confirm password input</li>
            <li>Register button</li>
          </ul>
        </div>

        <div className="page-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
