import Player from "../models/player.model.js";
import User from "../models/user.model.js";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";

import { uploadCloudinary } from "../utils/cloudinary.js";

export const createPlayer = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);

    const {
      userID,
      name,
      age,
      dateOfBirth,
      address,
      gender,
      nationality,
      phoneNumber,
      isMember,
    } = req.body;

    const image = req.files?.image?.[0]?.path;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageResponse = await uploadCloudinary(image);
    console.log("Image  is uploaded on cloudinary", imageResponse.url);

    const newPlayer = new Player({
      userID,
      name,
      age,
      dateOfBirth,
      address,
      gender,
      nationality,
      phoneNumber,
      image: imageResponse.url,
      isMember,
    });

    await newPlayer.save();

    res
      .status(201)
      .json({ message: "Player created successfully", player: newPlayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all Players
export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get palyer by ID
export const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    return res.status(200).json(player);
  } catch (error) {
    console.error("Error fetching player by ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ? update player by Id
export const updatePlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body };

    if (req.files && req.files.image) {
      const image = req.files.image[0].path;
      const imageResponse = await uploadCloudinary(image);
      updateFields.image = imageResponse.url;
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json({
      message: "Player updated successfully",
      player: updatedPlayer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete student by ID
export const deletePlayerById = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // If needed, remove the reference from the associated user
    const user = await User.findOne({ playerInfo: player._id });
    if (user) {
      user.playerInfo = null;
      await user.save();
    }

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ? Player can book an appointment

// Book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const { playerID, doctorID, slot, type } = req.body;

    // Check if the player exists
    const player = await Player.findById(playerID);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Check if the doctor exists
    const doctorExits = await Doctor.findById(doctorID);
    if (!doctorExits) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if the slot is available
    const appointmentExists = await Appointment.findOne({
      doctorID,
      slot,
      type,
    });

    if (appointmentExists) {
      return res.status(400).json({ message: "Slot is already booked" });
    }

    const newAppointment = new Appointment({
      playerID,
      doctorID,
      slot,
      type,
    });

    await newAppointment.save();

    // Update doctor to include this player in their record
    const doctor = await Doctor.findById(doctorID);
    if (!doctor.players.includes(playerID)) {
      doctor.players.push(playerID);
      await doctor.save();
    }

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get appointments for a player
export const getPlayerAppointments = async (req, res) => {
  try {
    const { playerID } = req.params;

    // check if the player exists
    const player = await Player.findById(playerID);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const appointments = await Appointment.find({ playerID }).populate(
      "doctorID"
    );

    if (!appointments) {
      return res.status(404).json({ message: "Appointments not found" });
    }
    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get player report
export const getPlayerReport = async (req, res) => {
  try {
    const { playerID } = req.params;
    const player = await Player.findById(playerID).populate("doctorID");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Assuming reports are part of player schema or related documents
    res.status(200).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
