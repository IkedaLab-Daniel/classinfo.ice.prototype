// WeeklySchedule.jsx
import React, { useState } from "react";
import { useWeeklySchedules } from "./hooks/useAPI";
import { classSchedules } from "./sampledata"; // Fallback data

const WeeklySchedule = () => {
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const today = new Date();
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    return monday.toISOString().split("T")[0];
  });

  const getWeekDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate + "T00:00:00");
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedWeek);
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Get end date for the week
  const endDate = weekDates[weekDates.length - 1];
  
  // Fetch weekly schedules
  const { data: weeklyResponse, loading, error } = useWeeklySchedules(selectedWeek, endDate);
  
  // Use API data if available, otherwise fall back to sample data
  const weeklySchedules = weeklyResponse?.data || classSchedules.filter(
    cls => cls.date >= selectedWeek && cls.date <= endDate
  );

  const getClassesForDate = (date) => {
    return weeklySchedules
      .filter(cls => cls.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const navigateWeek = (direction) => {
    const currentWeek = new Date(selectedWeek + "T00:00:00");
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setSelectedWeek(newWeek.toISOString().split("T")[0]);
  };

  // Loading state - only show if we don't have fallback data
  if (loading && weeklySchedules.length === 0) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {error && (
        <div className="alert alert-warning alert-dismissible" role="alert">
          <strong>Note:</strong> Using offline data. Server connection failed: {error}
        </div>
      )}
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="mb-3">📅 Weekly Schedule</h2>
        </div>
        <div className="col-md-4">
          <div className="btn-group w-100">
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigateWeek(-1)}
            >
              ← Previous Week
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigateWeek(1)}
            >
              Next Week →
            </button>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
          />
          <small className="text-muted">Select any date to view that week</small>
        </div>
      </div>

      <div className="row">
        {weekDates.map((date, index) => {
          const dayClasses = getClassesForDate(date);
          const isToday = date === new Date().toISOString().split("T")[0];
          
          return (
            <div key={date} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className={`card h-100 ${isToday ? 'border-primary border-2' : ''}`}>
                <div className={`card-header text-center ${isToday ? 'bg-primary text-white' : 'bg-light'}`}>
                  <h6 className="mb-0">
                    {dayNames[index]} 
                    {isToday && <span className="badge bg-warning text-dark ms-2">Today</span>}
                  </h6>
                  <small>{formatDate(date)}</small>
                </div>
                <div className="card-body p-2">
                  {dayClasses.length === 0 ? (
                    <p className="text-muted text-center mb-0">
                      <small>No classes</small>
                    </p>
                  ) : (
                    dayClasses.map((cls) => (
                      <div key={cls._id} className="mb-2 p-2 border rounded bg-light">
                        <div className="fw-bold text-truncate" title={cls.subject}>
                          {cls.subject}
                        </div>
                        <small className="text-muted">
                          {cls.startTime} - {cls.endTime}<br/>
                          {cls.room}<br/>
                          <em>{cls.instructor}</em>
                        </small>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row mt-4">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5>📊 Week Summary</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="text-center">
                    <h4 className="text-primary">
                      {weekDates.reduce((total, date) => total + getClassesForDate(date).length, 0)}
                    </h4>
                    <small>Total Classes</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h4 className="text-success">
                      {weekDates.filter(date => getClassesForDate(date).length > 0).length}
                    </h4>
                    <small>Days with Classes</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h4 className="text-info">
                      {Math.max(...weekDates.map(date => getClassesForDate(date).length))}
                    </h4>
                    <small>Busiest Day</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h4 className="text-warning">
                      {new Set(
                        weekDates.flatMap(date => 
                          getClassesForDate(date).map(cls => cls.instructor)
                        )
                      ).size}
                    </h4>
                    <small>Instructors</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;
