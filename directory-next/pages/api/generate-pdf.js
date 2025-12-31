import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { Buffer } from 'buffer';
import PDFDocument from 'pdfkit';
import csvParser from 'csv-parser';

// Configuration constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ROWS = 204; // Maximum entries (68 per column × 3 columns)
const REQUIRED_CSV_COLUMNS = ['leftText', 'middleText', 'rightText'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileBase64, isPaid = false } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file size
    const buffer = Buffer.from(fileBase64, 'base64');
    if (buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      });
    }

    // Parse CSV
    const data = await parseCSV(buffer);
    
    // Validate data
    if (data.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty or invalid' });
    }

    if (data.length > MAX_ROWS) {
      return res.status(400).json({ 
        error: `Too many rows. Maximum is ${MAX_ROWS} entries (68 per column)` 
      });
    }

    // Generate PDF
    const websiteUrl = process.env.WEBSITE_URL || '1pg.directory';
    const pdfBuffer = await createPDF(data, !isPaid, websiteUrl);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="directory.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Provide more specific error messages
    if (error.message.includes('CSV')) {
      return res.status(400).json({ error: 'Invalid CSV format. Please ensure your CSV has columns: leftText, middleText, rightText' });
    }
    
    res.status(500).json({ 
      error: 'Error generating PDF. Please check your CSV format and try again.' 
    });
  }
}

function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const data = [];
    const csvStream = csvParser();
    const readable = new Readable();

    readable._read = () => {}; // No-op
    readable.push(buffer);
    readable.push(null); // EOF

    readable
      .pipe(csvStream)
      .on('data', (row) => {
        // Validate required columns exist
        const hasRequiredColumns = REQUIRED_CSV_COLUMNS.every(col => 
          row.hasOwnProperty(col) || row[col] !== undefined
        );
        
        if (hasRequiredColumns) {
          data.push({
            leftText: String(row.leftText || '').trim(),
            middleText: String(row.middleText || '').trim(),
            rightText: String(row.rightText || '').trim(),
          });
        }
      })
      .on('error', (error) => reject(new Error(`CSV parsing error: ${error.message}`)))
      .on('end', () => {
        if (data.length === 0) {
          reject(new Error('CSV file contains no valid data'));
        }
        resolve(data);
      });
  });
}

function createPDF(data, showWatermark = false, websiteUrl = '') {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [612, 792], // Explicitly set page size (Letter: 8.5" x 11" = 612 x 792 points)
      margins: {
        top: 72,
        bottom: showWatermark ? 50 : 36, // Extra space for watermark
        left: 36,
        right: 36,
      },
      autoFirstPage: true,
    });

    const pdfChunks = [];

    doc.on('data', (chunk) => pdfChunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(pdfChunks);
      resolve(pdfBuffer);
    });
    doc.on('error', reject);

    // Layout constants
    const fontSize = 8;
    const lineHeight = 10;
    const leftMargin = 36;
    const topMargin = 72;
    const firstLineY = 72;
    const columnWidth = 172;
    const columnGutter = 12;
    const pageWidth = 612;
    const pageHeight = 792;

    // Register fonts
    const fontPath = (fontName) => {
      return path.join(process.cwd(), 'fonts', fontName);
    };

    try {
      doc.registerFont("CentName", fontPath('Bell-Centennial-Std-Name---Number_6529.ttf'));
      doc.registerFont("CentAddress", fontPath('Bell-Centennial-Std-Address_6527.ttf'));
      doc.registerFont("Title", fontPath('AvenirNext-Heavy.otf'));
    } catch (error) {
      reject(new Error(`Font loading error: ${error.message}`));
      return;
    }

    // Draw title
    let directoryTitle = "Directory";
    directoryTitle = directoryTitle.toUpperCase();
    let titleFontSize = 38;
    doc.font("Title").fontSize(titleFontSize);
    
    // Calculate character spacing for title
    let charWidths = directoryTitle.split('').map(char => doc.widthOfString(char));
    let totalCharWidth = charWidths.reduce((acc, width) => acc + width, 0);
    let totalSpace = 540 - totalCharWidth;
    let gaps = directoryTitle.length - 1;
    let spaceBetweenChars = gaps > 0 ? totalSpace / gaps : 0;
    let topTitleMargin = (topMargin - titleFontSize) / 2;

    let currentX = 36;
    let currentY = topTitleMargin;
    directoryTitle.split('').forEach((char, index) => {
      doc
        .fillColor("#1F4685")
        .text(char, currentX, currentY);
      currentX += charWidths[index] + spaceBetweenChars;
    });

    // Draw directory entries
    let rowsPerColumn = 68;
    
    // Save the graphics state and ensure we stay on first page
    doc.save();

    for (let i = 0; i < data.length; i++) {
      let columnNumber = Math.floor(i / rowsPerColumn) + 1;
      
      if (columnNumber > 3) {
        // Skip entries beyond 3 columns
        continue;
      }

      let leftText = data[i].leftText || '';
      let middleText = data[i].middleText || '';
      let rightText = data[i].rightText || '';
      let xValueLeft = leftMargin + (columnNumber - 1) * (columnWidth + columnGutter);

      // Calculate row position within the column (resets to 0 for each new column)
      // This ensures column 2 starts at row 0 again, column 3 starts at row 0, etc.
      let rowWithinColumn = i % rowsPerColumn;
      let yValue = firstLineY + rowWithinColumn * lineHeight;
      
      // Draw left text - using absolute positioning with lineBreak: false
      doc.fillColor("#000000").fontSize(fontSize).font("CentName");
      doc.text(leftText, xValueLeft, yValue, { lineBreak: false, continued: false });
      let leftTextWidth = doc.widthOfString(leftText);
      
      // Draw middle text
      let xValueMiddle = xValueLeft + leftTextWidth + 1;
      doc.font("CentAddress");
      let middleTextWidth = doc.widthOfString(middleText);
      doc.text(middleText, xValueMiddle, yValue, { lineBreak: false });

      // Draw right text with leader dots
      doc.font("CentName");
      let rightTextWidth = doc.widthOfString(rightText);
      let totalTextWidth = leftTextWidth + middleTextWidth + rightTextWidth;
      let leaderDotsWidth = columnWidth - totalTextWidth;

      let xValueRight = xValueLeft + columnWidth - rightTextWidth;
      
      if (leaderDotsWidth > 10) {
        const dotWidth = doc.widthOfString(".");
        const spaceWidth = doc.widthOfString(" ");

        let leaderDots = "";
        let currentWidth = 0;

        while (currentWidth + dotWidth + spaceWidth <= leaderDotsWidth) {
          leaderDots += " .";
          currentWidth += dotWidth + spaceWidth;
        }

        let xValueDots = xValueRight - leaderDotsWidth;
        doc.text(leaderDots, xValueDots, yValue, { lineBreak: false });
        doc.fillColor("#000000").text(rightText, xValueRight, yValue, { lineBreak: false });
      } else {
        doc.text(rightText, xValueRight, yValue, { lineBreak: false }).fillColor("#000000");
      }
    }

    // Restore graphics state
    doc.restore();

    // Add watermark if free tier
    if (showWatermark && websiteUrl) {
      doc.font("CentAddress").fontSize(7).fillColor("#999999");
      const watermarkText = `Generated by ${websiteUrl}`;
      const watermarkWidth = doc.widthOfString(watermarkText);
      const watermarkX = (pageWidth - watermarkWidth) / 2;
      const watermarkY = pageHeight - 30;
      doc.text(watermarkText, watermarkX, watermarkY, { lineBreak: false });
    }

    doc.end();
  });
}
