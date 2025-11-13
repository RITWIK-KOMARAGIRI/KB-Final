import mongoose from "mongoose";

const projectSubSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  timeline: String,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  files: [String],
});

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true },
    name: { type: String, required: true },
    dob: { type: Date },                      // ✅ added
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["employee", "project managers", "hr", "director"],
      default: "employee",
    },
    position: { type: String },               // ✅ added
    department: { type: String },             // ✅ added
    salary: { type: Number },                 // ✅ added
    mobile: { type: Number },                 // ✅ added
    status: { type: String, default: "Active" }, // ✅ added
    photo: { type: String },                  // ✅ added (Base64)
    assignedPm: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    assignedHr: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    projects: [projectSubSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);