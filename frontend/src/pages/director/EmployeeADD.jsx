  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import * as XLSX from "xlsx";
  import { saveAs } from "file-saver";

  function EmployeeADD() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [viewingEmployee, setViewingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("hr");
    const [HrDetails, setHrDetails] = useState([]);
    const [PmDetails, setPmDetails] = useState([]);
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
      assignedPm:"",
    });

    useEffect(() => {
      fetchEmployees();
      fetchHr();
      fetchPm();
    }, []);
  // console.log(formData.assignedHr )
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
  //   console.log(PmDetails)
  // console.log(HrDetails)
    const fetchHr = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/FetchHr");
        setHrDetails(res.data);
      } catch (error) {
        console.error("Error fetching HR details", error);
      }
    };

    const filterByRole = (role, data = employees) => {
      const filtered = data.filter((emp) => emp.role?.toLowerCase() === role);
      setFilteredEmployees(filtered);
    };

    const handleTabChange = (role) => {
      setActiveTab(role);
      setFormData({ ...formData, role: role });
      filterByRole(role);
      setSearchTerm("");
    };

    const handleSearch = (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);

      const filtered = employees
        .filter((emp) => emp.role?.toLowerCase() === activeTab)
        .filter((emp) =>
          Object.values(emp).some((val) =>
            val?.toString().toLowerCase().includes(term)
          )
        );

      setFilteredEmployees(filtered);
    };

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, photo: reader.result });
      reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        if (editingEmployee) {
          await axios.put(
            `http://localhost:5000/api/employees/${editingEmployee._id}`,
            formData
          );
        } else {
          await axios.post("http://localhost:5000/api/employees", formData);
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
        assignedHr: employee.assignedHr || "", // ObjectId
        assignedPm: employee.assignedPm || "", // ObjectId
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
        assignedPm:"",
      });
    };

    const dummyImage =
      "https://ndejjeuniversity.ac.ug/wp-content/uploads/2024/06/image-removebg-preview-2-1-300x296.png";

    const exportToExcel = () => {
      if (!filteredEmployees || filteredEmployees.length === 0) {
        alert("No employee data to export!");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(
        filteredEmployees.map((emp) => ({
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
          AssignedHR: emp.assignedHr
            ? HrDetails.find((hr) => hr._id === emp.assignedHr)?.name +
              " (" +
              HrDetails.find((hr) => hr._id === emp.assignedHr)?.email +
              ")"
            : "Not Assigned",

            assignedPm: emp.assignedPm
            ? PmDetails.find((pm) => pm._id === emp.assignedPm)?.name +
              " (" +
              PmDetails.find((pm) => pm._id === emp.assignedPm)?.email +
              ")"
            : "Not Assigned", 
        }))
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
      <div className="p-8 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">
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

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handleTabChange("hr")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "hr"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            HR ({employees.filter((e) => e.role === "hr").length})
          </button>
          <button
            onClick={() => handleTabChange("project managers")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "project managers"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Project Managers (
            {employees.filter((e) => e.role === "project managers").length})
          </button>
          <button
            onClick={() => handleTabChange("employee")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "employee"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Employees ({employees.filter((e) => e.role === "employee").length})
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Employee Cards */}
        {filteredEmployees.length === 0 ? (
          <p className="text-gray-500">No records found for {activeTab}.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((emp) => (
              <div
                key={emp._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={emp.photo || dummyImage}
                    alt={emp.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {emp.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{emp.email}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {emp.role?.toUpperCase()} • {emp.position}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm">
                  <strong>Department:</strong> {emp.department}
                </p>
                <p className="text-gray-700 font-medium">
                  <strong>Salary:</strong> ₹{emp.salary}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Mobile:</strong> {emp.mobile}
                </p>
                {/* Show HR Name/Email */}
                {emp.role !== "hr" && (
                  <p className="text-gray-600 text-sm">
                    <strong>Assigned HR:</strong>{"Mr/Ms. "}
                    {emp.assignedHr
      ? `Mr/Ms. ${emp.assignedHr.name} (${emp.assignedHr.email})`
      : "Not Assigned"}
                    {/* {emp.assignedHr
                      ? `${HrDetails.find((hr) => hr._id === emp.assignedHr)?.name || "Unknown"} (${
                          HrDetails.find((hr) => hr._id === emp.assignedHr)?.email || "No email"
                        })`
                      : "Not Assigned"} */}
                  </p>
                )}
                {/* Show PM Name/Email if role = employee */}
{emp.role === "employee" && (
  <p className="text-gray-600 text-sm">
    <strong>Assigned PM:</strong>{"Mr/Ms. "}
    {/* {emp?.assignedPm?.name} */}
    {emp.assignedPm
      ? `${PmDetails.find((pm) => pm._id === emp.assignedPm)?.name || "Unknown"}`
      //  (${
      //     PmDetails.find((pm) => pm._id === emp.assignedPm)?.email || "No email"
      //   })`
      : "Not Assigned"}
  </p>
)}

                

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    emp.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {emp.status}
                </span>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDelete(emp._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
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
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  className="w-full border p-2 rounded"
                  required
                />
               <div><span>DOB:</span> <input
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="date"
                  className="w-full border p-2 rounded"
                  required
                /></div>

                <input
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Position"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Department"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Salary"
                  type="number"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile"
                  className="w-full border p-2 rounded"
                />

                {/* HR Select */}
                {activeTab !== "hr" && (
                  <select
                    name="assignedHr"
                    value={formData.assignedHr}
                    onChange={handleChange}
                    className="w-full border p-2 rounded" 
                    required
                  >
                    <option value="">-- Select HR --</option>
                    {HrDetails.map((hr) => (
                      <option key={hr._id} value={hr._id}>
                        {hr.name} ({hr.email})
                      </option>
                    ))}
                  </select>
                )}
                {activeTab === "employee" && (
                  <select
  name="assignedPm"   // 👈 fix
  value={formData.assignedPm}
  onChange={handleChange}
  className="w-full border p-2 rounded"
   required
>
  <option value="" >-- Select PM --</option>
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
                  className="w-full border p-2 rounded"
                >
                  <option value="Active">Active</option>
                  <option value="InActive">InActive</option>
                </select>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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
