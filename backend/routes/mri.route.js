import express from "express";
import { verifyToken } from "../middleware/auth.mw.js";
import { uploadMRI } from "../middleware/multerStorage.js";
import {
  getAllMRIFiles,
  getMRIFile,
  uploadMRIFile,
} from "../controllers/mriFile.controller.js";

const router = express.Router();

router.post("/upload", verifyToken, uploadMRI.single("mriFile"), uploadMRIFile);
// router.post("/upload", verifyToken, uploadMRI, uploadMRIFile);
router.get("/:id", verifyToken, getMRIFile);
router.get("/", verifyToken, getAllMRIFiles);

export default router;
