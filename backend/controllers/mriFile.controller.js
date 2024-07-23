import MRIFile from "../models/mriFile.model.js";
// import { uploadCloudinary } from "../utils/cloudinary.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import axios from "axios";
import AclAssessmentResult from "../models/aclAssessmentResults.model.js";

// ? Create an MRI File
export const uploadMRIFile = async (req, res) => {
  try {
    const playerId = req.user.id;

    // Upload the MRI file to Cloudinary
    const mriFilePath = req.file.path;
    const mriFileResponse = await uploadCloudinary(mriFilePath);

    if (!mriFileResponse || !mriFileResponse.url) {
      throw new Error("Failed to upload file to Cloudinary");
    }

    // Save the MRI file details in the database
    const newMRIFile = new MRIFile({
      playerId,
      fileType: req.file.mimetype,
      filePath: mriFileResponse.url,
    });
    await newMRIFile.save();

    // Send the MRI file to the Flask API for assessment
    try {
      const flaskResponse = await axios.post(
        "http://127.0.0.1:5000/predict_acl",
        {
          filePath: mriFileResponse.url,
        },
        { timeout: 600000000 } // Increase timeout to 60 seconds
      );

      // Save the assessment result in the database
      const newAclAssessmentResult = new AclAssessmentResult({
        playerId,
        mriFileId: newMRIFile._id,
        assessmentResult:
          flaskResponse.data.acl_tear_prediction ||
          flaskResponse.data.acl_tear_grade_prediction,
        reportPath: flaskResponse.data.reportPath || "",
      });
      await newAclAssessmentResult.save();

      res.status(201).json({
        message: "MRI file uploaded and assessed successfully",
        mriFile: newMRIFile,
        assessmentResult: newAclAssessmentResult,
      });
    } catch (axiosError) {
      console.error("Error connecting to Flask API:", axiosError.message);
      res.status(500).json({
        message: "Error connecting to Flask API",
        error: axiosError.message,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

//? get One File
export const getMRIFile = async (req, res) => {
  try {
    const mriFile = await MRIFile.findById(req.params.id);
    if (!mriFile) {
      return res.status(404).json({ message: "MRI file not found" });
    }
    res.status(200).json(mriFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ? get all MRI files
export const getAllMRIFiles = async (req, res) => {
  try {
    const mriFiles = await MRIFile.find({ playerId: req.user.id });
    res.status(200).json(mriFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
