import React, { useState } from "react";
import axios from "axios";

const departments = ["HR", "Engineering", "Marketing", "Sales"];
const genderOptions = ["Male", "Female", "Other"];
const statusOptions = ["Active", "Inactive"];

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    department: "",
    dateOfJoining: "",
    birthdate: "",
    gender: "",
    status: "Active", // Default to "Active"
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required.";
    if (!/^\w{1,10}$/.test(formData.employeeId)) newErrors.employeeId = "Employee ID must be alphanumeric and max 10 characters.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of Joining is required.";
    if (new Date(formData.dateOfJoining) > new Date()) newErrors.dateOfJoining = "Date cannot be in the future.";
    if (!formData.role) newErrors.role = "Role is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/employees/add", formData);
      setFeedback("Employee added successfully!");
      setFormData({
        name: "",
        employeeId: "",
        email: "",
        phoneNumber: "",
        department: "",
        dateOfJoining: "",
        birthdate: "",
        gender: "",
        status: "Active", // Default to "Active"
        role: "",
      });
      setErrors({});
    } catch (error) {
      setFeedback(error.response?.data?.message || "Failed to add employee.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="enhanced-form-container">
      <h1 className="enhanced-form-title">Add Employee</h1>
      <div className="enhanced-form-group">
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
          type="text"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="Employee ID"
          className="enhanced-form-input"
        />
        {errors.employeeId && <p className="enhanced-form-error">{errors.employeeId}</p>}

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
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          className="enhanced-form-input"
        />
        {errors.birthdate && <p className="enhanced-form-error">{errors.birthdate}</p>}

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="enhanced-form-input"
        >
          <option value="">Select Gender</option>
          {genderOptions.map((gender) => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>
        {errors.gender && <p className="enhanced-form-error">{errors.gender}</p>}

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="enhanced-form-input"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          className="enhanced-form-input"
        />
        {errors.role && <p className="enhanced-form-error">{errors.role}</p>}
      </div>
      <div className="enhanced-form-actions">
        <button type="submit" className="enhanced-form-button">Submit</button>
        <button
          type="reset"
          onClick={() => setFormData({
            name: "",
            employeeId: "",
            email: "",
            phoneNumber: "",
            department: "",
            dateOfJoining: "",
            birthdate: "",
            gender: "",
            status: "Active", // Default to "Active"
            role: "",
          })}
          className="enhanced-form-button reset"
        >
          Reset
        </button>
      </div>
      {feedback && <p className="enhanced-form-feedback">{feedback}</p>}
    </form>
  );
};

export default AddEmployeeForm;
