// App.jsx
import React, { useState } from "react";
import Navigation from "./Navigation";
import ScheduleToday from "./ScheduleToday";
import WeeklySchedule from "./WeeklySchedule";
import InstructorDirectory from "./InstructorDirectory";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [activeTab, setActiveTab] = useState("schedule");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "schedule":
        return <ScheduleToday />;
      case "weekly":
        return <WeeklySchedule />;
      case "instructors":
        return <InstructorDirectory />;
      default:
        return <ScheduleToday />;
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pb-5">
        {renderActiveComponent()}
      </div>
      
      <footer className="bg-primary text-white py-3 mt-5">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-6">
              <h6>📚 ClassInfo System</h6>
              <p className="mb-0">
                <small>Manage your academic schedule efficiently</small>
              </p>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-center justify-content-md-end align-items-center">
                <small className="me-3">
                  Quick Stats: {new Date().toLocaleDateString()} 
                </small>
                <span className="badge bg-light text-primary">
                  📊 Enhanced
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
