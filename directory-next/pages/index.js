import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }
    
        const reader = new FileReader();
        reader.readAsDataURL(file);
    
        reader.onload = async () => {
            const base64String = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');
    
            // Call uploadFile function here
            await uploadFile(base64String);
        };
    
        reader.onerror = (error) => {
            console.error('Error converting file to Base64:', error);
        };
    };
    

    const uploadFile = async (base64String) => {
        try {
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileBase64: base64String }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const blob = await response.blob();
            handleDownloadLink(blob, "directory.pdf");
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleDownloadLink = (blob, filename) => {
        // Create a Blob URL
        const url = window.URL.createObjectURL(blob);
    
        // Create a new link element
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.textContent = `Download ${filename}`;
        downloadLink.className = 'download-link'; // Add a class for styling if needed
    
        // Append the link to the body or any other element on your page
        document.body.appendChild(downloadLink);
    
        // Optional: Automatically revoke the Blob URL after a certain time
        setTimeout(() => window.URL.revokeObjectURL(url), 60000); // 60 seconds
    };
    

    return (
        <div>
            <h1>PDF Generator</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept=".csv" />
                <button type="submit">Generate PDF</button>
            </form>
        </div>
    );
}