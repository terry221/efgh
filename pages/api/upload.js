// pages/api/upload.js
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
  region: process.env.AMPLIFY_REGION,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from 'formidable';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing the file' });
    }

    const file = files.file;
    const fileStream = fs.createReadStream(file.filepath);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${file.originalFilename}`,
      Body: fileStream,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const data = await s3.upload(params).promise();
      res.status(200).json({ message: 'File uploaded successfully', data });
    } catch (uploadError) {
      res.status(500).json({ error: 'Upload failed', details: uploadError });
    }
  });
}
