// ScheduleToday.jsx
import React, { useState, useEffect } from "react";
import { classSchedules } from "./sampledata";

const ScheduleToday = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [filter, setFilter] = useState("all");

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const selectedClasses = classSchedules.filter(
    (item) => item.date === selectedDate
  );

  const getClassStatus = (startTime, endTime) => {
    const now = currentTime;
    const todayStr = now.toISOString().split("T")[0];
    
    if (selectedDate !== todayStr) return "scheduled";
    
    const currentTimeStr = now.toTimeString().slice(0, 5);
    
    if (currentTimeStr < startTime) return "upcoming";
    if (currentTimeStr >= startTime && currentTimeStr <= endTime) return "ongoing";
    return "completed";
  };

  const getStatusBadge = (status) => {
    const badges = {
      ongoing: "bg-success",
      upcoming: "bg-primary", 
      completed: "bg-secondary",
      scheduled: "bg-info"
    };
    
    const labels = {
      ongoing: "🔴 Live Now",
      upcoming: "⏰ Upcoming",
      completed: "✅ Completed", 
      scheduled: "📅 Scheduled"
    };
    
    return (
      <span className={`badge ${badges[status]} ms-2`}>
        {labels[status]}
      </span>
    );
  };

  const filteredClasses = selectedClasses.filter(cls => {
    if (filter === "all") return true;
    return getClassStatus(cls.startTime, cls.endTime) === filter;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const getNextClass = () => {
    const now = currentTime.toTimeString().slice(0, 5);
    const todayStr = currentTime.toISOString().split("T")[0];
    
    return classSchedules
      .filter(cls => cls.date === todayStr && cls.startTime > now)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
  };

  const nextClass = getNextClass();

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="mb-3">� Class Schedule</h2>
          <p className="text-muted">
            Current time: {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="col-md-4">
          {nextClass && (
            <div className="alert alert-warning">
              <strong>Next Class:</strong> {nextClass.subject}<br/>
              <small>Starts at {nextClass.startTime} in {nextClass.room}</small>
            </div>
          )}
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="dateSelect" className="form-label">Select Date:</label>
          <input
            type="date"
            id="dateSelect"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="filterSelect" className="form-label">Filter by Status:</label>
          <select
            id="filterSelect"
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Classes</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      <h3 className="mb-3">
        Classes for {formatDate(selectedDate)}
        {getStatusBadge("scheduled")}
      </h3>

      {filteredClasses.length === 0 ? (
        <div className="alert alert-info">
          {selectedClasses.length === 0 
            ? "No classes scheduled for this date." 
            : `No ${filter} classes for this date.`}
        </div>
      ) : (
        <div className="row">
          {filteredClasses
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((cls) => {
              const status = getClassStatus(cls.startTime, cls.endTime);
              return (
                <div className="col-md-6 col-lg-4 mb-4" key={cls._id}>
                  <div className={`card shadow-sm h-100 ${status === 'ongoing' ? 'border-success border-2' : ''}`}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="card-title mb-0">{cls.subject}</h6>
                      {getStatusBadge(status)}
                    </div>
                    <div className="card-body">
                      <p className="card-text">
                        <strong>👨‍🏫 Instructor:</strong> {cls.instructor} <br />
                        <strong>⏰ Time:</strong> {cls.startTime} - {cls.endTime} <br />
                        <strong>🏫 Room:</strong> {cls.room}<br />
                        {cls.description && (
                          <>
                            <strong>📝 Description:</strong> {cls.description}
                          </>
                        )}
                      </p>
                      {status === 'upcoming' && (
                        <div className="alert alert-light py-2">
                          <small>
                            Starts in: {Math.ceil((new Date(`${selectedDate}T${cls.startTime}`) - currentTime) / (1000 * 60))} minutes
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ScheduleToday;
