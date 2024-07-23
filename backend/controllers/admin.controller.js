import Admin from "../models/admin.model.js";
import Player from "../models/player.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
// import User from "../models/user.model.js";

//? Create a new admin
export const createAdmin = async (req, res) => {
  try {
    const { userID, name, phoneNumber, CNIC } = req.body;
    const image = req.files?.image?.[0]?.path;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageResponse = await uploadCloudinary(image);

    if (!imageResponse || !imageResponse.url) {
      return res.status(400).json({ message: "Failed to upload image" });
    }

    const newAdmin = new Admin({
      userID,
      name,
      phoneNumber,
      CNIC,
      image: imageResponse.url,
    });

    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update admin information
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber, CNIC } = req.body;
    let image;

    if (req.files?.image?.[0]?.path) {
      image = await uploadCloudinary(req.files.image[0].path);
    }

    const updateData = { name, phoneNumber, CNIC };
    if (image) {
      updateData.image = image.url;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res
      .status(200)
      .json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete admin information
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new player
export const addPlayer = async (req, res) => {
  try {
    const {
      userID,
      name,
      age,
      dateOfBirth,
      address,
      gender,
      nationality,
      phoneNumber,
      club,
      isMember,
      doctorID,
      adminID,
    } = req.body;

    const newPlayer = new Player({
      userID,
      name,
      age,
      dateOfBirth,
      address,
      gender,
      nationality,
      phoneNumber,
      club,
      isMember,
      doctorID,
      adminID,
    });

    await newPlayer.save();

    res
      .status(201)
      .json({ message: "Player added successfully", player: newPlayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update player information
export const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      age,
      dateOfBirth,
      address,
      gender,
      nationality,
      phoneNumber,
      club,
      isMember,
      doctorID,
      adminID,
    } = req.body;

    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      {
        name,
        age,
        dateOfBirth,
        address,
        gender,
        nationality,
        phoneNumber,
        club,
        isMember,
        doctorID,
        adminID,
      },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res
      .status(200)
      .json({ message: "Player updated successfully", player: updatedPlayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete player information
export const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlayer = await Player.findByIdAndDelete(id);

    if (!deletedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
