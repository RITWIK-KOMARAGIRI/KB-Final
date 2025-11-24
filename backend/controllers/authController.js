
// backend/controllers/authController.js (or wherever this is)
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SIGNIN with JWT
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("SIGNIN REQUEST:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let isMatch = false;

    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Login success
    const tokenPayload = {
      userId: user._id,
      role: user.role,
      employeeId: user.employee, // Employee _id
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      employeeId: user.employee, // this is Employee _id
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Save credentials - NOW using Employee _id in URL
// ✅ Save credentials - NOW using Employee _id in URL
export const credentialsSent = async (req, res) => {
  try {
    const { id } = req.params; // this is Employee _id from URL
    const { email, password, role } = req.body;

    console.log("CREDENTIALS REQUEST:", id, email, role);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find employee by _id
    const employeeDoc = await Employee.findById(id);
    if (!employeeDoc) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if credentials already exist for this employee
    const existingUser = await User.findOne({ employee: employeeDoc._id });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Credentials already created for this employee" });
    }

    // Update credentialstatus
    await Employee.findByIdAndUpdate(
      id,
      { credentialstatus: "Completed" },
      { new: true }
    );

    // ✅ Safe employeeId: use business employeeId if present, else fallback to _id
    const safeEmployeeId =
      employeeDoc.employeeId && employeeDoc.employeeId.trim() !== ""
        ? employeeDoc.employeeId
        : employeeDoc._id.toString();

    // Create User entry for login
    const user = await User.create({
      employeeId: safeEmployeeId,        // ✅ never empty now
      name: employeeDoc.name,
      email,
      password,                          // plain text for testing
      role,
      employee: employeeDoc._id,
    });

    res.status(201).json({ message: "Credentials created", user });
  } catch (error) {
    console.error("Error creating credentials:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const employeesAssigned = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).populate("employee");
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const projectManagersAssigned = async (req, res) => {
  try {
    const pms = await Employee.find({ role: "project managers" });
    res.json(pms);
  } catch (error) {
    console.error("Error fetching project managers:", error);
    res.status(500).json({ message: "Server error" });
  }
};
