// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import aws from 'aws-sdk';

const upload = multer();

// Setup AWS S3
const s3 = new aws.S3({
  accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
  region: process.env.AMPLIFY_REGION,
});

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error(error);
    res.status(501).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const data = await s3.upload(params).promise();
    res.status(200).json({ message: 'Upload successful', data });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

export default apiRoute;
