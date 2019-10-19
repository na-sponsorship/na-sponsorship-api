import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import * as fs from 'fs';
import * as request from 'request';

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

  async getFile(publicId: string): Promise<fs.ReadStream> {
    const imageUrl = this.cloudinary.v2.url(publicId);

    return await new Promise(resolve => {
      request(imageUrl)
        .pipe(fs.createWriteStream('tmp/tmpImage.jpeg'))
        .on('close', () => {
          resolve(fs.createReadStream('tmp/tmpImage.jpeg'));
        });
    });
  }
}
