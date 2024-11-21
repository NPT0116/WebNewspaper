// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import aws from 'aws-sdk';
// import multerS3 from 'multer-s3';
// import { S3Client } from '@aws-sdk/client-s3';
// import { PATH } from '~/config/path.js';
// import { uploadFile } from '~/controllers/uploadController.js';
// const uploadRouter = express.Router();
// // interface IImage {
// //   fileName: string;
// //   url: string;
// // }

// aws.config.update({
//   region: process.env.AWS_REGION,

//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
//   }
// });

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
//   }
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Directory to save images
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_BUCKET_NAME ?? '',
//     acl: 'public-read', // Make the file publicly accessible
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     contentType(req, file, cb) {
//       cb(null, file.mimetype);
//     },
//     key: (req, file, cb) => {
//       const uniqueFileName = `${Date.now()}-${file.originalname}`;
//       cb(null, uniqueFileName); // File name in S3
//     }
//   })
// });

// uploadRouter.post(PATH.API.UPLOAD.BASE, upload.single('upload'), uploadFile);

// export default uploadRouter;
