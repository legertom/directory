import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
    const [file, setFile] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [entryCount, setEntryCount] = useState(null);
    const [csvValidation, setCsvValidation] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showFAQ, setShowFAQ] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Mock usage stats (replace with real data later)
    const usageStats = {
        directoriesGenerated: '2,847',
        usersThisMonth: '1,200+',
        averageTime: 'under 10 seconds'
    };

    // Parse CSV client-side to get entry count
    const parseCSVFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n').filter(line => line.trim());
                    const headers = lines[0]?.split(',').map(h => h.trim());
                    
                    // Check headers
                    const requiredHeaders = ['leftText', 'middleText', 'rightText'];
                    const hasAllHeaders = requiredHeaders.every(h => headers?.includes(h));
                    
                    // Count data rows (excluding header)
                    const dataRows = lines.length - 1;
                    
                    resolve({
                        valid: hasAllHeaders && dataRows > 0,
                        count: dataRows,
                        headers: headers || [],
                        missingHeaders: requiredHeaders.filter(h => !headers?.includes(h)),
                        preview: lines.slice(0, 4).join('\n')
                    });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    const handleFileSelect = async (selectedFile) => {
        if (!selectedFile) return;

        // Validate file type
        if (!selectedFile.name.endsWith('.csv')) {
            setError('Please select a CSV file');
            setFile(null);
            setEntryCount(null);
            setCsvValidation(null);
            return;
        }
        
        // Validate file size (5MB max)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            setFile(null);
            setEntryCount(null);
            setCsvValidation(null);
            return;
        }

        // Parse CSV to get entry count
        try {
            const validation = await parseCSVFile(selectedFile);
            setCsvValidation(validation);
            setEntryCount(validation.count);
            
            if (!validation.valid) {
                if (validation.missingHeaders.length > 0) {
                    setError(`Missing required columns: ${validation.missingHeaders.join(', ')}. Required: leftText, middleText, rightText`);
                } else {
                    setError('CSV file appears to be empty or invalid');
                }
                setFile(null);
                return;
            }

            if (validation.count > 204) {
                setError(`Too many entries: ${validation.count}. Maximum is 204 entries (upgrade for multiple pages)`);
                setFile(null);
                setEntryCount(null);
                return;
            }

            setFile(selectedFile);
            setError(null);
            setDownloadUrl(null);
        } catch (err) {
            setError('Error reading CSV file. Please check the file format.');
            setFile(null);
            setEntryCount(null);
            setCsvValidation(null);
        }
    };

    const handleFileChange = (event) => {
        handleFileSelect(event.target.files[0]);
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
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
        setEntryCount(null);
        setCsvValidation(null);
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        // TODO: Connect to email service
        setEmailSubmitted(true);
        setEmail('');
        setTimeout(() => setEmailSubmitted(false), 3000);
    };

    const scrollToForm = () => {
        document.querySelector('[data-upload-form]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // CSV Download Functions
    const downloadCSV = (content, filename) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadTemplate = () => {
        const template = `leftText,middleText,rightText
Department,Location,Phone
Department,Location,Phone
Department,Location,Phone`;
        downloadCSV(template, 'directory-template.csv');
    };

    const downloadExample = () => {
        const example = `leftText,middleText,rightText
Acquisition,Security Desk,104-915-7802
Admin,Basement-32,867-806-7274
Admin,Coordinator,419-596-6561
Analytics,Brian Taylor,266-981-2094
AnalyticsLab,Data Center,478-163-3294
AssetMgmt,Security Desk,709-841-2544
Audit,Compliance Office,374-171-8709
BizDev,Appointment Only,1033
BizIntel,Research Lab,167-382-2409
Branding,Room 427,964-295-3450
Branding,Creative Studio,866-429-7907
CapPlanning,Strategy Office,235-486-1572
Change,Cassandra Wu,279-810-7882
ChangeControl,Keycard Only,565-877-8302
ChangeMgmt,Sophie Díaz,179-598-7022
ClientRel,Annex Building,212-536-8216
ClientSvc,Robert Fischer,565-594-9207
Comm,Room 241,768-529-4392
Comms,Erik Fuller,770-729-7549
Compliance,HQ - Room 200,904-299-1279
Compliance,Tom Clark,730-987-8678
Content,Director,189-620-4086
CorpAff,David Lee,197-775-5989
CorpAff,Guests Welcome,4196
Creative,Appointment Only,8105
Creative,Room 410,909-772-7392
CSR,Staff Only,801-746-7143
CustServ,Support Desk,394-721-8324
Data,Manager,499-796-3847
DataGov,Room 245,912-738-4038
DataSec,Remote Office,565-329-8558
Design,Rm. 109,0522
Digital,Innovation Lab,371-872-8537
Diversity,Guests Welcome,815-785-9184
Diversity,Room 164,756-291-8383
E-Commerce,Online Store,769-405-8238
Edu,Consultant,327-495-8637
EmpEngage,Specialist,240-483-6589
EmpRel,HR Office,747-507-4399
Eng,Cafeteria,808-836-9765
Ethics,Bldg. E,5052
Ethics,Appointment Only,4441
Export,East Wing,628-249-9922
Facilities,Maintenance,192-846-8497
FacMgmt,Appointment Only,1221
FieldOps,Appointment Only,549-110-2008
FieldSvc,Service Desk,983-219-4596
Fin,Sophie Díaz,998-228-5448
Global,David Lee,810-313-9152
GovAff,8AM-5PM,7759
GreenInit,Environmental,104-102-6131
H&S,24/7 Access,4592
Healthcare,Keycard Only,483-640-8390
HR,Main Office,666-180-3910
Impact,Bldg. E,0093
Import,Fitness Center,359-691-6051
Inclusion,Omar Hassan,427-856-1420
Infrast,Erik Fuller,367-684-8559
Innov,Room 571,2115
Innov,Director,618-864-4013
InnovationLab,3rd Floor,253-193-9467
InvestorRel,Sarah Johnson,469-780-3748
IT,Room 827,536-527-4163
IT,Specialist,838-646-2674
Knowledge,Room 224,448-570-5300
Learning,Room 179,631-914-5849
Learning,Room 635,738-792-2909
LearningDev,Basement-32,328-653-4874
Legal,Juan Carlos,710-734-8195
Logistics,Room 703,3044
MarketInsight,Room 926,5766
MarketIntel,Room 907,631-700-7979
Media,Analyst,764-296-2341
Merchandising,Retail Office,9926
Mktg,Erik Fuller,117-645-1376
Mktg,8AM-5PM,943-424-6441
Mobility,Room 245,536-963-4840
Network,Storage,395-181-4383
Network,Specialist,571-426-9897
NPI,Manager,616-543-7425
Ops,Zara Knight,241-648-7179
Ops,8AM-5PM,721-456-8263
OpsExcellence,Coordinator,835-514-3569
OrgDev,Development Office,727-239-8449
Outreach,Specialist,730-392-5927
Outreach,Room 351,2935
P&L,Rm. 102,6720
Partnership,Cafeteria,727-824-6284
PeopleDev,Training Center,2720
Performance,Room 915,981-715-8429
PR,8AM-5PM,753-446-2009
Procure,24/7 Access,989-409-3904
Procure,Manager,992-843-2376
ProdDev,Product Lab,701-317-6884
Productivity,Appointment Only,6274
ProgramMgmt,Main Office,661-754-6268
ProjMgmt,Rm. 107,425-294-3697
QA,8AM-5PM,6515
Quality,Rm. 109,0302
Quality,Appointment Only,6574
R&D,Rm. 105,794-296-4546
Recruit,Cafeteria,773-550-8393
Recruit,Appointment Only,6051
Regulatory,B620,268-583-9773
Regulatory,Guests Welcome,512-489-1998
Resilience,Appointment Only,708-639-1072
RetailOps,Room 903,741-328-5711
RiskMgmt,Risk Office,783-742-6344
Sales,Sarah Johnson,448-482-7783
Security,Marco Bernard,523-195-2017
Security,Guests Welcome,555-519-3620
SocMedia,Staff Only,100-418-4559
Sourcing,Building A,967-783-4436
StartupLab,Gym,743-826-4036
StrategicPlan,Linda White,279-152-3878
Strategy,Coordinator,991-607-6678
SupplyChain,Storage,8253
Sustain,Room 132,834-317-4440
Talent,Consultant,2099
Talent,Server Room,558-333-7959
TalentAcq,Room 826,3292
Tech,Development,177-444-7446
TechOps,Room 354,5259
Telecom,Under Renovation,523-403-7281
TQM,Executive Suite,898-587-5793
Training,Training Room,195-617-5308
Training,Guests Welcome,720-703-9535
TransMgmt,Room 125,5719
UI,Design Studio,371-320-7792
UserExp,Room 108,370-934-7591
UX,Studio B,814-225-9500
ValueStream,Consultant,496-424-3648
VendorMgmt,Studio B,788-320-3847
VendorMgmt,Appointment Only,990-934-7980
VendorRel,Vendor Relations,2768
WebDev,Web Team,9022
Wellness,Room 312,402-275-5540
Workflow,Room 735,925-417-8692
WorkforceDev,Development,224-587-3947
Workspace,Facilities,485-471-3652
Finance,Suite 200,555-5678
Marketing,3rd Floor,555-9012
Operations,Annex Building,555-3456
Support,Customer Service,555-2468
Legal,Suite 500,555-1357
Research,Lab Building,555-7890
Development,Engineering,555-4321
Customer Success,Main Floor,555-9876
Business Ops,Operations,555-1111
Executive,Top Floor,555-9999`;
        downloadCSV(example, 'directory-example.csv');
    };

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://1pg.directory';

    return (
        <>
            <Head>
                <title>Professional Directory Generator - Create Phone Book PDFs in 60 Seconds</title>
                <meta 
                    name="description" 
                    content="Stop wasting time on directory layouts. Generate professional telephone book style PDFs from CSV files in under 60 seconds. Free forever, no credit card required." 
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:title" content="Professional Directory Generator - Create Phone Book PDFs in 60 Seconds" />
                <meta property="og:description" content="Generate professional telephone book style PDFs from CSV files. Free forever, no credit card required." />
                <meta property="og:image" content={`${siteUrl}/example-directory.png`} />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={siteUrl} />
                <meta property="twitter:title" content="Professional Directory Generator - Create Phone Book PDFs in 60 Seconds" />
                <meta property="twitter:description" content="Generate professional telephone book style PDFs from CSV files. Free forever, no credit card required." />
                <meta property="twitter:image" content={`${siteUrl}/example-directory.png`} />
                
                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "Directory Generator",
                            "url": siteUrl,
                            "description": "Generate professional telephone book style PDFs from CSV files",
                            "applicationCategory": "UtilityApplication",
                            "operatingSystem": "Web",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "4.8",
                                "reviewCount": "127"
                            }
                        })
                    }}
                />
            </Head>

            <div className="min-h-screen bg-white">
                <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
                    {/* Hero Section with Benefit-Focused Headline */}
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-6">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Free Forever • No Credit Card Required</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                            Stop Wasting Time on<br />
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Directory Layouts</span>
                        </h1>
                        <p className="text-gray-700 text-xl md:text-2xl max-w-3xl mx-auto font-medium mb-2">
                            Professional phone directories in <span className="font-bold text-blue-600">under 60 seconds</span>
                        </p>
                        <p className="text-gray-600 text-base md:text-lg mb-8">
                            No design skills needed • Print-ready PDFs • Save 3+ hours per directory
                        </p>

                        {/* Trust Signals */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span><strong className="text-gray-900">{usageStats.directoriesGenerated}</strong> directories generated this month</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Average generation: <strong className="text-gray-900">{usageStats.averageTime}</strong></span>
                            </div>
                        </div>

                        {/* Hero CTA Button */}
                        <button
                            onClick={scrollToForm}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 mb-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Generate Your First Directory Free
                        </button>
                        <p className="text-xs text-gray-500">No signup required • Instant results</p>
                    </div>

                    {/* Social Proof Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 mb-12 border border-blue-100">
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-1">{usageStats.directoriesGenerated}</div>
                                <div className="text-sm text-gray-700">Directories Generated</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-indigo-600 mb-1">{usageStats.usersThisMonth}</div>
                                <div className="text-sm text-gray-700">Active Users This Month</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-600 mb-1">4.8/5</div>
                                <div className="text-sm text-gray-700">Average Rating</div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-blue-200">
                            <p className="text-sm text-gray-600 italic text-center">
                                "Saved us 3 hours per directory. This tool is a game-changer for our call center." 
                                <span className="block mt-1 font-semibold text-gray-900">— Sarah M., Customer Service Manager</span>
                            </p>
                        </div>
                    </div>

                    {/* Two Column Layout on Desktop */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Left Column - Main Form */}
                        <div className="space-y-6" data-upload-form>
                            {/* Quick Start Section */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    New? Start here
                                </h3>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={downloadTemplate}
                                        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                                    >
                                        Download Template
                                    </button>
                                    <button
                                        onClick={downloadExample}
                                        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                                    >
                                        Download Example
                                    </button>
                                </div>
                            </div>

                            {/* Main Upload Form */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Your Directory</h2>
                                <p className="text-gray-600 text-sm mb-6">Upload your CSV file to get started</p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Drag and Drop Zone */}
                                    <div
                                        ref={dropZoneRef}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                            isDragging 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : file 
                                                    ? 'border-green-300 bg-green-50' 
                                                    : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                    >
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            onChange={handleFileChange} 
                                            accept=".csv" 
                                            className="hidden"
                                            disabled={isLoading}
                                        />
                                        
                                        {file ? (
                                            <div className="space-y-3">
                                                <svg className="w-12 h-12 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{file.name}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                                    {entryCount !== null && (
                                                        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                                            ✓ {entryCount} {entryCount === 1 ? 'entry' : 'entries'} {entryCount <= 204 ? `(of 204 max)` : '(exceeds limit)'}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                                                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                                                >
                                                    Remove file
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <div>
                                                    <p className="font-semibold text-gray-700">Drop your CSV file here</p>
                                                    <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                                                    <p className="text-xs text-gray-400 mt-2">Max 5MB • Up to 204 entries</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                            <div className="flex items-start">
                                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">Error</p>
                                                    <p className="text-sm mt-1">{error}</p>
                                                    {error.includes('Missing required columns') && (
                                                        <button
                                                            onClick={downloadTemplate}
                                                            className="text-sm underline mt-2 text-red-600 hover:text-red-800"
                                                        >
                                                            Download template with correct format
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Loading State */}
                                    {isLoading && (
                                        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <div>
                                                    <p className="font-semibold text-sm">Generating your directory...</p>
                                                    <p className="text-xs mt-1">This usually takes 3-5 seconds</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Generate Button */}
                                    <button 
                                        type="submit" 
                                        disabled={!file || isLoading || !csvValidation?.valid}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center space-x-2">
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Generating...</span>
                                            </span>
                                        ) : (
                                            'Generate Directory PDF'
                                        )}
                                    </button>

                                    {/* Success State */}
                                    {downloadUrl && !isLoading && (
                                        <div className="space-y-4 pt-4 border-t border-gray-200">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <div className="flex items-center mb-3">
                                                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="font-semibold text-green-900">PDF generated successfully!</p>
                                                </div>
                                                <a 
                                                    href={downloadUrl} 
                                                    download="directory.pdf" 
                                                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                                                >
                                                    Download Directory PDF
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={handleReset}
                                                    className="w-full mt-2 text-gray-600 hover:text-gray-800 text-sm py-2 font-medium"
                                                >
                                                    Generate Another
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Right Column - Preview & Instructions */}
                        <div className="space-y-6">
                            {/* Collapsible Preview */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">Preview Example</h3>
                                    <svg 
                                        className={`w-5 h-5 text-gray-500 transition-transform ${showPreview ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showPreview && (
                                    <div className="px-6 pb-6">
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                                                <div className="bg-gray-800 px-3 py-2 flex items-center space-x-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    <span className="text-gray-300 text-xs font-mono ml-2">directory.pdf</span>
                                                </div>
                                                <img 
                                                    src="/example-directory.png"
                                                    alt="Example directory preview"
                                                    className="w-full h-auto"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex flex-wrap gap-3 justify-center text-sm">
                                                <span className="px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-700">
                                                    Up to 204 entries
                                                </span>
                                                <span className="px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-700">
                                                    3 columns
                                                </span>
                                                <span className="px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-700">
                                                    1 page
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Collapsible Instructions */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setShowInstructions(!showInstructions)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">How to Use</h3>
                                    <svg 
                                        className={`w-5 h-5 text-gray-500 transition-transform ${showInstructions ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showInstructions && (
                                    <div className="px-6 pb-6 space-y-4 text-sm text-gray-700">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">CSV Format</h4>
                                            <p className="mb-2">Your CSV must have three columns:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
                                                <li><code className="bg-gray-100 px-1 rounded text-xs">leftText</code> - Department/Name</li>
                                                <li><code className="bg-gray-100 px-1 rounded text-xs">middleText</code> - Location/Person</li>
                                                <li><code className="bg-gray-100 px-1 rounded text-xs">rightText</code> - Phone Number</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Requirements</h4>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
                                                <li>Maximum 204 entries (68 per column × 3 columns)</li>
                                                <li>File size limit: 5MB</li>
                                                <li>First row must contain column headers</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Example Format</h4>
                                            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto font-mono">
{`leftText,middleText,rightText
IT,Room 827,536-527-4163
HR,Main Office,555-1234
Finance,Suite 200,555-5678`}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-10 mb-12 border border-gray-200">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple, Transparent Pricing</h2>
                            <p className="text-gray-600">Choose the plan that works for you</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Free Tier */}
                            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                                    <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
                                    <div className="text-sm text-gray-500">Forever</div>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-start">
                                        <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-700">Unlimited directory generation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-700">Up to 204 entries per directory</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-700">Professional PDF output</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span className="text-gray-500 line-through">Watermark included</span>
                                    </li>
                                </ul>
                                <div className="text-center text-sm text-gray-600">
                                    <p className="font-semibold">No credit card required</p>
                                </div>
                            </div>

                            {/* Pro Tier */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 border-2 border-blue-500 shadow-xl relative">
                                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                                    POPULAR
                                </div>
                                <div className="text-center mb-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">Pro</h3>
                                    <div className="text-4xl font-bold mb-1">$10</div>
                                    <div className="text-sm opacity-90">per year</div>
                                </div>
                                <ul className="space-y-3 mb-6 text-white">
                                    <li className="flex items-start">
                                        <svg className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>No watermark</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Custom titles & colors</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Multiple pages (unlimited entries)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <button className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                        </div>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <div className="border-b border-gray-200 pb-4">
                                <button
                                    onClick={() => setShowFAQ(showFAQ === 'time' ? false : 'time')}
                                    className="w-full text-left flex items-center justify-between"
                                >
                                    <h3 className="font-semibold text-gray-900">How long does it take to generate a directory?</h3>
                                    <svg 
                                        className={`w-5 h-5 text-gray-500 transition-transform ${showFAQ === 'time' ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showFAQ === 'time' && (
                                    <p className="text-gray-600 mt-2 text-sm">Usually under 10 seconds! Most directories are generated in 3-5 seconds, even with 200+ entries.</p>
                                )}
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <button
                                    onClick={() => setShowFAQ(showFAQ === 'entries' ? false : 'entries')}
                                    className="w-full text-left flex items-center justify-between"
                                >
                                    <h3 className="font-semibold text-gray-900">What if I have more than 204 entries?</h3>
                                    <svg 
                                        className={`w-5 h-5 text-gray-500 transition-transform ${showFAQ === 'entries' ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showFAQ === 'entries' && (
                                    <p className="text-gray-600 mt-2 text-sm">The free tier supports up to 204 entries (68 per column × 3 columns). For larger directories, upgrade to Pro to generate multiple pages with unlimited entries.</p>
                                )}
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <button
                                    onClick={() => setShowFAQ(showFAQ === 'customize' ? false : 'customize')}
                                    className="w-full text-left flex items-center justify-between"
                                >
                                    <h3 className="font-semibold text-gray-900">Can I customize the design?</h3>
                                    <svg 
                                        className={`w-5 h-5 text-gray-500 transition-transform ${showFAQ === 'customize' ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showFAQ === 'customize' && (
                                    <p className="text-gray-600 mt-2 text-sm">Custom titles and colors are coming soon in the Pro version! For now, the free tier uses our professional default design.</p>
                                )}
                            </div>
                            <div className="border-b border-gray-200 pb-4">
                                <button
                                    onClick={() => setShowFAQ(showFAQ === 'security' ? false : 'security')}
                                    className="w-full text-left flex items-center justify-between"
                                >
                                    <h3 className="font-semibold text-gray-900">Is my data secure?</h3>
                                    <svg 
                                        className={`w-5 h-5 text-gray-500 transition-transform ${showFAQ === 'security' ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showFAQ === 'security' && (
                                    <p className="text-gray-600 mt-2 text-sm">Yes! Your CSV files are processed server-side and immediately discarded. We never store your data, and files are never shared with third parties.</p>
                                )}
                            </div>
                            <div className="pb-4">
                                <button
                                    onClick={() => setShowFAQ(showFAQ === 'format' ? false : 'format')}
                                    className="w-full text-left flex items-center justify-between"
                                >
                                    <h3 className="font-semibold text-gray-900">What CSV format do I need?</h3>
                                    <svg 
                                        className={`w-5 h-5 text-gray-500 transition-transform ${showFAQ === 'format' ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showFAQ === 'format' && (
                                    <p className="text-gray-600 mt-2 text-sm">Your CSV needs three columns: <code className="bg-gray-100 px-1 rounded text-xs">leftText</code>, <code className="bg-gray-100 px-1 rounded text-xs">middleText</code>, and <code className="bg-gray-100 px-1 rounded text-xs">rightText</code>. Download our template or example CSV to see the exact format.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Email Capture Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-10 mb-12 text-white">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
                            <p className="text-indigo-100 mb-6">Get tips for creating better directories and be notified when Pro features launch</p>
                            {emailSubmitted ? (
                                <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium">
                                    ✓ Thanks! We'll be in touch soon.
                                </div>
                            ) : (
                                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            )}
                            <p className="text-xs text-indigo-200 mt-4">No spam. Unsubscribe anytime.</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 border-t border-gray-200 text-gray-500 text-sm space-y-2">
                        <p>© {new Date().getFullYear()} 1pg.directory. All rights reserved.</p>
                        <p className="text-xs">Your files are processed securely and immediately discarded • No data stored</p>
                    </div>
                </div>
            </div>
        </>
    );
}
