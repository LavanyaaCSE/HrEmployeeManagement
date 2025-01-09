import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");

        // Check if the response contains 'employees' or the array directly
        const employeeData = response.data.employees || response.data; // If 'employees' key exists, use it, else fallback to the array
        
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="employee-list-container">
      <h1 className="title">Employee List</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th className="table-header">Employee ID</th>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Department</th>
            <th className="table-header">Role</th>
            <th className="table-header">Date of Joining</th>
            <th className="table-header">Birthdate</th>
            <th className="table-header">Gender</th>
            <th className="table-header">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.employeeId}>
                <td className="table-data">{employee.employeeId}</td>
                <td className="table-data">{employee.name}</td>
                <td className="table-data">{employee.email}</td>
                <td className="table-data">{employee.department}</td>
                <td className="table-data">{employee.role}</td>
                <td className="table-data">{employee.dateOfJoining}</td>
                <td className="table-data">
                  {employee.birthdate ? new Date(employee.birthdate).toLocaleDateString() : "N/A"}
                </td>
                <td className="table-data">{employee.gender || "N/A"}</td>
                <td className="table-data">{employee.status || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-data">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
