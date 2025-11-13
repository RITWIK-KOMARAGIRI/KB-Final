import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  timeline: String,
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  files: [String], // store file URLs
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
});

export default mongoose.model("Project", projectSchema);
