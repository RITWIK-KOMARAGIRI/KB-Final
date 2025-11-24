import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByHr,
  getEmployeeById
} from "../controllers/employeeController.js";

const router = Router();

router.get("/", getEmployees);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.get("/hr/:hrId", getEmployeesByHr);
router.get("/:id", getEmployeeById);


export default router;
