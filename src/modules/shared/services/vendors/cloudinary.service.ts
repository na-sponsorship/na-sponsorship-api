import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly cloudinary: any;

  constructor() {
    this.cloudinary = cloudinary;

    this.cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async destroy(publicId: string) {
    return await new Promise(resolve => {
      this.cloudinary.v2.uploader.destroy(publicId, resolve);
    });
  }
}
