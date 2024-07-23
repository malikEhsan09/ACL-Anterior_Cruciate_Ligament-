import express from "express";
import {
  createPromo,
  assignPromoToPlayer,
  validatePromoCode,
} from "../controllers/promo.controller.js";

const router = express.Router();

// Create a new promo code
router.post("/create", createPromo);

// Assign a promo code to a player
router.post("/assign-to-player", assignPromoToPlayer);

// Validate a promo code
router.post("/validate", validatePromoCode);

export default router;
