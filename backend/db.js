const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "LocalHost",
  user: "root",
  password: "Lavanyaa@123",
  database: "employee_management",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected.");
  }
});

module.exports = db;
