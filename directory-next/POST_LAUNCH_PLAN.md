# Post-Launch Development Plan

## 🎯 Immediate Post-Launch (Week 1-2)

### Goals
- Monitor for bugs and errors
- Gather initial user feedback
- Track basic metrics (usage, errors)

### Tasks
- [ ] Set up error monitoring (Sentry or Vercel Analytics)
- [ ] Add basic analytics (Vercel Analytics or Google Analytics)
- [ ] Monitor server logs for issues
- [ ] Collect user feedback (simple form or email)

## 📅 Month 1: Phase 1 Features

### Priority Order

#### 1. CSV Template Download (1 hour)
**Why First**: Easiest win, reduces support requests immediately

**Implementation**:
- Add "Download Template" button on homepage
- Create sample CSV with example data
- Download as `directory-template.csv`

**Files to Modify**:
- `pages/index.js` - Add button and download handler

---

#### 2. Entry Counter (2 hours)
**Why Second**: Prevents user errors, improves UX

**Implementation**:
- Parse CSV client-side when file is selected
- Display: "✓ 45 entries (45 of 204 max)"
- Show warning if > 204: "⚠ 250 entries (exceeds 204 max - upgrade for multiple pages)"
- Highlight invalid rows (missing columns)

**Files to Modify**:
- `pages/index.js` - Add CSV parsing and validation
- Add `papaparse` or use built-in CSV parsing

---

#### 3. Custom Title (3 hours) - Paid Feature
**Why Third**: Clear paid value, relatively simple

**Implementation**:
- Add text input: "Directory Title" (disabled for free users)
- Show "Upgrade to customize" tooltip for free users
- Pass `customTitle` to API
- Update PDF generation to use custom title or default

**Files to Modify**:
- `pages/index.js` - Add title input (conditional on `isPaid`)
- `pages/api/generate-pdf.js` - Accept `customTitle` parameter
- Update `createPDF` function to use custom title

---

#### 4. Custom Colors (4 hours) - Paid Feature
**Why Fourth**: Visual customization, good paid feature

**Implementation**:
- Add color picker for title color (disabled for free users)
- Default: #1F4685 (current blue)
- Pass `titleColor` to API
- Update PDF generation to use custom color

**Files to Modify**:
- `pages/index.js` - Add color picker component
- `pages/api/generate-pdf.js` - Accept `titleColor` parameter
- Update title rendering to use custom color

---

#### 5. Multiple Pages (6-8 hours) - Paid Feature
**Why Last in Phase 1**: Most complex, but high value

**Implementation**:
- Calculate pages needed: `Math.ceil(data.length / 204)`
- Add page numbers at bottom
- Continue entries across pages
- Update API to handle pagination

**Files to Modify**:
- `pages/api/generate-pdf.js` - Major update to `createPDF` function
- Add page break logic
- Add page number rendering

## 📅 Month 2-3: Phase 2 Features

### 6. Batch Processing (8-10 hours) - Paid Feature

**Implementation**:
- Multiple file upload
- Queue system for processing
- Generate all PDFs
- Create zip file
- Download zip

**New Files**:
- `pages/api/batch-generate.js` - New API endpoint
- Client-side zip creation or server-side

### 7. Google Sheets Integration (10-12 hours) - Paid Feature

**Implementation**:
- Google OAuth flow
- Google Sheets API integration
- Sheet selection UI
- Import and convert to CSV format
- Generate PDF from sheet data

**New Files**:
- `pages/api/google-auth.js` - OAuth handler
- `pages/api/import-sheet.js` - Sheet import handler
- `pages/sheets-import.js` - Import UI page

## 📅 Month 4-6: Phase 3 Features

### 8. API Access (12-16 hours) - Enterprise Feature

**Implementation**:
- API key generation system
- REST API endpoints
- Rate limiting
- API documentation page
- Usage tracking

**New Files**:
- `pages/api/v1/generate.js` - API endpoint
- `pages/api/keys.js` - Key management
- `pages/docs/api.js` - API documentation

### 9. Save & Edit Templates (16-20 hours) - Paid Feature

**Implementation**:
- Set up database (Vercel Postgres or Supabase)
- User authentication (NextAuth.js)
- Template storage
- Template list page
- Edit and regenerate functionality

**New Files**:
- Database schema
- `pages/api/templates.js` - Template CRUD
- `pages/templates.js` - Template management UI
- Authentication setup

## 🛠️ Technical Stack Additions

### Phase 1
- `papaparse` or similar for client-side CSV parsing (for entry counter)

### Phase 2
- `jszip` for batch processing
- `googleapis` for Google Sheets integration
- OAuth setup

### Phase 3
- Database (Vercel Postgres or Supabase)
- `next-auth` for authentication
- API key management system

## 📊 Success Criteria

### Phase 1 Complete When:
- [ ] All 5 features implemented and tested
- [ ] Paid tier gated correctly
- [ ] No regressions in core functionality
- [ ] User feedback positive

### Phase 2 Complete When:
- [ ] Batch processing working smoothly
- [ ] Google Sheets integration tested
- [ ] Documentation updated

### Phase 3 Complete When:
- [ ] API functional and documented
- [ ] Template system working
- [ ] User accounts functional

## 🚨 Important Notes

1. **Stripe Integration**: Should be done alongside Phase 1 to enable paid features
2. **Testing**: Each feature needs thorough testing before release
3. **Documentation**: Update README and user docs as features are added
4. **Analytics**: Track feature usage to prioritize future work

---

**Ready to deploy v1.0, then start Phase 1! 🚀**

