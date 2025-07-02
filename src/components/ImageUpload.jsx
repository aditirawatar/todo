// src/components/ImageUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "todo_app_upload"); // change if your preset name is different
    formData.append("folder", "user-upload"); // optional

    try {
    const response = await axios.post(
    "https://api.cloudinary.com/v1_1/dplllmgie/image/upload",
    formData
    );

      setImageUrl(response.data.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {imageUrl && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <img src={'https://images.unsplash.com/photo-1744649781353-8a1b70c37a77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8'} alt="Uploaded" className="w-40 h-auto mt-2 rounded" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
