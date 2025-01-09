const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
  host: "LocalHost", // Update with your DB host if needed
  user: "root", // Update with your DB username
  password: "Lavanyaa@123", // Update with your DB password
  database: "employee_managements", // Update with your DB name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to the database.");
});

// Route to add employee (POST)
app.post("/api/employees/add", (req, res) => {
  const { name, employeeId, email, phoneNumber, department, dateOfJoining, role, status } = req.body;

  if (!name || !employeeId || !email || !phoneNumber || !department || !dateOfJoining || !role || !status) {
    return res.status(400).json({ message: "All fields are mandatory." });
  }

  const checkQuery = "SELECT * FROM employees WHERE employeeId = ? OR email = ?";
  db.query(checkQuery, [employeeId, email], (err, results) => {
    if (err) {
      console.error("Error checking existing employee:", err.message);
      return res.status(500).json({ message: "Server error." });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "Employee ID or Email already exists." });
    }

    const insertQuery = `
      INSERT INTO employees (name, employeeId, email, phoneNumber, department, dateOfJoining, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertQuery,
      [name, employeeId, email, phoneNumber, department, dateOfJoining, role, status],
      (err, result) => {
        if (err) {
          console.error("Error adding employee:", err.message);
          return res.status(500).json({ message: "Failed to add employee." });
        }
        res.status(200).json({ message: "Employee added successfully." });
      }
    );
  });
});

// Route to list all employees (GET)
app.get("/api/employees", (req, res) => {
  const query = "SELECT * FROM employees"; // Query to get all employees
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err.message);
      return res.status(500).json({ message: "Server error: Failed to fetch employees." });
    }

    res.status(200).json({ employees: results });
  });
});

// Route to update an employee's details (PUT)
app.put("/api/employees/update/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  const { name, email, phoneNumber, department, dateOfJoining, role, status } = req.body;

  if (!name || !email || !phoneNumber || !department || !dateOfJoining || !role || !status) {
    return res.status(400).json({ message: "All fields are mandatory." });
  }

  const updateQuery = `
    UPDATE employees 
    SET name = ?, email = ?, phoneNumber = ?, department = ?, dateOfJoining = ?, role = ?, status = ?
    WHERE employeeId = ?
  `;
  db.query(
    updateQuery,
    [name, email, phoneNumber, department, dateOfJoining, role, status, employeeId],
    (err, result) => {
      if (err) {
        console.error("Error updating employee:", err.message);
        return res.status(500).json({ message: "Failed to update employee." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found." });
      }
      res.status(200).json({ message: "Employee updated successfully." });
    }
  );
});

// Route to get extended dashboard statistics
app.get("/api/dashboard/extended", (req, res) => {
  const queryDepartment = `
    SELECT department, COUNT(*) as count
    FROM employees
    GROUP BY department
  `;

  const queryRole = `
    SELECT role, COUNT(*) as count
    FROM employees
    GROUP BY role
  `;

  const queryGender = `
    SELECT gender, COUNT(*) as count
    FROM employees
    GROUP BY gender
  `;

  const queryTurnover = `
    SELECT YEAR(dateOfJoining) as year, 
           COUNT(*) as joined,
           COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as 'left'
    FROM employees
    GROUP BY YEAR(dateOfJoining)
  `;

  const queryStatus = `
    SELECT status, COUNT(*) as count
    FROM employees
    GROUP BY status
  `;

  const queryHiringTrend = `
    SELECT YEAR(dateOfJoining) as year, COUNT(*) as count
    FROM employees
    GROUP BY YEAR(dateOfJoining)
  `;

  const queryTotalEmployees = `
    SELECT COUNT(*) as totalEmployees
    FROM employees
  `;

  // Fetch all necessary stats concurrently
  const fetchDepartmentStats = new Promise((resolve, reject) =>
    db.query(queryDepartment, (err, results) => (err ? reject(err) : resolve(results)))
  );

  const fetchRoleStats = new Promise((resolve, reject) =>
    db.query(queryRole, (err, results) => (err ? reject(err) : resolve(results)))
  );

  const fetchGenderStats = new Promise((resolve, reject) =>
    db.query(queryGender, (err, results) => (err ? reject(err) : resolve(results)))
  );

  const fetchTurnoverStats = new Promise((resolve, reject) =>
    db.query(queryTurnover, (err, results) => (err ? reject(err) : resolve(results)))
  );

  const fetchStatusStats = new Promise((resolve, reject) =>
    db.query(queryStatus, (err, results) => (err ? reject(err) : resolve(results)))
  );

  const fetchHiringTrendStats = new Promise((resolve, reject) =>
    db.query(queryHiringTrend, (err, results) => (err ? reject(err) : resolve(results)))
  );

  const fetchTotalEmployees = new Promise((resolve, reject) =>
    db.query(queryTotalEmployees, (err, results) => (err ? reject(err) : resolve(results)))
  );

  Promise.all([
    fetchDepartmentStats,
    fetchRoleStats,
    fetchGenderStats,
    fetchTurnoverStats,
    fetchStatusStats,
    fetchHiringTrendStats,
    fetchTotalEmployees,
  ])
    .then(
      ([
        departmentStats,
        roleStats,
        genderStats,
        turnoverStats,
        statusStats,
        hiringTrendStats,
        totalEmployees,
      ]) => {
        // Prepare gender and status data for stacked bar chart
        const combinedGenderStatusData = genderStats.map((genderData) => {
          const activeCount = statusStats.find(
            (status) => status.status === "Active"
          )?.count || 0;

          const inactiveCount = statusStats.find(
            (status) => status.status === "Inactive"
          )?.count || 0;

          return {
            gender: genderData.gender,
            active: genderData.gender === "Male" ? activeCount : 0,
            inactive: genderData.gender === "Male" ? inactiveCount : 0,
          };
        });

        // Send the combined data and other stats to the frontend
        res.status(200).json({
          departmentStats,
          roleStats,
          genderStats,
          turnoverStats,
          statusStats,
          hiringTrendStats,
          totalEmployees: totalEmployees[0]?.totalEmployees || 0,
          combinedGenderStatusData, // This is the data for the stacked bar chart
        });
      }
    )
    .catch((err) => {
      console.error("Error fetching dashboard data:", err.message);
      res.status(500).json({ message: "Server error: Failed to fetch dashboard data." });
    });
});

// Route to get basic dashboard stats (total employees, departments)
app.get("/api/dashboard/stats", (req, res) => {
  // Query to get total employees count
  const queryTotalEmployees = `SELECT COUNT(*) as totalEmployees FROM employees`;

  // Query to get total department count
  const queryTotalDepartments = `SELECT COUNT(DISTINCT department) as departments FROM employees`;

  // Execute the queries to fetch the stats
  db.query(queryTotalEmployees, (err, employeeResults) => {
    if (err) {
      console.error("Error fetching total employees:", err.message);
      return res.status(500).json({ message: "Failed to fetch employee count." });
    }

    db.query(queryTotalDepartments, (err, departmentResults) => {
      if (err) {
        console.error("Error fetching total departments:", err.message);
        return res.status(500).json({ message: "Failed to fetch department count." });
      }

      // Sending the response with total employee and department counts
      res.status(200).json({
        totalEmployees: employeeResults[0]?.totalEmployees || 0,
        departments: departmentResults[0]?.departments || 0,
      });
    });
  });
});

app.post("/save-onboarding", (req, res) => {
  const { firstName, lastName, email, jobTitle, department, startDate, documents } = req.body;
  
  const query = `
    INSERT INTO EmployeeOnboarding (firstName, lastName, email, jobTitle, department, startDate, documents)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [firstName, lastName, email, jobTitle, department, startDate, JSON.stringify(documents)],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving data.");
      } else {
        res.status(200).send("Data saved successfully.");
      }
    }
  );
});




// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
