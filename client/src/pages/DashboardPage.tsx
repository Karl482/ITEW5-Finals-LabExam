import { Link } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="page dashboard-page">
      <div className="page-container">
        <h2>📊 Game Plan Dashboard</h2>
        <p className="page-description">Manage your tasks and track your progress</p>
        
        <div className="placeholder-content">
          <p>Dashboard content will be implemented here</p>
          <ul>
            <li>Task list display</li>
            <li>Create task button</li>
            <li>Task filtering by status</li>
            <li>Real-time updates indicator</li>
            <li>Task cards with status and priority</li>
          </ul>
          
          <div className="sample-tasks">
            <h3>Sample Tasks:</h3>
            <div className="task-card-placeholder">
              <Link to="/tasks/1">Task 1 - Click to view details</Link>
            </div>
            <div className="task-card-placeholder">
              <Link to="/tasks/2">Task 2 - Click to view details</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
