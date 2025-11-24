import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ThemeContext } from "../../context/ThemeContext";

function EmployeeADD() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("hr"); // "hr" | "project managers" | "employee"
  const [HrDetails, setHrDetails] = useState([]);
  const [PmDetails, setPmDetails] = useState([]);

  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    dob: "",
    email: "",
    role: "employee",
    position: "",
    department: "",
    salary: "",
    mobile: "",
    status: "Active",
    photo: "",
    assignedHr: "",
    assignedPm: "",
  });

  const dummyImage =
    "https://ndejjeuniversity.ac.ug/wp-content/uploads/2024/06/image-removebg-preview-2-1-300x296.png";

  useEffect(() => {
    fetchEmployees();
    fetchHr();
    fetchPm();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
      filterByRole(activeTab, res.data);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  const fetchPm = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fetchPms");
      setPmDetails(res.data);
    } catch (error) {
      console.error("Error fetching PM details", error);
    }
  };

  const fetchHr = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/FetchHr");
      setHrDetails(res.data);
    } catch (error) {
      console.error("Error fetching HR details", error);
    }
  };

  const filterByRole = (role, data = employees) => {
    const filtered = data.filter(
      (emp) => emp.role?.toLowerCase() === role.toLowerCase()
    );
    setFilteredEmployees(filtered);
  };

  const handleTabChange = (role) => {
    setActiveTab(role);
    setFormData((prev) => ({
      ...prev,
      role: role,
      assignedHr: "",
      assignedPm: "",
    }));
    filterByRole(role);
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = employees
      .filter(
        (emp) => emp.role?.toLowerCase() === activeTab.toLowerCase()
      )
      .filter((emp) =>
        Object.values(emp).some((val) =>
          val?.toString().toLowerCase().includes(term)
        )
      );

    setFilteredEmployees(filtered);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      role: activeTab, // ensure role matches tab
    };

    console.log("CREATE / UPDATE EMPLOYEE PAYLOAD:", payload);

    try {
      if (editingEmployee) {
        await axios.put(
          `http://localhost:5000/api/employees/${editingEmployee._id}`,
          payload
        );
      } else {
        await axios.post("http://localhost:5000/api/employees", payload);
      }

      setIsModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
      resetForm();
      alert("Data Saved Successfully");
    } catch (err) {
      console.error("Error saving employee", err);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeId: employee.employeeId || "",
      name: employee.name || "",
      dob: employee.dob ? employee.dob.split("T")[0] : "",
      email: employee.email || "",
      role: employee.role || activeTab || "",
      position: employee.position || "",
      department: employee.department || "",
      salary: employee.salary || "",
      mobile: employee.mobile || "",
      status: employee.status || "Active",
      photo: employee.photo || "",
      // if populated, it's an object; if not, it's an id string
      assignedHr:
        typeof employee.assignedHr === "object"
          ? employee.assignedHr._id
          : employee.assignedHr || "",
      assignedPm:
        typeof employee.assignedPm === "object"
          ? employee.assignedPm._id
          : employee.assignedPm || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error("Error deleting employee", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      name: "",
      role: activeTab,
      dob: "",
      email: "",
      position: "",
      department: "",
      salary: "",
      mobile: "",
      status: "Active",
      photo: "",
      assignedHr: "",
      assignedPm: "",
    });
  };

  // ========================= EXPORT EXCEL =============================
  const exportToExcel = () => {
    if (!filteredEmployees || filteredEmployees.length === 0) {
      alert("No employee data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredEmployees.map((emp) => {
        // Resolve HR name (works for populated object or id)
        let assignedHrName = "Not Assigned";
        if (emp.assignedHr) {
          if (typeof emp.assignedHr === "object") {
            // populated: { _id, name, email }
            assignedHrName = emp.assignedHr.name || "Not Assigned";
          } else {
            const hr = HrDetails.find((hr) => hr._id === emp.assignedHr);
            assignedHrName = hr?.name || "Not Assigned";
          }
        }

        // Resolve PM name
        let assignedPmName = "Not Assigned";
        if (emp.assignedPm) {
          if (typeof emp.assignedPm === "object") {
            assignedPmName = emp.assignedPm.name || "Not Assigned";
          } else {
            const pm = PmDetails.find((pm) => pm._id === emp.assignedPm);
            assignedPmName = pm?.name || "Not Assigned";
          }
        }

        return {
          Id: emp.employeeId,
          Name: emp.name,
          DOB: emp.dob ? new Date(emp.dob).toLocaleDateString() : "",
          Role: emp.role,
          Email: emp.email,
          Position: emp.position,
          Department: emp.department,
          Salary: emp.salary,
          Mobile: emp.mobile,
          Status: emp.status,
          AssignedHR: assignedHrName,
          AssignedPM: assignedPmName,
        };
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Employee_List.xlsx");
  };

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-700"
          }`}
        >
          Employee Management System
        </h2>

        <div className="flex space-x-4">
          <button
            onClick={() => {
              resetForm();
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {activeTab === "hr" && "+ Add HR"}
            {activeTab === "project managers" && "+ Add Project Manager"}
            {activeTab === "employee" && "+ Add Employee"}
          </button>

          <button
            onClick={exportToExcel}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-4">
        {["hr", "project managers", "employee"].map((role) => (
          <button
            key={role}
            onClick={() => handleTabChange(role)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === role
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {role === "hr" &&
              `HR (${employees.filter((e) => e.role === "hr").length})`}
            {role === "project managers" &&
              `Project Managers (${
                employees.filter((e) => e.role === "project managers").length
              })`}
            {role === "employee" &&
              `Employees (${
                employees.filter((e) => e.role === "employee").length
              })`}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder={`Search ${activeTab}...`}
        value={searchTerm}
        onChange={handleSearch}
        className={`w-full border p-2 rounded mb-4 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900"
        }`}
      />

      {/* EMPLOYEE CARDS */}
      {filteredEmployees.length === 0 ? (
        <p className="text-gray-400">No records found for {activeTab}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => {
            // Resolve names for UI as well
            let assignedHrName = "Not Assigned";
            if (emp.assignedHr) {
              if (typeof emp.assignedHr === "object") {
                assignedHrName = emp.assignedHr.name || "Not Assigned";
              } else {
                const hr = HrDetails.find((hr) => hr._id === emp.assignedHr);
                assignedHrName = hr?.name || "Not Assigned";
              }
            }

            let assignedPmName = "Not Assigned";
            if (emp.assignedPm) {
              if (typeof emp.assignedPm === "object") {
                assignedPmName = emp.assignedPm.name || "Not Assigned";
              } else {
                const pm = PmDetails.find((pm) => pm._id === emp.assignedPm);
                assignedPmName = pm?.name || "Not Assigned";
              }
            }

            return (
              <div
                key={emp._id}
                className={`rounded-xl shadow-lg p-6 border transition-all ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                {/* Top section */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={emp.photo || dummyImage}
                    alt={emp.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{emp.name}</h3>
                    <p className="opacity-80 text-sm">{emp.email}</p>
                    <p className="opacity-90 text-sm mt-1">
                      {emp.role?.toUpperCase()} • {emp.position}
                    </p>
                  </div>
                </div>

                <p>
                  <strong>Department:</strong> {emp.department}
                </p>
                <p>
                  <strong>Salary:</strong> ₹{emp.salary}
                </p>
                <p>
                  <strong>Mobile:</strong> {emp.mobile}
                </p>

                {/* Assigned HR */}
                {emp.role !== "hr" && (
                  <p>
                    <strong>Assigned HR:</strong> {assignedHrName}
                  </p>
                )}

                {/* Assigned PM */}
                {emp.role === "employee" && (
                  <p>
                    <strong>Assigned PM:</strong> {assignedPmName}
                  </p>
                )}

                {/* Status */}
                <span
                  className={`inline-block px-3 py-1 mt-2 rounded-full text-sm font-medium ${
                    emp.status === "Active"
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {emp.status}
                </span>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================= MODAL FORM ========================== */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg w-full max-w-lg ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <h3 className="text-xl font-bold mb-4">
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={formData.photo || dummyImage}
                  alt="preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <input
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Employee ID"
                  className={`w-full border p-2 rounded ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`p-2 rounded border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className={`w-full border p-2 rounded ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                required
                className={`w-full border p-2 rounded ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />

              <div>
                <span>DOB:</span>
                <input
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="date"
                  required
                  className={`w-full border p-2 rounded ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>

              <input
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Position"
                className={`w-full border p-2 rounded ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />

              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
                className={`w-full border p-2 rounded ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />

              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Salary"
                type="number"
                className={`w-full border p-2 rounded ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />

              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                className={`w-full border p-2 rounded ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />

              {/* ONLY NON-HR SHOULD SELECT HR */}
              {activeTab !== "hr" && (
                <select
                  name="assignedHr"
                  value={formData.assignedHr}
                  onChange={handleChange}
                  required
                  className={`w-full border p-2 rounded ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="">-- Select HR --</option>
                  {HrDetails.map((hr) => (
                    <option key={hr._id} value={hr._id}>
                      {hr.name} ({hr.email})
                    </option>
                  ))}
                </select>
              )}

              {/* PM Selection only for EMPLOYEE */}
              {activeTab === "employee" && (
                <select
                  name="assignedPm"
                  value={formData.assignedPm}
                  onChange={handleChange}
                  required
                  className={`w-full border p-2 rounded ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="">-- Select PM --</option>
                  {PmDetails.map((pm) => (
                    <option key={pm._id} value={pm._id}>
                      {pm.name} ({pm.email})
                    </option>
                  ))}
                </select>
              )}

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full border p-2 rounded ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  {editingEmployee ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeADD;
