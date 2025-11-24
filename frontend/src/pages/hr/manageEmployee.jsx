import React, { useEffect, useState } from "react";
import axios from "axios";

const emptyForm = {
  name: "",
  position: "",
  role: "",
  department: "",
  email: "",
  mobile: "",
  salary: "",
  status: "Active",
  credentialstatus: "Pending",
  dob: "",
};

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // safe parse for localStorage
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("users")) || null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchEmployees = async () => {
      if (!currentUser?.employeeId) {
        setError("Current HR user not found in localStorage.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        // 🔹 MATCHES: getEmployeesByHr -> GET /api/employees/hr/:hrId
        const res = await axios.get(
          `http://localhost:5000/api/employees/hr/${currentUser.employeeId}`,
          { cancelToken: source.token }
        );

        const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        setEmployees(data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error(err);
          setError("Failed to fetch employees. Check server connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
    return () => source.cancel("Component unmounted");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEditModal = (employee) => {
    setForm({
      name: employee.name || "",
      position: employee.position || "",
      role: employee.role || "",
      department: employee.department || "",
      email: employee.email || "",
      mobile: employee.mobile || "",
      salary: employee.salary || "",
      status: employee.status || "Active",
      credentialstatus: employee.credentialstatus || "Pending",
      dob: employee.dob ? employee.dob.split("T")[0] : "",
    });
    setEditId(employee._id || employee.id);
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setForm(emptyForm);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      setError("Please fill in at least name and email.");
      return;
    }
    if (!editId) {
      setError("No employee selected for edit.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // 🔹 MATCHES: updateEmployee -> PUT /api/employees/:id
      const res = await axios.put(
        `http://localhost:5000/api/employees/${editId}`,
        form
      );

      const updated = res.data;

      setEmployees((prev) =>
        prev.map((p) =>
          p._id === updated._id || p.id === updated._id ? updated : p
        )
      );

      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save employee. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Employees</h1>
            <p className="text-sm text-gray-500 mt-1">
              HR Dashboard — {employees.length}{" "}
              {employees.length === 1 ? "employee" : "employees"}
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-6 bg-white rounded-lg shadow-sm border" />
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="p-6 bg-white rounded-lg border text-gray-600">
            No employees available.
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
            <table className="min-w-full text-left text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-5">Employee ID</th>
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-5">Position</th>
                  <th className="py-3 px-5">Department</th>
                  <th className="py-3 px-5">Email</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp, index) => {
                  const displayId = emp.employeeId || emp.id || emp._id?.slice(-6);
                  return (
                    <tr
                      key={emp._id || emp.id || index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="py-3 px-5 text-sm">{displayId}</td>
                      <td className="py-3 px-5">
                        <div className="font-medium text-gray-800">{emp.name}</div>
                        <div className="text-xs text-gray-500">{emp.role}</div>
                      </td>
                      <td className="py-3 px-5">{emp.position || "-"}</td>
                      <td className="py-3 px-5">{emp.department || "-"}</td>
                      <td className="py-3 px-5">
                        <div className="truncate max-w-[12rem]">
                          {emp.email || "-"}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            emp.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : emp.status === "On Leave"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {emp.status || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !submitting && closeModal()}
          />

          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Employee</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* same form fields as before */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g. Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g. Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g. Design"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g. 45000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DOB
                </label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Resigned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential Status
                </label>
                <select
                  name="credentialstatus"
                  value={form.credentialstatus}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-md border hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageEmployee;
  