import React, { useState, useEffect } from "react";
import axios from "axios";
import PMWelcomePage from "./PMWelcomepage";

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [pmDetails, setPmDetails] = useState(null);

  // ✅ Fetch employees count (team members)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees");

        const employeeUsers = res.data.filter(
          (emp) => emp.role.toLowerCase() === "employee"
        );
        setEmployeeCount(employeeUsers.length);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Get PM details from localStorage (set during Signin)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("users"));
    if (storedUser) {
      setPmDetails(storedUser);
    }
  }, []);

  // Temporary static values for dashboard-style cards (replace with real API later)
  const activeProjects = 6;
  const tasksDueThisWeek = 17;
  const projectCompletion = 72.8;

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 py-6">
      <div className="w-full max-w-7xl space-y-8">
        {/* Optional welcome banner (can be removed if Header already handles this) */}
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Project Manager Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Project tracking and team management{pmDetails?.name && ", "}
            {pmDetails?.name && (
              <span className="font-semibold text-gray-700">
                {" "}Welcome back, {pmDetails.name}
              </span>
            )}
          </p>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Active Projects */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Projects</p>
              <p className="mt-3 text-3xl font-extrabold text-emerald-600">
                {activeProjects}
              </p>
            </div>
          </div>

          {/* Tasks Due This Week */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Tasks Due This Week
              </p>
              <p className="mt-3 text-3xl font-extrabold text-purple-600">
                {tasksDueThisWeek}
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <p className="mt-3 text-3xl font-extrabold text-sky-600">
                {employeeCount}
              </p>
            </div>
          </div>

          {/* Project Completion */}
          <div className="bg-white border border-amber-300 rounded-xl shadow-sm p-5 md:col-span-1 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">
                Project Completion
              </p>
              <p className="mt-3 text-3xl font-extrabold text-gray-900">
                {projectCompletion}%
              </p>
              <div className="mt-3 w-full h-2 rounded-full bg-amber-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${projectCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Status Overview */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Status Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Visual representation of all projects and their current status
          </p>
          <div className="mt-4 h-48 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
            Charts / graphs can go here
          </div>
        </section>

        {/* Team Performance */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900">Team Performance</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track how your team is performing across active projects.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500 flex items-center justify-center">
              Team performance cards / table can be added here.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
