import React, { useState, useEffect } from "react";
import EMWelcomePage from "./EMWelcomepage";
import axios from "axios";

const Dashboard = () => {
  const [lastLoginTime, setLastLoginTime] = useState("");
  const [employeeCount, setEmployeeCount] = useState(0);
  const [pmCount, setPmCount] = useState(0);
  const [hrDetails, setHrDetails] = useState(null);

  // ✅ Format and set last login time
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    setLastLoginTime(formattedDate);
  }, []);

  // ✅ Fetch employees count
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees");

        const employeeUsers = res.data.filter(
          (emp) => emp.role.toLowerCase() === "employee"
        );
        setEmployeeCount(employeeUsers.length);

        const employeePm = res.data.filter(
          (emp) => emp.role.toLowerCase() === "projectmanager"
        );
        setPmCount(employeePm.length);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Get HR details from localStorage (set during Signin)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("users"));
    if (storedUser) {
      setHrDetails(storedUser);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 py-6">
      <div className="w-full max-w-7xl space-y-6">
        {/* EMWelcomePage */}
        <div className="mb-4">
          <EMWelcomePage />
        </div>

        {/* HR Section */}
        <div className="border-2 border-gray-300 rounded-lg p-6 space-y-6 bg-white shadow">
          {/* Large HR Details Card */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
              <img
                src={hrDetails?.profilePic || "https://via.placeholder.com/150"}
                alt="HR Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800">EM Details</h2>
              <p className="text-gray-700 mt-3">Name: {hrDetails?.name}</p>
              <p className="text-gray-700">Email: {hrDetails?.email}</p>
              <p className="text-gray-700">Role: {hrDetails?.role}</p>
              <p className="text-gray-700">
                Department: {hrDetails?.department || "Human Resources"}
              </p>
            
              <p className="text-gray-500 text-sm mt-2">
                Last login: {lastLoginTime}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Project Assigned
              </h2>
              <p className="text-4xl font-extrabold text-blue-900 mt-4">
                {employeeCount}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Completed Projects
              </h2>
              <p className="text-4xl font-extrabold text-blue-900 mt-4">
                {pmCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
