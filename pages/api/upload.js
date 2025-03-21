// pages/api/upload.js
import aws from 'aws-sdk';
import Busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false, // Required for streaming file uploads
  },
};

const s3 = new aws.S3({
  accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
  region: process.env.AMPLIFY_REGION,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const busboy = Busboy({ headers: req.headers });
  let uploadResult = null;

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${filename}`,
      Body: file,
      ContentType: mimetype,
      ACL: 'public-read',
    };

    uploadResult = s3.upload(params).promise();
  });

  busboy.on('finish', async () => {
    try {
      const data = await uploadResult;
      res.status(200).json({ message: 'File uploaded successfully', data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload failed', details: err.message });
    }
  });

  req.pipe(busboy);
}
