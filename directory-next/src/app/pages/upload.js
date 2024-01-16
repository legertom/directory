// pages/upload.js
import React, { useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState(null);

  // Handles file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handles file upload submission
  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Post the form data to your API route for processing
    try {
      const response = await fetch("/api/processFile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      // Handle the response data as needed
      console.log(result);
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h1>Upload Your File</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadPage;
