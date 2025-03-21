// pages/upload.js
import { useState, useEffect } from 'react';
import Router from 'next/router';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const authenticated = typeof window !== 'undefined' && sessionStorage.getItem('authenticated');
  const username = typeof window !== 'undefined' && sessionStorage.getItem('username');

  useEffect(() => {
    if (!authenticated) {
      Router.push('/login');
    }
  }, [authenticated]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    try {
      const res = await fetch(`/api/sign-upload?filename=${encodeURIComponent(file.name)}&filetype=${encodeURIComponent(file.type)}`);
      const { url, key } = await res.json();

      const uploadRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (uploadRes.ok) {
        const publicUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/${key}`;
setMessage(`✅ File uploaded! File URL: ${publicUrl}`);
console.log('File URL:', publicUrl);

      } else {
        throw new Error('Upload to S3 failed');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Upload failed');
    }
  };

  return (
    <div>
      <h1>Upload File to S3 (Pre-signed URL)</h1>
      <p>Welcome, {username}!</p>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}
