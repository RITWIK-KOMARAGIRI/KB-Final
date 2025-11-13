// src/components/ProfileCard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileCard = () => {
  const [user, setUser] = useState({
    name: "John Director",
    email: "john.director@kodebloom.com",
    phone: "+91 9876543210",
    location: "Secunderabad, Telangana",
    position: "Director at KodeBloom",
  });
  const [employeeCount, setEmployeeCount] = useState(0);
  const [pmCount , setpmCount ] = useState(0);

  // Fetch employees from backend
  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      // Only count users with role = "Employee"
      const employeeUsers = res.data.filter(emp => emp.role === "employee");
      setEmployeeCount(employeeUsers.length);
      const employeePm = res.data.filter(emp => emp.role === "project managers")
      setpmCount(employeePm.length);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  fetchEmployees();
}, []);


  // Generate initials
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
      <div className="profile-image-large w-32 h-32 bg-gradient-to-r from-blue-900 to-blue-700 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-50 shadow-lg mx-auto">
        {getInitials(user.name)}
      </div>

      <div className="profile-info">
        <h2 className="text-blue-900 text-2xl font-semibold mb-3">{user.name}</h2>
        <p className="text-gray-500 mb-2 flex items-center gap-2">
          <i className="fas fa-briefcase"></i> {user.position}
        </p>
        <p className="text-gray-500 mb-2 flex items-center gap-2">
          <i className="fas fa-envelope"></i> {user.email}
        </p>
        <p className="text-gray-500 mb-2 flex items-center gap-2">
          <i className="fas fa-phone"></i> {user.phone}
        </p>
        <p className="text-gray-500 mb-2 flex items-center gap-2">
          <i className="fas fa-map-marker-alt"></i> {user.location}
        </p>

        <div className="profile-stats grid grid-cols-3 gap-4 mt-5">
          <div className="stat text-center py-4 bg-blue-50 rounded-xl">
            <h3 className="text-blue-900 text-2xl mb-1">{employeeCount}</h3>
            <p className="text-gray-500 text-sm">Employees</p>
          </div>
          <div className="stat text-center py-4 bg-blue-50 rounded-xl">
            <h3 className="text-blue-900 text-2xl mb-1">12</h3>
            <p className="text-gray-500 text-sm">Projects</p>
          </div>
          <div className="stat text-center py-4 bg-blue-50 rounded-xl">
            <h3 className="text-blue-900 text-2xl mb-1">{pmCount}</h3>
            <p className="text-gray-500 text-sm">Project Managers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
