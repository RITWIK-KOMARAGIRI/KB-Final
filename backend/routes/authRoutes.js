import express from "express";
import {
  signin,
  credentialsSent,
  employeesAssigned,
  projectManagersAssigned,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/credentials/:id", credentialsSent);
router.get("/employees", employeesAssigned);
router.get("/pms", projectManagersAssigned); // 👈 New route

export default router;
