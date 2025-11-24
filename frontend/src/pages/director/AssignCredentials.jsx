import React, { useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

const AssignCredentials = () => {
  const { state } = useLocation();
  const hrData = state?.hrData;
  const notificationId = state?.notificationId;
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const { theme } = useContext(ThemeContext);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!hrData) return <p>No HR data provided.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      alert("Password is required");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `http://localhost:5000/api/auth/credentials/${employeeId}`,
        { email: hrData.email, password, role: "hr" }
      );

      alert(`Credentials assigned to ${hrData.name}`);
      navigate("/director/HrCredentials");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to assign credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1
        className={`text-2xl font-bold mb-6 ${
          theme === "dark" ? "text-green-300" : "text-blue-800"
        }`}
      >
        Assign Credentials to {hrData.name}
      </h1>

      <div
        className={`p-6 rounded-xl shadow-md border space-y-4 transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-700"
        }`}
      >
        <p>
          <span
            className={`font-medium ${
              theme === "dark" ? "text-green-300" : "text-blue-700"
            }`}
          >
            Email:
          </span>{" "}
          {hrData.email}
        </p>

        <p>
          <span
            className={`font-medium ${
              theme === "dark" ? "text-green-300" : "text-blue-700"
            }`}
          >
            Role:
          </span>{" "}
          {hrData.role}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block font-medium ${
                theme === "dark" ? "text-green-300" : "text-blue-700"
              }`}
            >
              Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full border p-2 rounded-lg focus:ring-2 outline-none transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white focus:ring-green-400"
                  : "bg-white border-gray-300 text-black focus:ring-blue-600"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 px-4 py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : theme === "dark"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-800 hover:bg-blue-700"
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
