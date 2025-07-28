// InstructorDirectory.jsx
import React, { useState } from "react";
import { instructors, classSchedules, departments } from "./sampledata";

const InstructorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const getInstructorClasses = (instructorName) => {
    return classSchedules.filter(cls => cls.instructor === instructorName);
  };

  const getUpcomingClasses = (instructorName) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    return classSchedules.filter(cls => 
      cls.instructor === instructorName && 
      (cls.date > today || (cls.date === today && cls.startTime > currentTime))
    ).sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const filteredInstructors = instructors.filter(instructor => {
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

  return (
    <div className="container mt-5">
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
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
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
