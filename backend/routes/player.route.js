import express from "express";
import { upload } from "../middleware/multerStorage.js";

import {
  bookAppointment,
  createPlayer,
  deletePlayerById,
  getAllPlayers,
  getPlayerAppointments,
  getPlayerById,
  getPlayerReport,
  updatePlayerById,
} from "../controllers/player.controller..js";
// import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// Create a new player
router.post(
  "/",
  // verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    // { name: "clubLogo", maxCount: 1 },
  ]),
  createPlayer
);

// Get all player
router.get("/", getAllPlayers);

// Get a single student by ID
router.get("/:id", getPlayerById);

router.patch(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updatePlayerById
);

// Delete a student by ID
// * verifyToken, is mein use hoa va tha as a middle ware
router.delete("/:id", deletePlayerById);



// Book an Appointment
router.post("/appointment", bookAppointment);
router.get("/appointments/:playerID", getPlayerAppointments);
router.get("/report/:playerID", getPlayerReport);





export default router;
