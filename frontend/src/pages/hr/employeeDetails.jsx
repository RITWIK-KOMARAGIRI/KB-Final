import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const AddEmployeeCredentials = () => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Safely read localStorage and extract employeeId
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("users")) || null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!currentUser?.employeeId) {
      setError("User not found or not logged in.");
      setLoading(false);
      return;
    }

    const source = axios.CancelToken.source();
    setLoading(true);
    setError(null);

    axios
      .get(
        `http://localhost:5000/api/hr/employees/hr/${currentUser.employeeId}`,
        { cancelToken: source.token }
      )
      .then((response) => {
        // Ensure array form for consistency
        const data = Array.isArray(response.data)
          ? response.data
          : response.data
          ? [response.data]
          : [];
        setEmployeeDetails(data);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error("Error fetching employees:", err);
          setError("Failed to fetch employee details. Try again later.");
        }
      })
      .finally(() => setLoading(false));

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // currentUser.employeeId intentionally not added to deps to mirror original behavior

  const formatDate = (d) => {
    if (!d) return "N/A";
    // try to format safely using dayjs; fall back to raw string
    try {
      return dayjs(d).format("DD MMM, YYYY");
    } catch {
      return String(d);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            All Employee Details
          </h1>
          <p className="text-sm text-gray-500">
            HR Panel — {employeeDetails.length} {employeeDetails.length === 1 ? "record" : "records"}
          </p>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse p-6 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : employeeDetails.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
            <p className="text-gray-600">No employees found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {employeeDetails.map((employee) => (
              <article
                key={employee._id}
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between"
                aria-labelledby={`emp-${employee._id}`}
              >
                <div>
                  <h2 id={`emp-${employee._id}`} className="text-lg font-semibold text-gray-800 mb-2">
                    {employee?.name || "Unnamed Employee"}
                  </h2>

                  <dl className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium">Position</dt>
                      <dd>{employee?.position || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Role</dt>
                      <dd>{employee?.role || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Department</dt>
                      <dd>{employee?.department || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Salary</dt>
                      <dd>{employee?.salary ? `₹ ${employee.salary}` : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Email</dt>
                      <dd className="truncate max-w-[10rem]">{employee?.email || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Mobile</dt>
                      <dd>{employee?.mobile || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">DOB</dt>
                      <dd>{formatDate(employee?.dob)}</dd>
                    </div>

                    <div className="flex justify-between items-center">
                      <dt className="font-medium">Status</dt>
                      <dd>
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                            employee?.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : employee?.status === "On Leave"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {employee?.status || "N/A"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 flex gap-3">
                  {employee?.credentialstatus === "Completed" ? (
                    <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                      Credentials assigned
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        navigate("/hr/credentials", {
                          state: { employee, empId: employee._id },
                        })
                      }
                      className="flex-1 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                      aria-label={`Give credentials to ${employee?.name || "employee"}`}
                    >
                      Give Credentials
                    </button>
                  )}

                  <button
                    onClick={() => {
                      // Example: view details or open edit modal - placeholder
                      navigate("/hr/employee/" + employee._id, { state: { employee } });
                    }}
                    className="px-3 py-2 rounded-md border border-gray-200 text-sm hover:bg-gray-50 transition"
                    aria-label={`View ${employee?.name || "employee"} details`}
                  >
                    View
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEmployeeCredentials;
