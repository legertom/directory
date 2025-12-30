# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Website URL for watermark (free tier)
WEBSITE_URL=directory-generator.com

# Your application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### For Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following:
   - `WEBSITE_URL` = your actual website domain
   - `NEXT_PUBLIC_APP_URL` = your production URL (e.g., https://your-app.vercel.app)

## Fonts

The fonts are already included in the `fonts/` directory. These will be automatically deployed with your application.

## First Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js
4. Add environment variables in Vercel dashboard
5. Deploy!

## Testing Locally

1. Install dependencies: `npm install`
2. Create `.env.local` file (see above)
3. Run dev server: `npm run dev`
4. Open http://localhost:3000

## CSV Test File

You can use the example CSV from `simple-script/phonebook.csv` for testing.

