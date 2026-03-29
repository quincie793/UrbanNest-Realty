import { v2 as cloudinary } from "cloudinary";

const requiredVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missing = requiredVars.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.warn(
    "Cloudinary is not fully configured. Missing env vars:",
    missing.join(", ")
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export default cloudinary;