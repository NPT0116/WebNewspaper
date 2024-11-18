import express from 'express';
import multer from 'multer';
import path from 'path';
import { PATH } from '~/config/path.js';
import { uploadFile } from '~/controllers/uploadController.js';
const uploadRouter = express.Router();
// interface IImage {
//   fileName: string;
//   url: string;
// }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

uploadRouter.post(PATH.API.UPLOAD.BASE, upload.single('upload'), uploadFile);

export default uploadRouter;
