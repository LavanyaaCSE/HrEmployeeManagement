import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaList,
  FaUserPlus,
  FaEdit,
  FaUsers,
  FaBuilding,
  FaChartLine, // Icon for Performance Management
  FaUserCheck, // Icon for Employee Onboarding
  FaCalendarAlt, // Icon for Shift Scheduling
  FaCog, // Icon for Settings
} from "react-icons/fa"; // Import icons
import AddEmployeeForm from "./components/AddEmployeeForm";
import UpdateEmployeeForm from "./components/UpdateEmployeeForm";
import EmployeeList from "./components/EmployeeList";
import Dashboard from "./components/Dashboard";
import EmployeeOnboarding from "./components/EmployeeOnboarding";
import PerformanceManagement from "./components/PerformaceManagement";
import ShiftScheduling from "./components/ShiftScheduling";
import axios from "axios"; // For making API calls

function App() {
  const [activeButton, setActiveButton] = useState("dashboard"); // Default to "dashboard"
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: 0,
  });

  useEffect(() => {
    // Fetch stats data from the backend
    axios
      .get("http://localhost:5000/api/dashboard/stats") // Adjust with your API URL
      .then((response) => {
        setStats({
          totalEmployees: response.data.totalEmployees,
          departments: response.data.departments,
        });
      })
      .catch((error) => {
        console.error("Error fetching stats data:", error);
      });
  }, []);

  return (
    <div className="app-container">
      <div className="main-container">
        {/* Side Navbar */}
        <nav className="side-navbar">
          <ul>
            <li
              onClick={() => setActiveButton("dashboard")}
              className={activeButton === "dashboard" ? "active" : ""}
            >
              <FaTachometerAlt size={20} className="icon" />
              <span>Dashboard</span>
            </li>
            <li
              onClick={() => setActiveButton("view")}
              className={activeButton === "view" ? "active" : ""}
            >
              <FaList size={20} className="icon" />
              <span>Employees</span>
            </li>
            <li
              onClick={() => setActiveButton("performance")}
              className={activeButton === "performance" ? "active" : ""}
            >
              <FaChartLine size={20} className="icon" />
              <span>Metrices</span>
            </li>
            <li
              onClick={() => setActiveButton("onboarding")}
              className={activeButton === "onboarding" ? "active" : ""}
            >
              <FaUserCheck size={20} className="icon" />
              <span>Onboarding</span>
            </li>
            <li
              onClick={() => setActiveButton("scheduling")}
              className={activeButton === "scheduling" ? "active" : ""}
            >
              <FaCalendarAlt size={20} className="icon" />
              <span>Schedules</span>
            </li>
          </ul>
        </nav>

        {/* Content Area */}
        <div className="content-area">
          {/* Cards */}
          <div className="stats-cards">
            {/* Total Employees Card */}
            <div className="card">
              <FaUsers size={32} className="card-icon" />
              <h3>Total Employees</h3>
              <p>{stats.totalEmployees}</p>
            </div>

            {/* Total Departments Card */}
            <div className="card">
              <FaBuilding size={32} className="card-icon" />
              <h3>Total Departments</h3>
              <p>{stats.departments}</p>
            </div>

            {/* Add Employee Card */}
            <div className="card action-card">
              <FaUserPlus size={32} className="card-icon" />
              <h3>Add Employee</h3>
              <button
                className="action-button"
                onClick={() => setActiveButton("add")}
              >
                Add
              </button>
            </div>

            {/* Edit Employee Card */}
            <div className="card action-card">
              <FaEdit size={32} className="card-icon" />
              <h3>Edit Employee</h3>
              <button
                className="action-button"
                onClick={() => setActiveButton("update")}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Conditional Rendering of Components */}
          {activeButton === "dashboard" && <Dashboard />}
          {activeButton === "view" && <EmployeeList />}
          {activeButton === "add" && <AddEmployeeForm />}
          {activeButton === "update" && <UpdateEmployeeForm />}
          {activeButton === "performance" &&  <PerformanceManagement />}
          {activeButton === "onboarding" && <EmployeeOnboarding />}
          {activeButton === "scheduling" && <ShiftScheduling />}
        </div>
      </div>
    </div>
  );
}

export default App;
