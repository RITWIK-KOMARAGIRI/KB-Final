import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPaperPlane, FaBullhorn, FaTrash } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

export default function DirectorMessenger() {
  const { theme } = useContext(ThemeContext); // light / dark
  const isDark = theme === "dark";

  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    department: "",
  });

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
    <div
      className={`p-8 min-h-screen transition-all duration-300 ${
        isDark ? "bg-slate-900 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <h2
        className={`text-2xl font-bold flex items-center gap-2 mb-6 ${
          isDark ? "text-blue-300" : "text-blue-700"
        }`}
      >
        <FaBullhorn /> Messenger / Announcements
      </h2>

      {/* Create Message Form */}
      <div
        className={`rounded-2xl shadow-md p-6 mb-10 max-w-3xl transition-all ${
          isDark
            ? "bg-slate-800 border border-slate-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">Create New Announcement</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className={`w-full p-2 rounded-lg border ${
              isDark
                ? "bg-slate-700 border-slate-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            }`}
            required
          />

          {/* Message */}
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message..."
            rows="4"
            className={`w-full p-2 rounded-lg border ${
              isDark
                ? "bg-slate-700 border-slate-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            }`}
            required
          ></textarea>

          {/* Department */}
          <div>
            <label className="block mb-2 font-medium">Select Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border ${
                isDark
                  ? "bg-slate-700 border-slate-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              required
            >
              <option value="">-- Select Department --</option>
              <option value="HR">Human Resources</option>
              <option value="ProjectManagers">Project Managers</option>
              <option value="Employees">Employees</option>
              <option value="All">All</option>
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPaperPlane /> Send Announcement
          </button>
        </form>
      </div>

      {/* List of Announcements */}
      <div
        className={`rounded-2xl shadow-md p-6 max-w-4xl transition-all ${
          isDark
            ? "bg-slate-800 border border-slate-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">All Announcements</h3>

        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          <ul className={`divide-y ${isDark ? "divide-slate-700" : "divide-gray-300"}`}>
            {announcements.map((a) => (
              <li key={a._id} className="py-4 flex justify-between items-start">
                <div>
                  <h4 className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                    {a.title}
                  </h4>

                  <p className="text-sm mt-1 text-gray-500">{a.message}</p>

                  <p className="text-xs text-gray-400 mt-1">
                    📢 Sent to: <span className="font-medium">{a.department}</span>
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
