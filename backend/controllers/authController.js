import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("SIGNIN REQUEST:", email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let isMatch = false;

    // Case 1: Password stored as bcrypt hash
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Case 2: Stored in plain text (for testing)
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Login success
    res.json({
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      employeeId: user.employee,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Save credentials without bcrypt (testing only)
export const credentialsSent = async (req, res) => {
  try {
    const { id } = req.params; // employeeId from URL
    const { email, password, role } = req.body;

    console.log("CREDENTIALS REQUEST:", id, email, role);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user already exists for this employee
    const existingUser = await User.findOne({ employeeId: id });
    if (existingUser) {
      return res.status(400).json({ message: "Credentials already created for this employee" });
    }

    // Get employee doc
    const employeeDoc = await Employee.findOne({ employeeId: id });
    if (!employeeDoc) {
      return res.status(404).json({ message: "Employee not found" });
    }else{  
             const updateEmployee = await Employee.findOneAndUpdate(
               { employeeId: id },
               { credentialstatus: "Completed" },
               { new: true }
             );
            
    }

    // Save user with plain text password ❌ (testing only)
    const user = await User.create({
      employeeId: id,
      name: employeeDoc.name,
      email,
      password, // plain text
      role,
      employee: employeeDoc._id,
    });

    res.status(201).json({ message: "Credentials created", user });
  } catch (error) {
    console.error("Error creating credentials:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fetch all employees with linked Employee doc
export const employeesAssigned = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).populate("employee");
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fetch all Project Managers (PMs) from Users
export const projectManagersAssigned = async (req, res) => {
  try {
    const pms = await Employee.find({ role: "project managers" });
    res.json(pms);
  } catch (error) {
    console.error("Error fetching project managers:", error);
    res.status(500).json({ message: "Server error" });
  }
};
