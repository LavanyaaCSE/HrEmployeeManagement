import React, { useEffect, useState } from "react";

const PerformanceManagement = () => {
  const [employees, setEmployees] = useState([]); // To store employees fetched from the backend
  const [performanceReviews, setPerformanceReviews] = useState([]); // To store performance reviews

  // Fetch employees from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/employees") // Replace with your backend API URL
      .then((response) => response.json())
      .then((data) => {
        setEmployees(
          data.employees.sort((a, b) =>
            a.department.localeCompare(b.department)
          ) // Sort employees by department
        );
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // Handle editing performance data for each employee
  const handlePerformanceChange = (e, employeeId) => {
    const { name, value } = e.target;

    setPerformanceReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.employeeId === employeeId
          ? { ...review, [name]: value } // Update the performance data for the specific employee
          : review
      )
    );
  };

  // Handle adding a performance review for an employee (move from employees list to performance reviews list)
  const addPerformanceReview = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    const review = {
      id: performanceReviews.length + 1,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      role: employee.role,
      performanceRating: "3", // Default performance rating
      feedback: "",
      goals: "",
    };

    // Remove the employee from the employees list
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
    // Add the employee to the performance reviews list
    setPerformanceReviews([...performanceReviews, review]);
  };

  // Handle deleting a performance review (move from performance reviews list back to employees list)
  const handleDeleteReview = (id) => {
    const reviewToDelete = performanceReviews.find((review) => review.id === id);

    // Remove the review from the performance reviews list
    const updatedReviews = performanceReviews.filter((review) => review.id !== id);

    // Add the deleted review back to the employees list
    setPerformanceReviews(updatedReviews);
    setEmployees([
      ...employees,
      {
        id: reviewToDelete.employeeId,
        name: reviewToDelete.employeeName,
        department: reviewToDelete.department,
        role: reviewToDelete.role,
      },
    ]);
  };

  return (
    <div className="performance-container">


      {/* Employees Table */}
      <h3>Employees</h3>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Performance Rating</th>
            <th>Feedback</th>
            <th>Goals</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.department}</td>
              <td>{employee.role}</td>
              <td>
                <select
                  name="performanceRating"
                  defaultValue="3"
                  onChange={(e) => handlePerformanceChange(e, employee.id)}
                >
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Below Average</option>
                  <option value="3">3 - Average</option>
                  <option value="4">4 - Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </td>
              <td>
                <textarea
                  name="feedback"
                  placeholder="Enter feedback"
                  onChange={(e) => handlePerformanceChange(e, employee.id)}
                />
              </td>
              <td>
                <textarea
                  name="goals"
                  placeholder="Enter goals"
                  onChange={(e) => handlePerformanceChange(e, employee.id)}
                />
              </td>
              <td>
                <button onClick={() => addPerformanceReview(employee.id)}>
                  Add Performance Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Performance Reviews Table */}
      <h3>Performance Reviews</h3>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Performance Rating</th>
            <th>Feedback</th>
            <th>Goals</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {performanceReviews.map((review) => (
            <tr key={review.id}>
              <td>{review.employeeName}</td>
              <td>{review.department}</td>
              <td>{review.role}</td>
              <td>{review.performanceRating}</td>
              <td>{review.feedback}</td>
              <td>{review.goals}</td>
              <td>
                <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceManagement;
