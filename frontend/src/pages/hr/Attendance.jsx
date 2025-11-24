import React from "react";
import { FiCheck, FiX, FiSearch, FiCalendar } from "react-icons/fi";

export default function AttendanceLeavePanel() {
  const leaveRequests = [
    { name: "Ritwik Komaragiri", date: "2025-11-28", reason: "Medical", status: "Pending" },
    { name: "Sanjay Kumar", date: "2025-11-30", reason: "Personal", status: "Pending" }
  ];

  const attendance = [
    { date: "2025-11-24", checkIn: "09:05 AM", checkOut: "05:32 PM", hours: "8h 27m", status: "Present" },
    { date: "2025-11-23", checkIn: "-", checkOut: "-", hours: "-", status: "Absent" }
  ];

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-100">

      {/* Header */}
      <div className="text-3xl font-semibold">Attendance & Leave Management</div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md flex-1">
          <FiSearch className="text-gray-500" />
          <input
            placeholder="Search employee"
            className="ml-2 bg-transparent outline-none w-full"
          />
        </div>

        <div className="flex items-center bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md">
          <FiCalendar className="text-gray-500" />
          <input type="month" className="bg-transparent ml-2 outline-none" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["Present: 21", "Absent: 2", "Leave Requests: 5"].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 shadow p-5 rounded-lg text-center font-semibold text-lg"
          >
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
              <th className="py-2">Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <td className="py-2">{row.date}</td>
                <td>{row.checkIn}</td>
                <td>{row.checkOut}</td>
                <td>{row.hours}</td>
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
          <div
            key={idx}
            className="flex justify-between items-center p-4 rounded-lg border dark:border-gray-600 mb-3"
          >
            <div>
              <h4 className="font-semibold">{req.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {req.date} • {req.reason}
              </p>
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
