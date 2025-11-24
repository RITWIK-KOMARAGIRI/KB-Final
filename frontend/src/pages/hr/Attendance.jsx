import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCheck, FiX, FiSearch, FiCalendar } from "react-icons/fi";

export default function AttendanceLeavePanel() {
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState("");
  const [employeesMap, setEmployeesMap] = useState({}); // ID → name map

  const storedUser = JSON.parse(localStorage.getItem("users"));
  const isEmployee = storedUser?.role === "employee";
  const employeeId = storedUser?.employeeId; // employees only, HR/director ignore

  // ---------------------------------------------------------------------
  // Fetch ALL employees → build ID→Name dictionary
  // ---------------------------------------------------------------------
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees");
        const map = {};

        res.data.forEach((emp) => {
          map[emp._id] = emp.name;
        });

        setEmployeesMap(map);
      } catch (err) {
        console.error("Employees Fetch Error:", err);
      }
    };

    fetchEmployees();
  }, []);

  // ---------------------------------------------------------------------
  // Fetch Attendance (HR = all employees, Employee = their own)
  // ---------------------------------------------------------------------
  const fetchAttendance = async () => {
    try {
      let url = "";

      if (isEmployee) {
        // Employee → only their own attendance
        url = `http://localhost:5000/api/attendance/employee/${employeeId}?month=${month}`;
      } else {
        // HR / Director → fetch ALL attendance for all employees
        url = `http://localhost:5000/api/attendance/all?month=${month}`;
      }

      const res = await axios.get(url);
      setAttendance(res.data);
    } catch (err) {
      console.error("Attendance Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month]);

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------
  const formatTime = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "-";
    const diff = (new Date(outTime) - new Date(inTime)) / 1000;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Sample leave requests (dummy)
  const leaveRequests = [
    { name: "Ritwik Komaragiri", date: "2025-11-28", reason: "Medical", status: "Pending" },
    { name: "Sanjay Kumar", date: "2025-11-30", reason: "Personal", status: "Pending" },
  ];

  // ---------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------
  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-100">
      <div className="text-3xl font-semibold">Attendance & Leave Management</div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md flex-1">
          <FiSearch className="text-gray-500" />
          <input placeholder="Search employee" className="ml-2 bg-transparent outline-none w-full" />
        </div>

        <div className="flex items-center bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md">
          <FiCalendar className="text-gray-500" />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent ml-2 outline-none"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["Present: 21", "Absent: 2", "Leave Requests: 5"].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 shadow p-5 rounded-lg text-center font-semibold text-lg">
            {stat}
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="font-bold mb-3 text-xl">Attendance Record</h3>

        <table className="w-full text-sm">
          <thead className="border-b border-gray-300 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="py-2">Employee</th>
              <th>Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Hours Worked</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                {/* EMPLOYEE NAME */}
                <td className="py-2 font-medium">
                  {employeesMap[row.employee] || "Unknown"}
                </td>

                <td>{new Date(row.date).toLocaleDateString()}</td>
                <td>{formatTime(row.loginAt)}</td>
                <td>{formatTime(row.logoutAt)}</td>
                <td>{calculateHours(row.loginAt, row.logoutAt)}</td>

                <td
                  className={`font-medium ${
                    row.status === "Present"
                      ? "text-green-500"
                      : row.status === "Absent"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Requests */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="font-bold mb-3 text-xl">Pending Leave Requests</h3>

        {leaveRequests.map((req, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 rounded-lg border dark:border-gray-600 mb-3">
            <div>
              <h4 className="font-semibold">{req.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{req.date} • {req.reason}</p>
            </div>

            <div className="flex gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-2">
                <FiCheck /> Approve
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-2">
                <FiX /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
