import React, { useState, useEffect } from "react";
import axios from "axios";

const PmDetails = () => {
  const [pms, setPms] = useState([]);
  const [selectedPm, setSelectedPm] = useState(null);

  useEffect(() => {
    const fetchPMs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees");
        // ✅ Filter only project managers
        const pmUsers = res.data.filter(
          (emp) => emp.role && emp.role.toLowerCase() === "project managers"
        );
        setPms(pmUsers);
      } catch (err) {
        console.error("Error fetching PMs:", err);
      }
    };

    fetchPMs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Project Managers
      </h1>

      {/* PM Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pms.map((pm) => (
          <div
            key={pm._id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{pm.name}</h2>
              <p className="text-gray-600">Email: {pm.email}</p>
              <p className="text-gray-600">Department: {pm.department}</p>
              <p className="text-gray-600">Position: {pm.position}</p>
              <p className="text-gray-600">
                Assigned HR:{" "}
                {pm.assignedHr ? pm.assignedHr.name : "Not Assigned"}
              </p>
            </div>

            <button
              onClick={() => setSelectedPm(pm)}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Full Details */}
      {selectedPm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button
              onClick={() => setSelectedPm(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedPm.name} - Full Details
            </h2>

            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> {selectedPm.email}</p>
              <p><strong>Employee ID:</strong> {selectedPm.employeeId}</p>
              <p><strong>Department:</strong> {selectedPm.department}</p>
              <p><strong>Position:</strong> {selectedPm.position}</p>
              <p><strong>Salary:</strong> ₹{selectedPm.salary}</p>
              <p><strong>Mobile:</strong> {selectedPm.mobile}</p>
              <p><strong>Status:</strong> {selectedPm.status}</p>
              <p><strong>DOB:</strong> {new Date(selectedPm.dob).toDateString()}</p>
              <p><strong>Assigned HR:</strong> 
                {selectedPm.assignedHr
                  ? `${selectedPm.assignedHr.name} (${selectedPm.assignedHr.email})`
                  : "Not Assigned"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PmDetails;
