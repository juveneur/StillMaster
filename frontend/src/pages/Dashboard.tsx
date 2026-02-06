import './Dashboard.css';

export default function Dashboard() {
  // Mock data - replace with real data from API
  const recentActivity = [
    { type: 'Delivery', status: 'in', label: 'Bulk liquid: 240 liters' },
    { type: 'Delivery', status: 'out', label: 'Casks: 412' },
    { type: 'Delivery', status: 'in', label: 'Pallets: 6' },
  ];

  const metrics = [
    { 
      title: 'Operational efficiency', 
      value: '86%', 
      icon: '📈',
      color: '#667eea',
      change: '+12%'
    },
    { 
      title: 'Temperature', 
      value: '21.3°C', 
      icon: '🌡️',
      color: '#1a1a1a',
      change: '+0.5°C'
    },
    { 
      title: 'Liquid production', 
      value: '158,935', 
      icon: '💧',
      color: '#667eea',
      change: '+2,450'
    },
  ];

  const tasks = [
    { name: 'Digorge', id: '321648', status: 'pending' },
    { name: 'Tanker', id: '297255', status: 'pending' },
    { name: 'Digorge', id: '137679', status: 'active' },
  ];

  const integrations = [
    { name: 'XERO', connected: true },
    { name: 'QuickBooks', connected: true },
    { name: 'NetSuite', connected: false },
  ];

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Overview</h1>
        <div className="date-selector">
          Today
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="top-cards-row">
        <div className="production-card">
          <div className="production-illustration">
            <div className="still-icon">🏭</div>
          </div>
          <div className="production-content">
            <h3>Start a production run</h3>
            <button className="start-btn">Start</button>
          </div>
        </div>

        <div className="activity-card">
          <h3>Recent activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-type">{activity.type}</span>
                <span className={`activity-status status-${activity.status}`}>
                  {activity.status.toUpperCase()}
                </span>
                <span className="activity-label">{activity.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <span className="metric-title">{metric.title}</span>
              <div className="metric-icon" style={{ backgroundColor: metric.color }}>
                {metric.icon}
              </div>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-chart">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                <path 
                  d="M 0 15 Q 25 10, 50 15 T 100 12" 
                  fill="none" 
                  stroke={metric.color} 
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Cards Row */}
      <div className="bottom-cards-row">
        <div className="tasks-card info-card">
          <div className="info-card-header">
            <span className="info-card-title">Tasks</span>
            <div className="info-card-icon">📋</div>
          </div>
          <div className="info-card-value">3/12</div>
          <div className="tasks-list">
            {tasks.map((task, index) => (
              <div key={index} className={`task-item ${task.status === 'active' ? 'active' : ''}`}>
                <span className="task-name">{task.name}</span>
                <span className="task-id">{task.id}</span>
                <svg className="task-check" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  {task.status === 'active' && <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="integrations-card info-card">
          <div className="info-card-header">
            <span className="info-card-title">Integrations</span>
            <div className="info-card-icon" style={{ backgroundColor: '#667eea' }}>🔗</div>
          </div>
          <div className="info-card-value">3/12</div>
          <div className="integrations-list">
            {integrations.map((integration, index) => (
              <div key={index} className="integration-item">
                <span className="integration-name">{integration.name}</span>
                <span className={`integration-status ${integration.connected ? 'connected' : 'disconnected'}`}>
                  {integration.connected ? 'Connected' : 'Connect'}
                </span>
                <svg className="integration-check" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  {integration.connected && <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="assets-card info-card">
          <div className="info-card-header">
            <span className="info-card-title">Assets</span>
            <div className="info-card-icon">📦</div>
          </div>
          <div className="info-card-value">68,396</div>
          <div className="assets-chart">
            <div className="bar" style={{ height: '40%', backgroundColor: '#333' }}></div>
            <div className="bar" style={{ height: '55%', backgroundColor: '#666' }}></div>
            <div className="bar" style={{ height: '85%', backgroundColor: '#667eea' }}></div>
            <div className="bar" style={{ height: '60%', backgroundColor: '#333' }}></div>
            <div className="bar" style={{ height: '70%', backgroundColor: '#666' }}></div>
            <div className="bar" style={{ height: '100%', backgroundColor: '#667eea' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
