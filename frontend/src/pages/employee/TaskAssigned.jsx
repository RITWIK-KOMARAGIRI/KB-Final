import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskAssigned = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = JSON.parse(localStorage.getItem("users")).employeeId;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/task/${userId}`);
        if (res.data.length > 0) setTasks(res.data);
        else setError("⚠️ No tasks found.");
      } catch (err) {
        setError("❌ Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [userId]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/projects/updateTaskStatus/${userId}/${taskId}`,
        { status: newStatus }
      );
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task))
      );
      alert(res.data.message);
    } catch (err) {
      alert("❌ Failed to update status.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-8 bg-white rounded-xl shadow max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📋 Tasks Assigned</h2>
      {error && <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>}

      {tasks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Files / Links</th>
                <th className="py-2 px-4 border">Timeline</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={task._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-2 px-4 border">{task.title}</td>
                  <td className="py-2 px-4 border">{task.description}</td>
                  <td className="py-2 px-4 border">
                    {task.files && task.files.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {task.files.map((f, i) => (
                          <a
                            key={i}
                            href={f.startsWith("http") ? f : `http://localhost:5000${f}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            {f.startsWith("http") ? f : `File ${i + 1}`}
                          </a>
                        ))}
                      </div>
                    ) : (
                      "No files/links"
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {task.timeline ? new Date(task.timeline).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-2 px-4 border">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`px-2 py-1 rounded ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskAssigned;
