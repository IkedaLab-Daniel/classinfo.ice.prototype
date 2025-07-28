// InstructorDirectory.jsx
import React, { useState, useEffect } from "react";
import { useInstructors, useDepartments, useSchedules } from "./hooks/useAPI";
import { instructors, classSchedules, departments } from "./sampledata"; // Fallback data

const InstructorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Fetch data from API
  const { data: instructorsResponse, loading: instructorsLoading, error: instructorsError } = useInstructors();
  const { data: departmentsResponse, loading: departmentsLoading } = useDepartments();
  const { data: schedulesResponse, loading: schedulesLoading } = useSchedules();

  // Use API data if available, otherwise fall back to sample data
  const instructorsData = instructorsResponse?.data || instructors;
  const departmentsData = departmentsResponse?.data || departments;
  const allSchedules = schedulesResponse?.data || classSchedules;

  const getInstructorClasses = (instructorName) => {
    return allSchedules.filter(cls => cls.instructor === instructorName);
  };

  const getUpcomingClasses = (instructorName) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    return allSchedules.filter(cls => 
      cls.instructor === instructorName && 
      (cls.date > today || (cls.date === today && cls.startTime > currentTime))
    ).sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const filteredInstructors = instructorsData.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || instructor.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      weekday: "short" 
    });
  };

  // Loading state - only show if we don't have fallback data
  if ((instructorsLoading || departmentsLoading || schedulesLoading) && instructorsData.length === 0) {
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
      {instructorsError && (
        <div className="alert alert-warning alert-dismissible" role="alert">
          <strong>Note:</strong> Using offline data. Server connection failed: {instructorsError}
        </div>
      )}
      
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="mb-3">👨‍🏫 Instructor Directory</h2>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="searchInput" className="form-label">Search Instructors:</label>
          <input
            type="text"
            id="searchInput"
            className="form-control"
            placeholder="Search by name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="departmentSelect" className="form-label">Filter by Department:</label>
          <select
            id="departmentSelect"
            className="form-control"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departmentsData.map(dept => (
              <option key={dept.name || dept} value={dept.name || dept}>
                {dept.name || dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredInstructors.length === 0 ? (
        <div className="alert alert-info">
          No instructors found matching your search criteria.
        </div>
      ) : (
        <div className="row">
          {filteredInstructors.map((instructor) => {
            const instructorClasses = getInstructorClasses(instructor.name);
            const upcomingClasses = getUpcomingClasses(instructor.name);
            
            return (
              <div className="col-md-6 col-lg-4 mb-4" key={instructor.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">{instructor.name}</h5>
                    <small>{instructor.department}</small>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <p className="card-text">
                        <strong>📧 Email:</strong> 
                        <a href={`mailto:${instructor.email}`} className="text-decoration-none">
                          {instructor.email}
                        </a><br />
                        <strong>🏢 Office:</strong> {instructor.office}
                      </p>
                    </div>

                    <div className="mb-3">
                      <h6 className="fw-bold">📊 Statistics:</h6>
                      <div className="row text-center">
                        <div className="col-6">
                          <div className="border rounded p-2">
                            <div className="fw-bold text-primary">{instructorClasses.length}</div>
                            <small>Total Classes</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="border rounded p-2">
                            <div className="fw-bold text-success">{upcomingClasses.length}</div>
                            <small>Upcoming</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {upcomingClasses.length > 0 && (
                      <div>
                        <h6 className="fw-bold">🔜 Next Classes:</h6>
                        <div className="list-group list-group-flush">
                          {upcomingClasses.slice(0, 3).map((cls) => (
                            <div key={cls._id} className="list-group-item px-0 py-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="fw-bold text-truncate">{cls.subject}</div>
                                  <small className="text-muted">
                                    {formatDate(cls.date)} • {cls.startTime}
                                  </small>
                                </div>
                                <small className="text-muted">{cls.room}</small>
                              </div>
                            </div>
                          ))}
                          {upcomingClasses.length > 3 && (
                            <div className="list-group-item px-0 py-1 text-center">
                              <small className="text-muted">
                                +{upcomingClasses.length - 3} more classes
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="row mt-5">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5>📈 Department Overview</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {departments.map(dept => {
                  const deptInstructors = instructors.filter(inst => inst.department === dept);
                  const deptClasses = classSchedules.filter(cls => 
                    deptInstructors.some(inst => inst.name === cls.instructor)
                  );
                  
                  return (
                    <div key={dept} className="col-md-4 col-lg-3 mb-3">
                      <div className="border rounded p-3 text-center">
                        <h6 className="fw-bold">{dept}</h6>
                        <div className="text-muted">
                          <div>{deptInstructors.length} instructors</div>
                          <div>{deptClasses.length} classes</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDirectory;
