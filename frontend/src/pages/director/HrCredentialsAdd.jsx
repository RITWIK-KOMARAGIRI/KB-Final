import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

const HrCredentialsAdd = () => {
  const [fetchHr, setFetchHr] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fetchHr")
      .then((res) => setFetchHr(res.data))
      .catch((err) => console.error("Error fetching HR:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        theme === "dark" ? "bg-[#0d0f27] text-gray-200" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1
        className={`text-2xl font-bold mb-6 ${
          theme === "dark" ? "text-blue-400" : "text-blue-700"
        }`}
      >
        All HR Details
      </h1>

      {loading ? (
        <p>Loading HR...</p>
      ) : fetchHr.length === 0 ? (
        <p>No HR found.</p>
      ) : (
        <div className="grid gap-6">
          {fetchHr
            .filter((hr) => hr.role?.toLowerCase() === "hr")
            .map((hr) => (
              <div
                key={hr._id}
                className={`p-6 rounded-lg shadow transition-all duration-300 space-y-3 border 
                  ${
                    theme === "dark"
                      ? "bg-[#11152e] border-gray-700 text-gray-200"
                      : "bg-white border-gray-200 text-gray-900"
                  }
                `}
              >
                <h2
                  className={`text-xl font-semibold ${
                    theme === "dark" ? "text-blue-300" : "text-blue-700"
                  }`}
                >
                  {hr?.name}
                </h2>

                <p>
                  <span className="font-medium">Role:</span> {hr?.role}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {hr?.email}
                </p>
                <p>
                  <span className="font-medium">Mobile:</span> {hr?.mobile}
                </p>

                {/* Credential Status / Button */}
                {hr?.credentialstatus === "Completed" ? (
                  <span className="text-green-500 font-semibold">
                    Credentials already Assigned
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      navigate(`/director/assign-credentials/${hr.employeeId}`, {
                        state: { hrData: hr, notificationId: hr._id },
                      })
                    }
                    className="mt-3 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                  >
                    Assign Credentials
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default HrCredentialsAdd;
