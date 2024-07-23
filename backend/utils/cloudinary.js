import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "dr5p2iear",
  api_key: "491633373886589",
  api_secret: "0YE39nHlJhnXP0pjjIyKYPcQcsU",
});

export const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    //upload the file on clodinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "mri_files",
    });
    // file has been uploaded sucessfully
    console.log("File is uploaded on cloudinary", result.url);
    //  fs.unlinkSync(localFilePath);
    return result;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath); //remove teh temporary local file has the operation got failed
  }
};
