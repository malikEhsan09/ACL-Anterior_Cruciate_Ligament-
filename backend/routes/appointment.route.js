import express from "express";
import {
  getAppointments,
  bookAppointment,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/book", bookAppointment);
router.get("/", getAppointments);

export default router;
