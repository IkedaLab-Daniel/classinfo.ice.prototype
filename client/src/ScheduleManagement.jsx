// ScheduleManagement.jsx
import React, { useState } from "react";
import { useSchedules, useAPIAction } from "./hooks/useAPI";
import { scheduleAPI } from "./services/api";
import ScheduleForm from "./ScheduleForm";

const ScheduleManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const { data: schedulesResponse, loading, error, refetch } = useSchedules();
  const { execute: deleteSchedule, loading: deleteLoading } = useAPIAction();

  const schedules = schedulesResponse?.data || [];

  // Filter schedules based on search and filters
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !filterDate || schedule.date.split('T')[0] === filterDate;
    
    const matchesDepartment = !filterDepartment || 
      schedule.department.toLowerCase().includes(filterDepartment.toLowerCase());
    
    return matchesSearch && matchesDate && matchesDepartment;
  });

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = async (scheduleId, subjectName) => {
    if (window.confirm(`Are you sure you want to delete the "${subjectName}" schedule?`)) {
      try {
        await deleteSchedule(() => scheduleAPI.delete(scheduleId));
        refetch(); // Refresh the list
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSchedule(null);
    refetch(); // Refresh the list
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSchedule(null);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      weekday: "short",
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-success",
      cancelled: "bg-danger",
      completed: "bg-secondary"
    };
    
    return (
      <span className={`badge ${badges[status] || 'bg-info'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
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
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="mb-3">📅 Schedule Management</h2>
          <p className="text-muted">Manage class schedules - Add, Edit, and Delete</p>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            disabled={showForm}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add New Schedule
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          <strong>Note:</strong> Unable to connect to server. Some operations may not work.
        </div>
      )}

      {showForm && (
        <div className="mb-4">
          <ScheduleForm
            schedule={editingSchedule}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="searchInput" className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                id="searchInput"
                placeholder="Search by subject, instructor, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="col-md-4 mb-3">
              <label htmlFor="filterDate" className="form-label">Filter by Date</label>
              <input
                type="date"
                className="form-control"
                id="filterDate"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            
            <div className="col-md-4 mb-3">
              <label htmlFor="filterDepartment" className="form-label">Filter by Department</label>
              <input
                type="text"
                className="form-control"
                id="filterDepartment"
                placeholder="e.g., Mathematics, Science..."
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              />
            </div>
          </div>
          
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              setSearchTerm("");
              setFilterDate("");
              setFilterDepartment("");
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Schedules List */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Class Schedules ({filteredSchedules.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {filteredSchedules.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted mb-0">
                {schedules.length === 0 
                  ? "No schedules found. Click 'Add New Schedule' to create one."
                  : "No schedules match your filters."
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Subject</th>
                    <th>Instructor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule._id}>
                      <td>
                        <div>
                          <strong>{schedule.subject}</strong>
                          {schedule.description && (
                            <>
                              <br />
                              <small className="text-muted">{schedule.description}</small>
                            </>
                          )}
                        </div>
                      </td>
                      <td>{schedule.instructor}</td>
                      <td>{formatDate(schedule.date)}</td>
                      <td>
                        {schedule.startTime} - {schedule.endTime}
                        <br />
                        <small className="text-muted">{schedule.credits} credits</small>
                      </td>
                      <td>{schedule.room}</td>
                      <td>{schedule.department}</td>
                      <td>{getStatusBadge(schedule.status)}</td>
                      <td>
                        <div>
                          {schedule.enrolledStudents || 0}/{schedule.capacity || 0}
                          {schedule.isFull && (
                            <>
                              <br />
                              <small className="text-warning">Full</small>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEdit(schedule)}
                            disabled={showForm}
                            title="Edit Schedule"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(schedule._id, schedule.subject)}
                            disabled={deleteLoading || showForm}
                            title="Delete Schedule"
                          >
                            {deleteLoading ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
