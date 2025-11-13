import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane, FaBullhorn, FaTrash } from "react-icons/fa";

export default function DirectorMessenger() {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    department: "",
  });

  // Fetch all announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.department) {
      alert("Please select a department");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/announcements", formData);
      setFormData({ title: "", message: "", department: "" });
      fetchAnnouncements();
    } catch (err) {
      console.error("Error sending announcement", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      try {
        await axios.delete(`http://localhost:5000/api/announcements/${id}`);
        fetchAnnouncements();
      } catch (err) {
        console.error("Error deleting announcement", err);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-6">
        <FaBullhorn /> Messenger / Announcements
      </h2>

      {/* Create Message Form */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10 max-w-3xl">
        <h3 className="text-xl font-semibold mb-4">Create New Announcement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded-lg"
            required
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message..."
            rows="4"
            className="w-full border p-2 rounded-lg"
            required
          ></textarea>

          <div>
            <label className="block mb-2 text-gray-600 font-medium">
              Select Department:
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            >
              <option value="">-- Select Department --</option>
              <option value="HR">Human Resources</option>
              <option value="ProjectManagers">Project Managers</option>
              <option value="Employees">Employees</option>
              <option value="All">All</option>

            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPaperPlane /> Send Announcement
          </button>
        </form>
      </div>

      {/* List of Announcements */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">All Announcements</h3>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          <ul className="divide-y">
            {announcements.map((a) => (
              <li
                key={a._id}
                className="py-4 flex justify-between items-start"
              >
                <div>
                  <h4 className="font-semibold text-gray-800">{a.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{a.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    📢 Sent to:{" "}
                    <span className="font-medium">{a.department}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
