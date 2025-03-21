import aws from 'aws-sdk';

export default async function handler(req, res) {
  console.log("▶️ SIGN UPLOAD ROUTE CALLED");

  const {
    MY_ACCESS_KEY_ID,
    MY_SECRET_ACCESS_KEY,
    MY_REGION,
    MY_S3_BUCKET_NAME,
  } = process.env;

  console.log("AccessKey:", !!MY_ACCESS_KEY_ID);
  console.log("SecretKey:", !!MY_SECRET_ACCESS_KEY);
  console.log("Region:", MY_REGION);
  console.log("Bucket:", MY_S3_BUCKET_NAME);

  const s3 = new aws.S3({
    accessKeyId: MY_ACCESS_KEY_ID,
    secretAccessKey: MY_SECRET_ACCESS_KEY,
    region: MY_REGION,
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
      Bucket: MY_S3_BUCKET_NAME,
      Key: key,
      ContentType: filetype,
      Expires: 60,
      ACL: 'public-read',
    });

    res.status(200).json({ url, key });
  } catch (error) {
    console.error("❌ SIGN-UPLOAD ERROR:", error);
    res.status(500).json({ error: 'Failed to create signed URL', details: error.message });
  }
}
