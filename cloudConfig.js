const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_dev', // Folder name in Cloudinary where images will be stored
      allowedFormats: ['jpeg', 'png', 'jpg'], // Allowed file types
      public_id: (req, file) => file.originalname, // Rename file
     

  },
});

module.exports = { cloudinary, storage };
