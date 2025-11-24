import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Pending" },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("PerformanceReport", performanceSchema);
