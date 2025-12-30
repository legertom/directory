import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
    const [file, setFile] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPaid, setIsPaid] = useState(false); // TODO: Connect to subscription check

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Validate file type
            if (!selectedFile.name.endsWith('.csv')) {
                setError('Please select a CSV file');
                setFile(null);
                return;
            }
            
            // Validate file size (5MB max)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                setFile(null);
                return;
            }
            
            setFile(selectedFile);
            setError(null);
            setDownloadUrl(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!file) {
            setError('Please select a CSV file first');
            return;
        }

        setIsLoading(true);
        setError(null);
        setDownloadUrl(null);

        try {
            const reader = new FileReader();
            
            reader.onload = async () => {
                try {
                    const base64String = reader.result
                        .replace('data:', '')
                        .replace(/^.+,/, '');

                    await uploadFile(base64String);
                } catch (err) {
                    setError('Failed to process file. Please try again.');
                    setIsLoading(false);
                }
            };

            reader.onerror = () => {
                setError('Error reading file. Please try again.');
                setIsLoading(false);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const uploadFile = async (base64String) => {
        try {
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    fileBase64: base64String,
                    isPaid: isPaid 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error: ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
            setError(null);
        } catch (error) {
            setError(error.message || 'Error generating PDF. Please check your CSV format and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setDownloadUrl(null);
        setError(null);
        setIsLoading(false);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    };

    return (
        <>
            <Head>
                <title>Directory Generator - Create Professional Phone Book Style PDFs</title>
                <meta 
                    name="description" 
                    content="Generate professional directory PDFs from CSV files. Perfect for call centers, reception desks, and customer service teams. Free tier available." 
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Directory Generator
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Create professional telephone book style PDFs from CSV files
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload CSV File
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg cursor-pointer transition-colors duration-200 shadow-md hover:shadow-lg">
                                        {file ? 'Change File' : 'Choose File'}
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange} 
                                            accept=".csv" 
                                            className="hidden" 
                                            disabled={isLoading}
                                        />
                                    </label>
                                    {file && (
                                        <div className="flex-1 flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                                            <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                            <span className="text-xs text-gray-500 ml-2">
                                                ({(file.size / 1024).toFixed(1)} KB)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <p className="font-medium">Error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Generating your directory PDF...</span>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={!file || isLoading}
                                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                {isLoading ? 'Generating...' : 'Generate Directory'}
                            </button>

                            {/* Download Button */}
                            {downloadUrl && !isLoading && (
                                <div className="space-y-3">
                                    <a 
                                        href={downloadUrl} 
                                        download="directory.pdf" 
                                        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Download Directory PDF
                                    </a>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="w-full text-gray-600 hover:text-gray-800 text-sm py-2"
                                    >
                                        Generate Another
                                    </button>
                                </div>
                            )}
                        </form>

                        {/* PDF Preview */}
                        {downloadUrl && !isLoading && (
                            <div className="mt-8 border-t pt-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
                                <div className="border rounded-lg overflow-hidden shadow-inner">
                                    <iframe 
                                        className="w-full h-[600px]" 
                                        src={downloadUrl} 
                                        frameBorder="0"
                                        title="PDF Preview"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Use</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">1. Prepare Your CSV File</h3>
                                <p className="text-sm">Your CSV file must have three columns: <code className="bg-gray-100 px-1 rounded">leftText</code>, <code className="bg-gray-100 px-1 rounded">middleText</code>, and <code className="bg-gray-100 px-1 rounded">rightText</code></p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">2. Format Requirements</h3>
                                <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                                    <li>Maximum 204 entries (68 per column × 3 columns)</li>
                                    <li>File size limit: 5MB</li>
                                    <li>First row should contain column headers</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">3. Example CSV Format</h3>
                                <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`leftText,middleText,rightText
Acquisition,Security Desk,104-915-7802
Admin,Basement-32,867-806-7274
IT,Room 827,536-527-4163`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} Directory Generator. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
