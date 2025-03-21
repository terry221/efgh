import aws from 'aws-sdk';

export default async function handler(req, res) {
  console.log("▶️ SIGN UPLOAD ROUTE CALLED");

  // Debug the environment
  console.log("AccessKey:", process.env.AMPLIFY_ACCESS_KEY_ID);
  console.log("SecretKey:", process.env.AMPLIFY_SECRET_ACCESS_KEY);
  console.log("Region:", process.env.AMPLIFY_REGION);
  console.log("Bucket:", process.env.S3_BUCKET_NAME);

  const s3 = new aws.S3({
    region: process.env.AMPLIFY_REGION,
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
  });

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, filetype } = req.query;

  if (!filename || !filetype) {
    return res.status(400).json({ error: 'Missing filename or filetype' });
  }

  const key = `uploads/${Date.now()}_${filename}`;

  try {
    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: filetype,
      Expires: 60,
      ACL: 'public-read',
    });

    res.status(200).json({ url, key });
  } catch (error) {
    console.error("❌ Error generating signed URL:", error);
    res.status(500).json({ error: 'Failed to create signed URL', details: error.message });
  }
}
