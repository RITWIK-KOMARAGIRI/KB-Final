import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Credentials = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // We expect state from PendingCredentials:
  // navigate("/hr/credentials", { state: { employee } })
  const { employee } = location.state || {};

  console.log("Received state in Credentials:", employee);

  const [username, setUsername] = useState(employee?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If no employee data, show a fallback
  if (!employee) {
    return (
      <div className="p-6">
        <p>No employee selected.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ✅ Use Employee _id for backend URL
  const idForApi = employee._id;

  if (!idForApi) {
    console.error("❌ employee._id is missing:", employee);
  }

  console.log("Employee Data (for credentials):", {
    username,
    password,
    idForApi,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username (email) and password are required.");
      return;
    }

    if (!idForApi) {
      alert(
        "Internal error: Employee _id is missing. Cannot create credentials."
      );
      return;
    }

    setLoading(true);

    try {
      // Backend: POST /api/auth/credentials/:id  (id = Employee _id)
      const res = await axios.post(
        `http://localhost:5000/api/auth/credentials/${idForApi}`,
        {
          email: username,
          password,
          role: employee?.role, // "employee", "project managers", etc.
        }
      );

      console.log("Credentials response:", res.data);
      alert(`✅ Credentials created for ${employee.name}`);

      // After success:
      // - backend set credentialstatus = "Completed"
      // - PendingCredentials will re-fetch on navigate(-1)
      navigate(-1);
    } catch (error) {
      console.error(
        "Error creating credentials:",
        error.response?.data || error
      );
      alert(
        error.response?.data?.message ||
          "Failed to create credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Give Credentials</h1>

      <div className="p-6 bg-white rounded-lg shadow border border-gray-200 space-y-3">
        <h2 className="text-xl font-semibold">{employee?.name}</h2>
        <p>
          <span className="font-medium">Employee ID:</span>{" "}
          {employee?.employeeId || "(not set)"}
        </p>
        <p>
          <span className="font-medium">Email:</span> {employee?.email}
        </p>
        <p>
          <span className="font-medium">Role:</span> {employee?.role}
        </p>
        <p>
          <span className="font-medium">Department:</span>{" "}
          {employee?.department}
        </p>
        <p>
          <span className="font-medium">Status:</span> {employee?.status}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block font-medium">Username (Email)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 px-4 py-2 rounded text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Saving..." : "Save Credentials"}
          </button>
        </form>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Credentials;
