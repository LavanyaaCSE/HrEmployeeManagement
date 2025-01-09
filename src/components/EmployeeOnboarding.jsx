import React, { useState } from "react";

const EmployeeOnboarding = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    department: "",
    startDate: "",
    documents: [],
  });

  const [progress, setProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      documents: [...prevState.documents, ...files],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare form data for submission
    const data = {
      ...formData,
      documents: formData.documents.map((file) => file.name), // Only send file names
    };

    fetch("http://localhost:5000/save-onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert("Updated successfully!");
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            jobTitle: "",
            department: "",
            startDate: "",
            documents: [],
          });
          setProgress(0);
        } else {
          alert("Failed to update data.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleProgressUpdate = () => {
    let updatedProgress = 0;
    if (formData.firstName && formData.lastName) updatedProgress += 20;
    if (formData.email) updatedProgress += 20;
    if (formData.jobTitle && formData.department) updatedProgress += 20;
    if (formData.startDate) updatedProgress += 20;
    if (formData.documents.length > 0) updatedProgress += 20;
    setProgress(updatedProgress);
  };

  React.useEffect(() => {
    handleProgressUpdate();
  }, [formData]);

  return (
    <div className="onboarding-container">
      <div className="onboarding-form">
        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              required
            />
          </div>

          {/* Job Information Section */}
          <div className="form-section">
            <h3>Job Information</h3>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Job Title"
              required
            />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Department"
              required
            />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              placeholder="Start Date"
              required
            />
          </div>

          {/* Documents Upload Section */}
          <div className="form-section">
            <h3>Documents Upload</h3>
            <input
              type="file"
              name="documents"
              onChange={handleFileChange}
              multiple
            />
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <label>Onboarding Progress</label>
            <progress value={progress} max={100}></progress>
            <span>{progress}%</span>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeOnboarding;
