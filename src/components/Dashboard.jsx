import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";


const Dashboard = () => {
  const [data, setData] = useState({
    departmentStats: [],
    roleStats: [],
    genderStats: [],
    turnoverStats: [],
    statusStats: [],
    hiringTrendStats: [],
    totalEmployees: 0,
  });

  useEffect(() => {
    // Fetch data from API
    axios
      .get("http://localhost:5000/api/dashboard/extended")
      .then((response) => {
        console.log("Fetched data:", response.data); // Log the response data
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, []);

  const departmentColors = ["#eeaeca", "#d9b1d1", "#c2b4d9", "#abb8e1", "#94bbe9"];
  const statusColors = ["#eeaeca", "#94bbe9"]; // Active - Green, Inactive - Red

  // Prepare the data for the Gender and Status Stacked Bar Chart
  const combinedGenderStatusData = data.genderStats.map((genderData) => {
    console.log("Gender Data:", genderData); // Log each entry
    const activeCount = genderData.gender === "Male" ? data.statusStats.find(status => status.status === "Active")?.count : 0;
    const inactiveCount = genderData.gender === "Male" ? data.statusStats.find(status => status.status === "Inactive")?.count : 0;

    return {
      gender: genderData.gender,
      active: activeCount,
      inactive: inactiveCount,
    };
  });
  console.log("Combined Gender and Status Data:", combinedGenderStatusData); // Log the final array

  return (
    <div className="dashboard-container">


      {/* First Row: Department Distribution, Role Distribution, Gender and Employee Status */}
      <div className="charts-row">
        <div className="chart-container">
          <h3>Department Distribution</h3>
          <PieChart width={320} height={300}>
            <Pie
              data={data.departmentStats}
              dataKey="count"
              nameKey="department"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#94bbe9"
              label
            >
              {data.departmentStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={departmentColors[index % departmentColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="chart-container">
          <h3>Role Distribution</h3>
          <BarChart width={320} height={300} data={data.roleStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="role" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#94bbe9" />
          </BarChart>
        </div>

        <div className="chart-container">
          <h3>Gender and Employee Status</h3>
          <BarChart width={320} height={300} data={combinedGenderStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gender" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="active" stackId="a" fill={statusColors[0]} />
            <Bar dataKey="inactive" stackId="a" fill={statusColors[1]} />
          </BarChart>
        </div>
      </div>

      {/* Second Row: Employee Turnover Chart */}
      <div className="charts-row-right">
        <div className="chart-container" style={{ width: "48%" }}>
          <h3>Employee Turnover (Joined vs Left)</h3>
          <AreaChart width={1000} height={300} data={data.turnoverStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="joined" fill="#94bbe9" />
            <Area type="monotone" dataKey="left" fill="#eeaeca" />
          </AreaChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
