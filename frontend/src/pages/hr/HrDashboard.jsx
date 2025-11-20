import React, { useState, useEffect } from "react";
import HrWelcomePage from "./HRWelcomepage";
import axios from "axios";

const HrDashboard = () => {
  const [lastLoginTime, setLastLoginTime] = useState("");
  const [employeeCount, setEmployeeCount] = useState(0);
  const [pmCount, setPmCount] = useState(0);
  const [hrDetails, setHrDetails] = useState(null);

  // Format last login
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

  // Fetch employees count
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees");
        const employeeUsers = res.data.filter(
          (emp) => emp.role && emp.role.toLowerCase() === "employee"
        );
        setEmployeeCount(employeeUsers.length);

        const employeePm = res.data.filter(
          (emp) => emp.role && emp.role.toLowerCase() === "projectmanager"
        );
        setPmCount(employeePm.length);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // get HR details from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("users"));
    if (storedUser) {
      setHrDetails(storedUser);
    }
  }, []);

  // Example values for other cards (replace with real API calls when available)
  const pendingCredentials = 3;
  const leaveRequests = 7;
  const recruitmentOpen = 5;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-7xl space-y-6">
        {/* Keep HrWelcomePage unchanged */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <HrWelcomePage />
          </div>

          {/* Create Report button (aligned with screenshot top-right of content) */}
          <div className="ml-4">
            <button
              type="button"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              Create Report
            </button>
          </div>
        </div>

        {/* Main HR card area (left big HR Details + tiles on the right like screenshot) */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: HR Details large card */}
            <div className="w-full lg:w-1/3 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={hrDetails?.profilePic || "https://via.placeholder.com/150"}
                    alt="HR Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800">HR Details</h2>
                  <p className="text-gray-600 mt-2">Name: <span className="font-medium text-gray-800">{hrDetails?.name || "—"}</span></p>
                  <p className="text-gray-600">Email: <span className="text-gray-800">{hrDetails?.email || "—"}</span></p>
                  <p className="text-gray-600">Role: <span className="text-gray-800">{hrDetails?.role || "HR"}</span></p>
                  <p className="text-gray-600">Department: <span className="text-gray-800">{hrDetails?.department || "Human Resources"}</span></p>
                  <p className="text-gray-400 text-sm mt-3">Last login: {lastLoginTime}</p>
                </div>
              </div>

            </div>            
            {/* Right: Grid of cards matching the dashboard look */}
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Employees Under Supervision */}
              <div className="bg-white rounded-lg p-5 shadow border flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Employees Under Supervision</h3>
                    <p className="text-3xl font-extrabold text-blue-900 mt-4">{employeeCount}</p>
                    <p className="text-xs text-green-500 mt-1">+2 from last week</p>
                  </div>
                  <div className="bg-blue-100 rounded p-3">
                    {/* simple people icon */}
                    <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM6 14a4 4 0 00-4 4v1h12v-1a4 4 0 00-4-4H6z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">View All</button>
                </div>
              </div>

              {/* Pending Credentials */}
              <div className="bg-white rounded-lg p-5 shadow border flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Pending Credentials</h3>
                    <p className="text-3xl font-extrabold text-blue-900 mt-4">{pendingCredentials}</p>
                    <p className="text-xs text-gray-400 mt-1">Awaiting setup</p>
                  </div>
                  <div className="bg-yellow-100 rounded p-3">
                    {/* credential icon */}
                    <svg className="w-6 h-6 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 100 12A6 6 0 0010 2zM2 18a8 8 0 0116 0H2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="text-sm bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded">Create Now</button>
                </div>
              </div>

              {/* Leave Requests */}
              <div className="bg-white rounded-lg p-5 shadow border flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Leave Requests</h3>
                    <p className="text-3xl font-extrabold text-blue-900 mt-4">{leaveRequests}</p>
                    <p className="text-xs text-gray-400 mt-1">Pending approval</p>
                  </div>
                  <div className="bg-green-100 rounded p-3">
                    {/* calendar icon */}
                    <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H8V2H6z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded">Review</button>
                </div>
              </div>

              {/* Recruitment */}
              <div className="bg-white rounded-lg p-5 shadow border flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Recruitment</h3>
                    <p className="text-3xl font-extrabold text-blue-900 mt-4">{recruitmentOpen}</p>
                    <p className="text-xs text-gray-400 mt-1">Open positions</p>
                  </div>
                  <div className="bg-red-100 rounded p-3">
                    {/* briefcase icon */}
                    <svg className="w-6 h-6 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 7V6a2 2 0 012-2h4a2 2 0 012 2v1h3v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7h3z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="text-sm bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded">View</button>
                </div>
              </div>

              {/* Placeholder empty card to keep 3-column balance on wide screens */}
              <div className="hidden lg:flex items-center justify-center bg-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
