import * as cloudinary from 'cloudinary';
import * as cloudinaryStorage from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CloudinaryStorage = cloudinaryStorage({
  cloudinary,
  folder: `noahs-arc-${process.env.NODE_ENV}`,
  allowedFormats: ['jpg', 'png'],
  filename(req, file, cb) {
    cb(undefined, `child-${Date.now()}`);
  },
});
