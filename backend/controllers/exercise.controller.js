import { uploadCloudinary } from "../utils/cloudinary.js";
import Exercise from "../models/exercises.model.js";
import Player from "../models/player.model.js";
import User from "../models/user.model.js";

// Create a new exercise
export const createExercise = async (req, res) => {
  try {
    const { title } = req.body;
    const createdBy = req.user.id;

    if (!title) {
      return res.status(404).json({
        msg: "Exercise not created bcz you have not provided the title",
      });
    }

    const partiallyDamages = [];
    const completelyRuptured = [];
    const tutorials = [];

    if (req.files && req.files.partiallyDamages) {
      for (const file of req.files.partiallyDamages) {
        const uploadResponse = await uploadCloudinary(file.path);
        partiallyDamages.push(uploadResponse.url);
      }
    }

    if (req.files && req.files.completelyRuptured) {
      for (const file of req.files.completelyRuptured) {
        const uploadResponse = await uploadCloudinary(file.path);
        completelyRuptured.push(uploadResponse.url);
      }
    }

    if (req.files && req.files.tutorials) {
      for (const file of req.files.tutorials) {
        const uploadResponse = await uploadCloudinary(file.path);
        tutorials.push(uploadResponse.url);
      }
    }

    const newExercise = new Exercise({
      title,
      partiallyDamages,
      completelyRuptured,
      tutorials,
      createdBy,
    });

    await newExercise.save();

    res.status(201).json({
      message: "Exercise created successfully",
      exercise: newExercise,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing exercise
export const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updatedFields = { title };

    if (req.files && req.files.partiallyDamages) {
      updatedFields.partiallyDamages = [];
      for (const file of req.files.partiallyDamages) {
        const uploadResponse = await uploadCloudinary(file.path);
        updatedFields.partiallyDamages.push(uploadResponse.url);
      }
    }

    if (req.files && req.files.completelyRuptured) {
      updatedFields.completelyRuptured = [];
      for (const file of req.files.completelyRuptured) {
        const uploadResponse = await uploadCloudinary(file.path);
        updatedFields.completelyRuptured.push(uploadResponse.url);
      }
    }

    if (req.files && req.files.tutorials) {
      updatedFields.tutorials = [];
      for (const file of req.files.tutorials) {
        const uploadResponse = await uploadCloudinary(file.path);
        updatedFields.tutorials.push(uploadResponse.url);
      }
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    if (!updatedExercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.status(200).json({
      message: "Exercise updated successfully",
      exercise: updatedExercise,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an existing exercise
export const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExercise = await Exercise.findByIdAndDelete(id);

    if (!deletedExercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all exercises
export const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get an exercise by ID
export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.status(200).json(exercise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Assign exercise to player
export const assignExerciseToPlayer = async (req, res) => {
  try {
    const { playerId, exerciseId, severity } = req.body;

    // Ensure the user assigning the exercise is an admin
    const user = await User.findById(req.user.id);
    if (user.userType !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only admins can assign exercises" });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Assign the exercise to the player
    player.assignedExercises.push({ exerciseId, severity });
    await player.save();

    res
      .status(200)
      .json({ message: "Exercise assigned to player successfully", player });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove assigned player from club by Admin
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
