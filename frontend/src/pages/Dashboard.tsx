import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Dashboard.css';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const modules = [
    { name: 'Ingredients', path: '/ingredients', icon: '🌾', description: 'Manage raw ingredients and supplies' },
    { name: 'Stock', path: '/stock', icon: '🥃', description: 'Track distilled products and inventory' },
    { name: 'Customers', path: '/customers', icon: '👥', description: 'Customer relationship management' },
    { name: 'Orders', path: '/orders', icon: '📦', description: 'Process and track orders' },
    { name: 'Reports', path: '/reports', icon: '📊', description: 'View customer purchase reports' },
  ];

  return (
    <div className="dashboard-content">
      <h1>Welcome, {user?.firstName}!</h1>
      <p className="welcome-text">Select a module to get started</p>

      <div className="modules-grid">
        {modules.map((module) => (
          <Link key={module.path} to={module.path} className="module-card">
            <div className="module-icon">{module.icon}</div>
            <h3>{module.name}</h3>
            <p>{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
