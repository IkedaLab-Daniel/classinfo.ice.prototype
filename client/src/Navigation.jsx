// Navigation.jsx
import React from "react";

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "schedule", label: "📅 Daily Schedule", icon: "🏫" },
    { id: "weekly", label: "📊 Weekly View", icon: "📅" },
    { id: "instructors", label: "👨‍🏫 Instructors", icon: "👥" },
    { id: "management", label: "⚙️ Manage Schedules", icon: "⚙️" }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          🎓 ClassInfo System
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link btn btn-link ${activeTab === tab.id ? 'active fw-bold' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ 
                    border: 'none', 
                    color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.75)',
                    textDecoration: 'none'
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="navbar-text">
            <small>
              📅 {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
