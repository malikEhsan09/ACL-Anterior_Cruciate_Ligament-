import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  createOrUpdateSchedule,
  getDoctorSchedule,
  getDoctorAppointments,
  cancelAppointment,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

// manage scheduled Doctor tasks
router.post("/schedule", createOrUpdateSchedule);
router.get("/schedule/:doctorID", getDoctorSchedule);
router.get("/appointments/:doctorID", getDoctorAppointments);
router.delete("/appointment/:appointmentID", cancelAppointment);

export default router;
