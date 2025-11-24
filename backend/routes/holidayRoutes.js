import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const holidays = [
      { branch: "All", date: "2025-01-01", description: "New Year’s Day", type: "Mandatory" },
      { branch: "All", date: "2025-01-26", description: "Republic Day", type: "Mandatory" },
      { branch: "All", date: "2025-03-14", description: "Holi", type: "Mandatory" },
      { branch: "All", date: "2025-04-14", description: "Ambedkar Jayanti", type: "Optional" },
      { branch: "All", date: "2025-05-01", description: "Labour Day", type: "Mandatory" },
      { branch: "All", date: "2025-08-15", description: "Independence Day", type: "Mandatory" },
      { branch: "All", date: "2025-10-02", description: "Gandhi Jayanti", type: "Mandatory" },
      { branch: "All", date: "2025-10-21", description: "Diwali", type: "Mandatory" },
      { branch: "All", date: "2025-12-25", description: "Christmas", type: "Mandatory" },
    ];
    res.status(200).json(holidays);
  } catch (err) {
    console.error("Error fetching holidays:", err);
    res.status(500).json({ message: "Error fetching holidays" });
  }
});

export default router;
