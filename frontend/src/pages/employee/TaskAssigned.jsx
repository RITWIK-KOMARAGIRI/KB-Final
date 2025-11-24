import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

const TaskAssigned = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { theme } = useContext(ThemeContext);
  const userId = JSON.parse(localStorage.getItem("users")).employeeId;

  // --- Performance Modal States ---
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [report, setReport] = useState({ description: "", status: "" });

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/task/${userId}`
        );
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

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/projects/updateTaskStatus/${userId}/${taskId}`,
        { status: newStatus }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      alert(res.data.message);
    } catch (err) {
      alert("❌ Failed to update status.");
    }
  };

  // Submit performance report
  const submitPerformance = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/performance/submit",
        {
          employeeId: userId,
          taskId: selectedTask._id,
          title: selectedTask.title,
          description: report.description,
          status: report.status,
        }
      );

      alert("Performance Submitted!");
      setOpenModal(false);
      setReport({ description: "", status: "" }); // reset
    } catch (err) {
      alert("❌ Error submitting performance");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <div
        className={`p-8 rounded-xl shadow max-w-5xl mx-auto transition-all duration-300
        ${
          theme === "dark"
            ? "bg-[#0d0f27] text-gray-200 border border-gray-700"
            : "bg-white text-gray-900 border border-gray-200"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 ${
            theme === "dark" ? "text-blue-400" : "text-blue-700"
          }`}
        >
          📋 Tasks Assigned
        </h2>

        {error && (
          <div
            className={`p-4 rounded mb-4 transition-all duration-300 ${
              theme === "dark"
                ? "bg-red-900 text-red-300"
                : "bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {tasks.length > 0 && (
          <div className="overflow-x-auto">
            <table
              className={`min-w-full border rounded-lg transition-all duration-300 ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <thead
                className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
              >
                <tr>
                  {[
                    "Title",
                    "Description",
                    "Files / Links",
                    "Timeline",
                    "Status",
                    "Performance",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className={`py-2 px-4 border ${
                        theme === "dark"
                          ? "border-gray-700 text-gray-300"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tasks.map((task, idx) => (
                  <tr
                    key={task._id}
                    className={
                      theme === "dark"
                        ? idx % 2 === 0
                          ? "bg-[#1b1e33]"
                          : "bg-[#15172b]"
                        : idx % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }
                  >
                    <td className="py-2 px-4 border">{task.title}</td>

                    <td className="py-2 px-4 border">{task.description}</td>

                    <td className="py-2 px-4 border">
                      {task.files && task.files.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {task.files.map((f, i) => (
                            <a
                              key={i}
                              href={
                                f.startsWith("http")
                                  ? f
                                  : `http://localhost:5000${f}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`underline text-sm transition-all duration-300 ${
                                theme === "dark"
                                  ? "text-blue-300"
                                  : "text-blue-600"
                              }`}
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
                      {task.timeline
                        ? new Date(task.timeline).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="py-2 px-4 border">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded cursor-pointer transition-all duration-300 ${
                          task.status === "Completed"
                            ? "bg-green-200 text-green-800"
                            : task.status === "In Progress"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Submit Performance Button */}
                    <td className="py-2 px-4 border text-center">
                      <button
                        className="px-3 py-1 bg-purple-600 text-white rounded-lg"
                        onClick={() => {
                          setSelectedTask(task);
                          setOpenModal(true);
                        }}
                      >
                        Submit Performance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Submit Performance
            </h2>

            <label className="block font-medium">Description</label>
            <textarea
              className="w-full border p-2 rounded mb-3"
              value={report.description}
              onChange={(e) =>
                setReport({ ...report, description: e.target.value })
              }
            />

            <label className="block font-medium">Status</label>
            <select
              className="w-full border p-2 rounded mb-4"
              value={report.status}
              onChange={(e) =>
                setReport({ ...report, status: e.target.value })
              }
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={submitPerformance}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskAssigned;
