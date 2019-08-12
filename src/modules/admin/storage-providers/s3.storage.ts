import * as aws from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const S3Storage = multerS3({
  s3,
  bucket: `noahs-arc-${process.env.NODE_ENV}`,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  storageClass: 'STANDARD',
  metadata(req, file, cb) {
    const meta = JSON.parse(req.body.filepond);

    cb(null, {
      'child-name': meta['child-name'],
      'child-id': `${meta['child-id']}`,
    });
  },
  key(req, file, cb) {
    cb(null, `child-${Date.now()}.${file.originalname.split('.').pop()}`);
  },
});
