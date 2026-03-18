import { v2 as cloudinary } from "cloudinary";

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_SECRET_KEY;

  return {
    cloudName,
    apiKey,
    apiSecret,
  };
};

const isCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloudName && apiKey && apiSecret);
};

const connectCloudinary = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      "Cloudinary environment variables are missing. Falling back to local file uploads."
    );
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return true;
};

export { isCloudinaryConfigured };
export default connectCloudinary;
