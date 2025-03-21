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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('File uploaded successfully!');
        console.log(result);
      } else {
        setMessage('Upload failed: ' + result.error);
        console.error(result);
      }
    } catch (err) {
      setMessage('Upload failed');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Upload File to S3</h1>
      <p>Welcome, {username}!</p>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}
