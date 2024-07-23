import Promo from "../models/promo.model.js";
import Player from "../models/player.model.js";

// Create a new promo code
export const createPromo = async (req, res) => {
  try {
    const { promoId, name, description, startDate, endDate, maxUses } =
      req.body;

    const existingPromo = await Promo.findOne({ promoId });
    if (existingPromo) {
      return res.status(400).json({ message: "Promo code already exists" });
    }

    const newPromo = new Promo({
      promoId,
      name,
      description,
      startDate,
      endDate,
      maxUses,
    });

    await newPromo.save();
    res
      .status(201)
      .json({ message: "Promo code created successfully", promo: newPromo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign a promo code to a player
export const assignPromoToPlayer = async (req, res) => {
  try {
    const { playerId, promoId } = req.body;
    // const { userID } = req.Player.userID;
    // console.log(userID);

    const promo = await Promo.findOne({ promoId });
    if (!promo || !promo.isActive) {
      return res
        .status(404)
        .json({ message: "Invalid or inactive promo code" });
    }

    if (promo.currentUses >= promo.maxUses) {
      return res.status(400).json({ message: "Promo code has been used up" });
    }

    const alreadyUsed = await Player.findOne({ promoCode: promoId });
    if (alreadyUsed) {
      return res.status(400).json({
        message: "Promo code has already been used we can not reassign",
      });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    player.promoCode = promoId;
    await player.save();

    promo.currentUses += 1;
    await promo.save();

    res
      .status(200)
      .json({ message: "Promo code assigned to player successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate promo code usage
export const validatePromoCode = async (req, res) => {
  try {
    const { promoId } = req.body;

    const promo = await Promo.findOne({ promoId });
    if (!promo || !promo.isActive) {
      return res
        .status(404)
        .json({ message: "Invalid or inactive promo code" });
    }

    if (promo.currentUses >= promo.maxUses) {
      return res.status(400).json({ message: "Promo code has been used up" });
    }

    res.status(200).json({ message: "Promo code is valid", promo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
