import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // 1:1 chat between two employees (Employee model also used for HR/PM/Director)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
    ],
    lastMessageAt: { type: Date, default: Date.now },
    lastMessageText: { type: String },
    lastMessageFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    // Map of employeeId (as string) -> unread message count for that participant
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Index to speed up participant lookups
conversationSchema.index({ participants: 1 });

export default mongoose.model("Conversation", conversationSchema);