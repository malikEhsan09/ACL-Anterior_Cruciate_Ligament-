import { uploadCloudinary } from "../utils/cloudinary.js";
import Club from "../models/club.model.js";
import Player from "../models/player.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

//? Create a new club form
export const submitClubForm = async (req, res) => {
  try {
    // Ensure the user creating the club is an admin
    const user = await User.findById(req.user.id);
    if (user.userType !== "Admin") {
      return res.status(403).json({ message: "Only admins can create clubs" });
    }

    // Extract all fields from the request body
    const {
      clubName,
      clubLocation,
      numOfMembers,
      maxCapacity,
      description,
      foundedYear,
      isActive,
    } = req.body;

    const existedClub = await Club.findOne({ clubName });
    if (existedClub) {
      return res.json({ msg: "Can't create new Club bcz it already exists" });
    }

    // Initialize formData with the extracted fields
    let formData = {
      clubName,
      clubLocation,
      numOfMembers,
      createdBy: req.user.id,
      description,
      foundedYear,
      isActive,
    };

    // Check if clubLogo file is included in the request
    if (req.files && req.files.clubLogo) {
      const clubLogo = req.files.clubLogo[0].path;
      const clubLogoResponse = await uploadCloudinary(clubLogo); // Upload club logo to Cloudinary
      formData.clubLogo = clubLogoResponse.url; // Set the clubLogo field to the Cloudinary URL
    }

    // Create a new Club instance using the formData
    const newClub = new Club(formData);

    console.log(newClub);
    // Save the club form data to the database
    await newClub.save();

    // Send a success response
    res.status(201).json({ message: "Club form submitted successfully" });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? Get all club forms
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? Get a club by ID, name, or location
export const getClub = async (req, res) => {
  try {
    const { id } = req.params;
    // const { clubName, clubLocation } = req[0]?.query;
    const { clubName, clubLocation } = req.body;
    // console.log(clubName, clubLocation);

    let club;

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      club = await Club.findById(id);
    } else if (clubName) {
      club = await Club.findOne({ clubName });
    } else if (clubLocation) {
      club = await Club.findOne({ clubLocation });
    } else {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json(club);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? Update a specific club form by ID
export const updateClubById = async (req, res) => {
  try {
    const {
      clubName,
      clubLocation,
      numOfMembers,
      maxCapacity,
      description,
      foundedYear,
      isActive,
    } = req.body;

    let updatedFields = {
      clubName,
      clubLocation,
      numOfMembers,
      maxCapacity,
      description,
      foundedYear,
      isActive,
    };

    // Check if clubLogo file is included in the request
    if (req.files && req.files.clubLogo) {
      const clubLogo = req.files.clubLogo[0].path;
      const clubLogoResponse = await uploadCloudinary(clubLogo); // Upload club logo to Cloudinary
      updatedFields.clubLogo = clubLogoResponse.url; // Set the clubLogo field to the Cloudinary URL
    }

    const updatedClub = await Club.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields }, // Use updatedFields instead of req.body
      { new: true }
    );

    if (!updatedClub) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({
      message: "Club updated successfully",
      club: updatedClub,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? Delete a specific club form by ID
export const deleteClubById = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // club deleted successfully, and sending a status code 200 with a message
    res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? Assign player to club
export const assignPlayerToClub = async (req, res) => {
  try {
    const { playerId, clubId } = req.body;

    // Ensure the user adding the player is an admin
    const user = await User.findById(req.user.id);
    if (user.userType !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only admins can assign players to clubs" });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Check if the player is already assigned to a club
    if (player.club) {
      return res
        .status(400)
        .json({ message: "Player is already assigned to a club" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Assign the player to the club
    player.club = clubId;
    await player.save();

    // Add the player ID to the club's players array
    club.players.push(playerId);
    club.numOfMembers += 1;
    await club.save();

    res
      .status(200)
      .json({ message: "Player assigned to club successfully", player, club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? remove assigned players from club By Admin.
export const removePlayerFromClub = async (req, res) => {
  try {
    const { playerId, clubId } = req.body;

    // Ensure the user removing the player is an admin
    const user = await User.findById(req.user.id);
    if (user.userType !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only admins can remove players from clubs" });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if the player is assigned to this club
    if (player.club.toString() !== clubId) {
      return res
        .status(400)
        .json({ message: "Player is not assigned to this club" });
    }

    // Remove the player from the club
    player.club = null;
    await player.save();

    // Remove the player ID from the club's players array
    club.players.pull(playerId);
    club.numOfMembers -= 1;
    await club.save();

    res
      .status(200)
      .json({ message: "Player removed from club successfully", player, club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//? create and Invite the player to join club
export const generateInviteLink = async (req, res) => {
  try {
    const { clubId } = req.body;

    // Ensure the user generating the link is an admin
    const user = await User.findById(req.user.id);
    if (user.userType !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only admins can generate invite links" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const token = jwt.sign({ clubId: club._id }, process.env.JWT, {
      expiresIn: "1d",
    });

    const inviteLink = `http://localhost:3000/api/club/acceptInvite/${token}`;

    res.status(200).json({ inviteLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ? Acceot Invite
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT);

    const club = await Club.findById(decoded.clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

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
      club: club._id,
    });

    await newPlayer.save();

    // Add the player ID to the club's players array
    club.players.push(newPlayer._id);
    club.numOfMembers += 1;
    await club.save();

    res.status(201).json({
      message: "Player registered and assigned to club successfully",
      player: newPlayer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
