import { useState, useEffect } from 'react'
import { 
  Users as UsersIcon, 
  Activity as ActivityIcon, 
  Map as MapIcon, 
  AlertTriangle as AlertTriangleIcon, 
  MapPin as MapPinIcon, 
  Clock as ClockIcon, 
  ShieldAlert as ShieldAlertIcon, 
  CheckCircle2 as CheckCircle2Icon, 
  Radio as RadioIcon,
  RadioReceiver as RadioReceiverIcon,
  BadgeAlert as BadgeAlertIcon,
  BellRing as BellRingIcon,
  X as XIcon,
  UserCheck as UserCheckIcon,
  HardHat as HardHatIcon,
  Stethoscope as StethoscopeIcon
} from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [toasts, setToasts] = useState([])
  
  // Real-time state simulation
  const [zones, setZones] = useState([
    { id: 'north-gate', name: 'North Gate', waitTime: 12, status: 'critical', trend: 'up' },
    { id: 'east-gate', name: 'East Gate', waitTime: 2, status: 'clear', trend: 'down' },
    { id: 'south-gate', name: 'South Gate', waitTime: 6, status: 'warning', trend: 'up' },
    { id: 'west-gate', name: 'West Gate', waitTime: 3, status: 'clear', trend: 'down' },
    { id: 'concession-a', name: 'Concession A', waitTime: 18, status: 'critical', trend: 'up' },
    { id: 'restroom-4', name: 'Restroom 4', waitTime: 5, status: 'warning', trend: 'stable' },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 'a1', zoneId: 'north-gate', type: 'congestion', message: 'Wait times exceeding 10 mins. Cross-traffic at scanning block 2.', level: 'critical' },
    { id: 'a2', zoneId: 'concession-a', type: 'congestion', message: 'Heavy throughput at Concession A. Approaching capacity limit.', level: 'critical' },
    { id: 'a3', zoneId: 'restroom-4', type: 'supply', message: 'Sensors indicate low supplies in concourse level 2 restroom.', level: 'warning' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => {
        const change = Math.floor(Math.random() * 3) - 1; 
        const newTime = Math.max(0, zone.waitTime + change);
        let newStatus = 'clear';
        if (newTime >= 5) newStatus = 'warning';
        if (newTime >= 10) newStatus = 'critical';
        return { ...zone, waitTime: newTime, status: newStatus };
      }))
    }, 5000) 
    return () => clearInterval(interval);
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDeployStaff = (alertId, zoneName, jobType) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    addToast(`${jobType} dispatched to ${zoneName}`, 'success');
  };

  const handleQuickDispatch = (jobType) => {
    addToast(`Global ${jobType} dispatch broadcast sent.`, 'info');
  };

  const totalWait = zones.reduce((acc, z) => acc + z.waitTime, 0);
  const avgWait = zones.length > 0 ? Math.round(totalWait / zones.length) : 0;

  // Render components based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-grid animate-fade-in">
            {/* Main Map Area */}
            <div className="map-section glass-panel">
              <div className="section-header">
                <div className="header-icon-title">
                  <MapIcon size={20} className="accent-icon" />
                  <h3>Live Venue Map</h3>
                </div>
                <div className="legend">
                  <span className="legend-item"><div className="color-dot clear"></div> Flowing</span>
                  <span className="legend-item"><div className="color-dot warning"></div> Busy</span>
                  <span className="legend-item"><div className="color-dot critical"></div> Congested</span>
                </div>
              </div>
              
              <div className="stadium-map">
                {zones.map(zone => (
                  <div key={zone.id} className={`zone ${zone.id} status-bg-${zone.status}`}>
                    <span className="zone-name">{zone.name}</span>
                    <div className="wait-time"><ClockIcon size={12}/> {zone.waitTime}m</div>
                  </div>
                ))}
                <div className="pitch"></div>
              </div>
            </div>

            {/* Side panels */}
            <div className="side-panels">
              {/* Active Alerts */}
              <div className="alerts-panel glass-panel">
                <div className="section-header">
                  <div className="header-icon-title">
                    <BellRingIcon size={20} className="accent-icon" />
                    <h3>Priority Alerts</h3>
                  </div>
                  {alerts.length > 0 && <span className="badge critical">{alerts.length} New</span>}
                </div>
                <div className="alert-list custom-scroll">
                  {alerts.length === 0 ? (
                    <div className="empty-state">
                      <CheckCircle2Icon size={32} />
                      <p>All zones clear. No active alerts.</p>
                    </div>
                  ) : (
                    alerts.map(a => {
                      const zone = zones.find(z => z.id === a.zoneId);
                      const zName = zone ? zone.name : 'Unknown Zone';
                      return (
                        <div key={a.id} className={`alert-card ${a.level}`}>
                          <div className="alert-icon">
                            {a.level === 'critical' ? <AlertTriangleIcon size={20} /> : <ShieldAlertIcon size={20} />}
                          </div>
                          <div className="alert-content">
                            <h4>{a.level === 'critical' ? 'Congestion' : 'Logistics'} at {zName}</h4>
                            <p>{a.message}</p>
                            <div className="alert-actions">
                              <button 
                                className="action-btn" 
                                onClick={() => handleDeployStaff(a.id, zName, a.level === 'critical' ? 'Security' : 'Janitorial')}
                              >
                                {a.level === 'critical' ? 'Deploy Security' : 'Dispatch Staff'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="actions-panel glass-panel">
                <div className="section-header">
                  <h3>Quick Dispatch Command</h3>
                </div>
                <div className="dispatch-grid">
                  <button className="dispatch-btn" onClick={() => handleQuickDispatch('Security Task Force')}>
                    <HardHatIcon size={24} />
                    <span>Security</span>
                  </button>
                  <button className="dispatch-btn" onClick={() => handleQuickDispatch('Medical Support')}>
                    <StethoscopeIcon size={24} />
                    <span>Medical</span>
                  </button>
                  <button className="dispatch-btn" onClick={() => handleQuickDispatch('Maintenance Crew')}>
                    <UserCheckIcon size={24} />
                    <span>Maintenance</span>
                  </button>
                  <button className="dispatch-btn emergency-btn" onClick={() => handleQuickDispatch('Emergency Protocol')}>
                    <AlertTriangleIcon size={24} />
                    <span>Evacuate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="full-map-view glass-panel animate-fade-in">
             <div className="section-header">
                <h2>Advanced Heatmap Intelligence</h2>
                <button className="action-btn" onClick={() => addToast('Map re-calibrated successfully.', 'success')}>Recalibrate Sensors</button>
              </div>
              <div className="stadium-map full-size">
                {zones.map(zone => (
                  <div key={`full-${zone.id}`} className={`zone ${zone.id} status-bg-${zone.status}`}>
                    <span className="zone-name">{zone.name}</span>
                    <div className="wait-time"><ClockIcon size={12}/> {zone.waitTime}m</div>
                  </div>
                ))}
                <div className="pitch"></div>
              </div>
          </div>
        );
      case 'staff':
        return (
          <div className="staff-view glass-panel animate-fade-in">
            <div className="section-header">
              <h2>Active Staff Roster</h2>
              <button 
                className="action-btn primary"
                onClick={() => addToast('Pinging all staff units for roll call.', 'info')}
              >
                Ping All Units
              </button>
            </div>
            <div className="staff-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="staff-card">
                  <div className="staff-avatar"><UserCheckIcon size={24} /></div>
                  <div className="staff-info">
                    <h4>Unit Alpha-{i}</h4>
                    <p>Status: <span className="status-clear">• Active</span></p>
                    <p className="staff-zone">Location: {zones[i-1]?.name || 'Roaming'}</p>
                  </div>
                  <button 
                    className="small-btn" 
                    onClick={() => addToast(`Reassigned Unit Alpha-${i} to new sector.`, 'success')}
                  >
                    Reassign
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="alerts-full-view glass-panel animate-fade-in">
            <div className="section-header">
              <h2>Incident Log</h2>
              <button className="action-btn" onClick={() => { setAlerts([]); addToast('All incidents marked as resolved.', 'success'); }}>Clear All</button>
            </div>
            <div className="full-alert-list">
              {alerts.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle2Icon size={48} />
                  <h3>No Active Incidents</h3>
                  <p>All operations are running smoothly.</p>
                </div>
              ) : (
                alerts.map(a => {
                  const zone = zones.find(z => z.id === a.zoneId);
                  const zName = zone ? zone.name : 'Unknown Zone';
                  return (
                    <div key={`full-${a.id}`} className={`alert-list-item ${a.level}`}>
                      <div className="alert-icon">
                         {a.level === 'critical' ? <AlertTriangleIcon size={24} /> : <ShieldAlertIcon size={24} />}
                      </div>
                      <div className="alert-details">
                        <h4>{a.level === 'critical' ? 'Congestion Warning' : 'Logistical Issue'}</h4>
                        <p>{a.message}</p>
                        <span className="alert-meta">Location: {zName} | Time: {currentTime.toLocaleTimeString()}</span>
                      </div>
                      <button 
                        className="action-btn" 
                        onClick={() => handleDeployStaff(a.id, zName, 'Response Team')}
                      >
                        Resolve Issue
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="app-container">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type} animate-slide-in-right`}>
            {toast.type === 'success' ? <CheckCircle2Icon size={18} /> : <AlertTriangleIcon size={18} />}
             <span>{toast.message}</span>
            <button className="toast-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
              <XIcon size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <RadioIcon size={28} className="logo-icon" />
          </div>
          <div className="brand-text">
            <h2>NEXUS</h2>
            <span className="brand-subtitle">Venue Intelligence</span>
          </div>
        </div>

        <nav className="nav-menu">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <ActivityIcon size={20} />
            <span>Live Overview</span>
          </button>
          <button className={`nav-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            <MapIcon size={20} />
            <span>Heatmap Int.</span>
          </button>
          <button className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>
            <UsersIcon size={20} />
            <span>Staff Deploy</span>
          </button>
          <button className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
            <div className="nav-icon-wrapper">
              <BadgeAlertIcon size={20} />
              {alerts.length > 0 && <span className="nav-badge">{alerts.length}</span>}
            </div>
            <span>Incidents</span>
          </button>
        </nav>

        <div className="system-status">
          <div className="status-indicator online"></div>
          <span>Systems Nominal</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-title">
            <h1>San Mamés Stadium</h1>
            <p>Operations & Logistics Hub</p>
          </div>
          
          <div className="global-metrics glass-panel">
            <div className="metric">
              <span className="metric-label">Total Attendance</span>
              <span className="metric-value">54,082</span>
              <span className="metric-trend positive">+12%</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric">
              <span className="metric-label">Avg Zone Wait</span>
              <span className="metric-value">{avgWait}m</span>
              <span className="metric-trend indicator">Live</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric">
              <span className="metric-label">Active Staff</span>
              <span className="metric-value">342</span>
            </div>
            <div className="metric-divider"></div>
            <div className="time-display">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' })}
            </div>
          </div>
        </header>

        {renderContent()}

      </main>
    </div>
  )
}

export default App
