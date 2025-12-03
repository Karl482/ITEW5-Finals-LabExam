import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>⚽ Sports Task Manager</h1>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/login" className={isActive('/login')}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className={isActive('/register')}>
              Register
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={isActive('/dashboard')}>
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
