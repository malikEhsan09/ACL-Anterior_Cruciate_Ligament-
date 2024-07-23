import {
  addPlayer,
  createAdmin,
  deleteAdmin,
  deletePlayer,
  updateAdmin,
  updatePlayer,
} from "../controllers/admin.controller.js";
import { upload } from "../middleware/multerStorage.js";
import express from "express";

const router = express.Router();

router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), createAdmin);
router.patch(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateAdmin
);
router.delete("/:id", deleteAdmin);

// player routes
router.post(
  "/player",
  upload.fields([{ name: "image", maxCount: 1 }]),
  addPlayer
);
router.patch(
  "/player/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updatePlayer
);
router.delete("/player/:id", deletePlayer);

export default router;
