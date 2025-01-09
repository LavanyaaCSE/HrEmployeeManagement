import React, { useState } from "react";
import axios from "axios";

const departments = ["HR", "Engineering", "Marketing", "Sales"];

const UpdateEmployeeForm = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    department: "",
    dateOfJoining: "",
    role: "",
    status: "Active",  // Default value set to "Active"
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of Joining is required.";
    if (new Date(formData.dateOfJoining) > new Date()) newErrors.dateOfJoining = "Date cannot be in the future.";
    if (!formData.role) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.put(`http://localhost:5000/api/employees/update/${employeeId}`, formData);
      setFeedback("Employee updated successfully!");
      setFormData({ name: "", email: "", phoneNumber: "", department: "", dateOfJoining: "", role: "", status: "Active" });
      setEmployeeId("");
      setErrors({});
    } catch (error) {
      setFeedback(error.response?.data?.message || "Failed to update employee.");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="enhanced-form-container">
      <h1 className="enhanced-form-title">Update Employee</h1>

      <div className="enhanced-form-group">
        <input
          type="text"
          name="employeeId"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Employee ID (to update)"
          className="enhanced-form-input"
        />
        {errors.employeeId && <p className="enhanced-form-error">{errors.employeeId}</p>}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="enhanced-form-input"
        />
        {errors.name && <p className="enhanced-form-error">{errors.name}</p>}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="enhanced-form-input"
        />
        {errors.email && <p className="enhanced-form-error">{errors.email}</p>}

        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="enhanced-form-input"
        />
        {errors.phoneNumber && <p className="enhanced-form-error">{errors.phoneNumber}</p>}

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="enhanced-form-input"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        {errors.department && <p className="enhanced-form-error">{errors.department}</p>}

        <input
          type="date"
          name="dateOfJoining"
          value={formData.dateOfJoining}
          onChange={handleChange}
          className="enhanced-form-input"
        />
        {errors.dateOfJoining && <p className="enhanced-form-error">{errors.dateOfJoining}</p>}

        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          className="enhanced-form-input"
        />
        {errors.role && <p className="enhanced-form-error">{errors.role}</p>}

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="enhanced-form-input"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        {errors.status && <p className="enhanced-form-error">{errors.status}</p>}
      </div>

      <div className="enhanced-form-actions">
        <button type="submit" className="enhanced-form-button">Update</button>
        <button
          type="reset"
          onClick={() => {
            setFormData({ name: "", email: "", phoneNumber: "", department: "", dateOfJoining: "", role: "", status: "Active" });
            setEmployeeId("");
          }}
          className="enhanced-form-button reset"
        >
          Reset
        </button>
      </div>

      {feedback && <p className="enhanced-form-feedback">{feedback}</p>}
    </form>
  );
};

export default UpdateEmployeeForm;
