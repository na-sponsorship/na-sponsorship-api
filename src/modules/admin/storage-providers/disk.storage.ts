import * as multer from 'multer';
import * as path from 'path';

export const DiskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../../../uploads'));
  },
  filename(req, file, cb) {
    cb(null, `child-${Date.now()}.${file.originalname.split('.').pop()}`);
  },
});
