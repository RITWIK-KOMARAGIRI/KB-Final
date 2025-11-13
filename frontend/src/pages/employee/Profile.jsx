import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("users")).employeeId;
        const response = await axios.get(
          `http://localhost:5000/api/employees/${userId}`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("⚠️ Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg shadow-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg max-w-3xl mx-auto border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        👤 My Profile
      </h2>

      {profile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold">{profile.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-semibold">{profile.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-semibold">
              {new Date(profile.dob).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Position</p>
            <p className="font-semibold">{profile.position}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-semibold">{profile.department}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Mobile Number</p>
            <p className="font-semibold">{profile.mobile}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                profile.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {profile.status}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Profile not found.</p>
      )}
    </div>
  );
};

export default Profile;
