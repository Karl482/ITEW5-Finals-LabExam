import { useParams, Link } from 'react-router-dom';
import './TaskDetailPage.css';

function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page task-detail-page">
      <div className="page-container">
        <h2>🎯 Play Card - Task #{id}</h2>
        <p className="page-description">View and edit task details</p>
        
        <div className="placeholder-content">
          <p>Task detail form will be implemented here</p>
          <ul>
            <li>Task title input</li>
            <li>Task description textarea</li>
            <li>Status dropdown</li>
            <li>Priority selector</li>
            <li>Due date picker</li>
            <li>Save button</li>
            <li>Delete button</li>
          </ul>
        </div>

        <div className="page-footer">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailPage;
