// ScheduleForm.jsx
import React, { useState, useEffect } from "react";
import { useAPIAction } from "./hooks/useAPI";
import { scheduleAPI } from "./services/api";

const ScheduleForm = ({ schedule = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: "",
    instructor: "",
    date: new Date().toISOString().split('T')[0], // Default to today
    startTime: "09:00",
    endTime: "10:30",
    room: "",
    description: "",
    credits: 3,
    department: "",
    capacity: 30,
    status: "active"
  });

  const { execute, loading, error } = useAPIAction();

  // Populate form when editing
  useEffect(() => {
    if (schedule) {
      const scheduleDate = schedule.date.split('T')[0]; // Extract date part
      setFormData({
        subject: schedule.subject || "",
        instructor: schedule.instructor || "",
        date: scheduleDate,
        startTime: schedule.startTime || "",
        endTime: schedule.endTime || "",
        room: schedule.room || "",
        description: schedule.description || "",
        credits: schedule.credits || 3,
        department: schedule.department || "",
        capacity: schedule.capacity || 30,
        status: schedule.status || "active"
      });
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!validateTime()) {
      return;
    }
    
    // Ensure all required fields are filled
    const requiredFields = ['subject', 'instructor', 'date', 'startTime', 'endTime', 'room', 'department'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      credits: parseInt(formData.credits) || 3,
      capacity: parseInt(formData.capacity) || 30,
      // Ensure strings are trimmed
      subject: formData.subject.trim(),
      instructor: formData.instructor.trim(),
      room: formData.room.trim(),
      department: formData.department.trim(),
      description: formData.description.trim()
    };
    
    console.log('Submitting data:', submitData); // Debug log
    
    try {
      let result;
      if (schedule) {
        // Update existing schedule
        result = await execute(() => scheduleAPI.update(schedule._id, submitData));
      } else {
        // Create new schedule
        result = await execute(() => scheduleAPI.create(submitData));
      }
      
      if (result) {
        onSuccess && onSuccess(result);
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const validateTime = () => {
    if (formData.startTime && formData.endTime) {
      return formData.startTime < formData.endTime;
    }
    return true;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          {schedule ? "Edit Schedule" : "Add New Schedule"}
        </h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger">
            <strong>Validation Error:</strong>
            <br />
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="subject" className="form-label">Subject *</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g., Mathematics, English"
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="instructor" className="form-label">Instructor *</label>
              <input
                type="text"
                className="form-control"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                placeholder="e.g., Dr. Smith"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="date" className="form-label">Date *</label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-4 mb-3">
              <label htmlFor="startTime" className="form-label">Start Time *</label>
              <input
                type="time"
                className="form-control"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-4 mb-3">
              <label htmlFor="endTime" className="form-label">End Time *</label>
              <input
                type="time"
                className={`form-control ${!validateTime() ? 'is-invalid' : ''}`}
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
              {!validateTime() && (
                <div className="invalid-feedback">
                  End time must be after start time
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="room" className="form-label">Room *</label>
              <input
                type="text"
                className="form-control"
                id="room"
                name="room"
                value={formData.room}
                onChange={handleChange}
                required
                placeholder="e.g., Room 101, Lab 202"
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="department" className="form-label">Department *</label>
              <input
                type="text"
                className="form-control"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="e.g., Mathematics, Science"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="credits" className="form-label">Credits *</label>
              <input
                type="number"
                className="form-control"
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                min="1"
                max="6"
                required
              />
            </div>
            
            <div className="col-md-4 mb-3">
              <label htmlFor="capacity" className="form-label">Capacity *</label>
              <input
                type="number"
                className="form-control"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="500"
                required
              />
            </div>
            
            <div className="col-md-4 mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                className="form-control"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of the class content..."
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !validateTime()}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {schedule ? "Updating..." : "Creating..."}
                </>
              ) : (
                schedule ? "Update Schedule" : "Create Schedule"
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
