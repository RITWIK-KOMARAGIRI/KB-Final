import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AssignCredentials = () => {
  const { state } = useLocation();
  const hrData = state?.hrData; // single HR object
  const notificationId = state?.notificationId; // notification ObjectId
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("HR Data:", hrData);

  if (!hrData) return <p>No HR data provided.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      alert("Password is required");
      return;
    }

    setLoading(true);

    try {
      // ✅ Assign credentials
      await axios.post(
        `http://localhost:5000/api/auth/credentials/${employeeId}`,
        { email: hrData.email, password , role: "hr" }
      );

      alert(`Credentials assigned to ${hrData.name}`);

      // ✅ Delete notification if exists
      // if (notificationId) {
      //   await axios.delete(
      //     `http://localhost:5000/api/notificationDelete/${notificationId}`
      //   );
      //   alert("Notification deleted successfully");
      // }

      navigate("/director/HrCredentials");
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Failed to assign credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">
        Assign Credentials to {hrData.name}
      </h1>

      <div className="p-6 bg-white rounded-lg shadow border border-gray-200 space-y-4">
        <p>
          <span className="font-medium">Email:</span> {hrData.email}
        </p>
        <p>
          <span className="font-medium">Role:</span> {hrData.role}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 px-4 py-2 rounded text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Assigning..." : "Assign Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignCredentials;
