import React, { useEffect, useState } from "react";
import axios from "axios";

const MyTeam = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeline: "",
    files: null,
    links: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const pmId = JSON.parse(localStorage.getItem("users")).employeeId;
        const res = await axios.get(
          `http://localhost:5000/api/projects/employees/pm/${pmId}`
        );
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleOpenModal = (employee, editing = false, task = null) => {
    setSelectedEmployee(employee);
    setIsEditing(editing);
    setSelectedTask(task);

    if (editing && task) {
      const linksFromFiles = task.files
        ? task.files.filter((f) => f.startsWith("http")).join(", ")
        : "";
      setFormData({
        title: task.title || "",
        description: task.description || "",
        timeline: task.timeline ? task.timeline.split("T")[0] : "",
        files: null,
        links: linksFromFiles,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        timeline: "",
        files: null,
        links: "",
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setSelectedTask(null);
    setIsEditing(false);
    setFormData({
      title: "",
      description: "",
      timeline: "",
      files: null,
      links: "",
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") setFormData({ ...formData, files });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("timeline", formData.timeline);
      if (!isEditing) data.append("status", "Pending");
      data.append("employeeId", selectedEmployee._id);

      if (formData.files) {
        Array.from(formData.files).forEach((file) => data.append("files", file));
      }
      if (formData.links) {
        formData.links.split(",").map((link) => data.append("files", link.trim()));
      }

      let res;
      if (isEditing && selectedTask) {
        res = await axios.post(
          `http://localhost:5000/api/projects/updateProject/${selectedEmployee._id}/${selectedTask._id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await axios.post(
          "http://localhost:5000/api/projects/assignProject",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      alert(res.data.message);

      setEmployees((prev) =>
        prev.map((emp) => (emp._id === selectedEmployee._id ? res.data.employee : emp))
      );

      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save task");
    }
  };

  if (loading) return <p className="p-4">Loading team members...</p>;
  if (employees.length === 0) return <p className="p-4">No team members found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👥 My Team</h1>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Tasks</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{emp.name}</td>
                <td className="px-4 py-2 border">{emp.email}</td>
                <td className="px-4 py-2 border">{emp.role}</td>
                <td className="px-4 py-2 border text-center">
                  {emp.projects && emp.projects.length > 0 ? (
                    <div className="flex flex-col gap-2 items-center">
                      {emp.projects.map((proj) => (
                        <div
                          key={proj._id}
                          className="flex flex-col gap-1 border p-2 rounded w-full"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-green-600 font-semibold">✅ {proj.title}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-sm font-medium ${
                                proj.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : proj.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {proj.status}
                            </span>
                            <button
                              onClick={() => handleOpenModal(emp, true, proj)}
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              Edit
                            </button>
                          </div>
                        
                          
                        </div>
                      ))}
                      <button
                        onClick={() => handleOpenModal(emp)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mt-2"
                      >
                        ➕ Add Another Task
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(emp)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Assign Task
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing
                ? `Edit Task for ${selectedEmployee?.name}`
                : `Assign Task to ${selectedEmployee?.name}`}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  rows="3"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Timeline</label>
                <input
                  type="date"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Attach Files</label>
                <input
                  type="file"
                  name="files"
                  onChange={handleChange}
                  multiple
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Add Links (comma separated)
                </label>
                <input
                  type="text"
                  name="links"
                  value={formData.links}
                  onChange={handleChange}
                  placeholder="https://example.com, https://example2.com"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {isEditing ? "Update" : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeam;
