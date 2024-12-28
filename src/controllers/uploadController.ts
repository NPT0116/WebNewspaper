import { Request, Response } from 'express';

export const uploadFile = async (req: Request<{}, {}, { file?: Express.MulterS3.File }>, res: Response): Promise<void> => {
  try {
    console.log('Run here');
    // Ensure `req.file` is properly typed
    const file = req.file as Express.MulterS3.File | undefined;
    // console.log(file);

    if (file) {
      // Construct the URL for the uploaded image
      const imageUrl = `${file.location}`;
      console.log(imageUrl);

      // Create the new image metadata object
      //   const newImage = {
      //     fileName: file.filename,
      //     url: imageUrl
      //   };

      // Optionally save the metadata to the database
      // await saveImageMetadata(newImage);

      // Respond with the image URL
      res.json({
        uploaded: true,
        url: imageUrl
      });
    } else {
      // Handle the case where no file was uploaded
      res.status(400).json({
        uploaded: false,
        error: {
          message: 'Image upload failed'
        }
      });
    }
  } catch {
    // Handle unexpected errors
    res.status(500).json({
      uploaded: false,
      error: {
        message: 'An unexpected error occurred'
      }
    });
  }
};
