  import { v2 as cloudinary } from "cloudinary";
  import fs from "fs";
  import path from "path";

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000, // 6
  });

  const uploadOnCloudinary = async (localFilePath) => {
    console.log("Path:", localFilePath);
    localFilePath = path.resolve(localFilePath);
    console.log("Resolved Path:", localFilePath);
    try {
      if (!localFilePath) return null;
      console.log("Uploading file to Cloudinary:", localFilePath);
      const uploadedResponse = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      console.log("File uploaded successfully to Cloudinary:", uploadedResponse);
      fs.unlinkSync(localFilePath);
      return uploadedResponse;
    } catch (err) {
      fs.unlinkSync(localFilePath);
      console.log("Error while uploading to cloudinary:", err);
      return null;
    }
  };

  export { uploadOnCloudinary };
