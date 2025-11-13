import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EmployeeDetails = () => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/assignedEmployees");
        setEmployeeDetails(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  

  if (loading) return <p>Loading employees...</p>;
  if (employeeDetails.length === 0) return <p>No employees found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assigned Employees</h1>
      <div className="grid gap-4">
        {employeeDetails.map((emp) => (
          <div
            key={emp._id}
            className="p-4 bg-white rounded shadow border border-gray-200"
          >
            <h2 className="text-xl font-semibold">{emp.name}</h2>
            <p>
              <span className="font-medium">Email:</span> {emp.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> {emp.role}
            </p>
            {emp.employee && (
              <>
                <p>
                  <span className="font-medium">Employee ID:</span> {emp.employee.employeeId}
                </p>
                <p>
                  <span className="font-medium">Department:</span> {emp.employee.department}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDetails;
