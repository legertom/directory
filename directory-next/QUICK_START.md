# Quick Start Guide

## For Immediate Deployment

1. **Set Environment Variables in Vercel:**
   ```
   WEBSITE_URL=your-domain.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

2. **Deploy to Vercel:**
   - Push to GitHub
   - Import to Vercel
   - Add environment variables
   - Deploy!

3. **Test:**
   - Upload a CSV file
   - Verify PDF generates correctly
   - Check watermark appears at bottom (free tier)

## CSV Format Quick Reference

```csv
leftText,middleText,rightText
Department,Location,Phone
IT,Room 100,555-1234
```

## Current Status

✅ **Production Ready** - All core features working
⏳ **Subscription** - Ready for Stripe integration (see PROFESSIONALIZATION_SUMMARY.md)

## Testing Locally

```bash
npm install
# Create .env.local with WEBSITE_URL and NEXT_PUBLIC_APP_URL
npm run dev
```

Visit http://localhost:3000 and test with a CSV file!

