import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PendingCredentials = () => {
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("users")) || null;
    } catch {
      return null;
    }
  })();

  const fetchPendingEmployees = async () => {
    if (!currentUser?.employeeId) {
      console.error("User not found / employeeId missing in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // HR-specific employees API (adjust URL if your route is different)
      const res = await axios.get(
        `http://localhost:5000/api/hr/employees/hr/${currentUser.employeeId}`
      );

      const allEmployees = Array.isArray(res.data) ? res.data : [];

      // Only employees whose credentialstatus is NOT Completed
      const filtered = allEmployees.filter(
        (emp) => emp.credentialstatus !== "Completed"
      );

      setPendingEmployees(filtered);
    } catch (err) {
      console.error("Error fetching pending employees:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount AND whenever we navigate back to this page
  useEffect(() => {
    fetchPendingEmployees();
  }, [location.key]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
          Employees Pending Credentials
        </h1>

        {/* Loading / Empty / List */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : pendingEmployees.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-gray-600 border">
            <p className="text-center text-lg font-medium">
              🎉 All employees have credentials assigned!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {pendingEmployees.map((employee) => (
              <div
                key={employee._id}
                className="bg-white border rounded-lg shadow-sm p-6 space-y-3"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {employee.name}
                </h2>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Position:</span>{" "}
                  {employee.position}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Department:</span>{" "}
                  {employee.department}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  {employee.email}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Mobile:</span>{" "}
                  {employee.mobile}
                </p>

                <p className="text-sm text-yellow-600 font-medium">
                  ❗ Credentials Not Assigned
                </p>

                <button
                  onClick={() =>
                    navigate("/hr/credentials", {
                      state: { employee }, // pass full object, includes _id
                    })
                  }
                  className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Assign Credentials
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingCredentials;
