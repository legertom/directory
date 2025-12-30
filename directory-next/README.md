# Directory Generator

A professional web application for generating telephone book style PDF directories from CSV files. Perfect for call centers, reception desks, front desk staff, and customer service teams.

## Features

- 🎨 **Professional Design**: Classic telephone book aesthetic with Bell Centennial fonts
- 📄 **Three-Column Layout**: Up to 204 entries (68 per column)
- 🔗 **Leader Dots**: Visual guides for easy reading
- 💧 **Watermark Support**: Free tier includes website URL watermark
- ✅ **CSV Validation**: Automatic validation of file format and data
- 🚀 **Fast Generation**: Quick PDF generation from CSV uploads
- 📱 **Responsive Design**: Works on all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd directory-next
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set:
```
WEBSITE_URL=your-website.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## CSV Format

Your CSV file must have three columns with these exact headers:

- `leftText` - Primary identifier (e.g., department name)
- `middleText` - Secondary information (e.g., location, person name)
- `rightText` - Contact number or extension

### Example CSV

```csv
leftText,middleText,rightText
Acquisition,Security Desk,104-915-7802
Admin,Basement-32,867-806-7274
IT,Room 827,536-527-4163
```

### Requirements

- Maximum 204 entries (68 per column × 3 columns)
- File size limit: 5MB
- First row must contain column headers
- CSV must be UTF-8 encoded

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `WEBSITE_URL` - Your website URL for watermark
   - `NEXT_PUBLIC_APP_URL` - Your production URL
4. Deploy!

The fonts directory will be automatically included in the deployment.

### Environment Variables

- `WEBSITE_URL` - Website URL shown in watermark (free tier)
- `NEXT_PUBLIC_APP_URL` - Your application URL
- `STRIPE_SECRET_KEY` - (Future) Stripe secret key for payments
- `STRIPE_PUBLISHABLE_KEY` - (Future) Stripe publishable key
- `DATABASE_URL` - (Future) Database connection string

## Subscription Model (Planned)

- **Free Tier**: Includes watermark with website URL at bottom of PDF
- **Paid Tier ($10/year)**: No watermark, unlimited generations

Stripe integration coming soon.

## Technology Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **PDF Generation**: PDFKit
- **CSV Parsing**: csv-parser
- **Fonts**: Bell Centennial (telephone book fonts)

## Project Structure

```
directory-next/
├── pages/
│   ├── api/
│   │   └── generate-pdf.js    # PDF generation API
│   ├── index.js               # Main page
│   └── _app.js                # App wrapper
├── fonts/                     # Custom fonts
├── styles/
│   └── globals.css            # Global styles
└── public/                    # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
