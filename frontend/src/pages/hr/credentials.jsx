import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Credentials = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee } = location.state || {}; // employee object from AddEmployeeCredentials
  console.log("Received state:", employee);

  const [username, setUsername] = useState(employee?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
console.log("Employee Data:", username, password); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Send credentials to backend
   const res = await axios.post(
  `http://localhost:5000/api/auth/credentials/${employee.employeeId}`,
  { email:username , password , role : employee?.role}
);


      console.log("Credentials response:", res.data);
      alert(`✅ Credentials created for ${employee.name}`);

      // ✅ Delete notification
      //  await axios.delete(
      //   `http://localhost:5000/api/notificationDelete/${employee._id}`
      // );
      // alert("Notification deleted successfully");

      // // Navigate back after success
       navigate(-1);
    } catch (error) {
      console.error("Error creating credentials or deleting notification:", error);
      alert("Failed to create credentials or delete notification");
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
          <span className="font-medium">Email:</span> {employee?.email}
        </p>
        <p>
          <span className="font-medium">Role:</span> {employee?.role}
        </p>
        <p>
          <span className="font-medium">Department:</span> {employee?.department}
        </p>
        <p>
          <span className="font-medium">Status:</span> {employee?.status}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block font-medium">Username</label>
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
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Saving..." : "Save Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Credentials;
