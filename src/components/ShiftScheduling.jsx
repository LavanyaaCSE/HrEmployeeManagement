import React, { useEffect, useState } from "react";

const ShiftScheduling = () => {
  const [employees, setEmployees] = useState([]); // To store employees fetched from the backend
  const [scheduledShifts, setScheduledShifts] = useState([]); // To store scheduled shifts

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

  // Handle editing shift details for each employee
  const handleShiftChange = (e, employeeId) => {
    const { name, value } = e.target;

    setScheduledShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift.employeeId === employeeId
          ? { ...shift, [name]: value } // Update the shift for the specific employee
          : shift
      )
    );
  };

  // Handle scheduling shift for an employee (move from employees list to scheduled shifts list)
  const scheduleShift = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    const shift = {
      id: scheduledShifts.length + 1,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      role: employee.role,
      shiftStartTime: "09:00",
      shiftEndTime: "17:00",
      shiftType: "Morning",
    };

    // Remove the employee from the employees list
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
    // Add the employee to the scheduled shifts list
    setScheduledShifts([...scheduledShifts, shift]);
  };

  // Handle deleting a scheduled shift (move from scheduled shifts list back to employees list)
  const handleDelete = (id) => {
    const shiftToDelete = scheduledShifts.find((shift) => shift.id === id);
    
    // Remove the shift from the scheduled list
    const updatedShifts = scheduledShifts.filter((shift) => shift.id !== id);
    
    // Add the deleted shift back to the employees list
    setScheduledShifts(updatedShifts);
    setEmployees([
      ...employees,
      {
        id: shiftToDelete.employeeId,
        name: shiftToDelete.employeeName,
        department: shiftToDelete.department,
        role: shiftToDelete.role,
      },
    ]);
  };

  return (
    <div className="shift-container">
      {/* Employees Table */}
      <h3>Employees</h3>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Shift Start Time</th>
            <th>Shift End Time</th>
            <th>Shift Type</th>
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
                <input
                  type="time"
                  name="shiftStartTime"
                  onChange={(e) => handleShiftChange(e, employee.id)}
                />
              </td>
              <td>
                <input
                  type="time"
                  name="shiftEndTime"
                  onChange={(e) => handleShiftChange(e, employee.id)}
                />
              </td>
              <td>
                <select
                  name="shiftType"
                  onChange={(e) => handleShiftChange(e, employee.id)}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              </td>
              <td>
                <button onClick={() => scheduleShift(employee.id)}>
                  Schedule Shift
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Scheduled Shifts Table */}
      <h3>Scheduled Shifts</h3>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Shift Start Time</th>
            <th>Shift End Time</th>
            <th>Shift Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {scheduledShifts.map((shift) => (
            <tr key={shift.id}>
              <td>{shift.employeeName}</td>
              <td>{shift.department}</td>
              <td>{shift.role}</td>
              <td>{shift.shiftStartTime}</td>
              <td>{shift.shiftEndTime}</td>
              <td>{shift.shiftType}</td>
              <td>
                <button onClick={() => handleDelete(shift.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftScheduling;
