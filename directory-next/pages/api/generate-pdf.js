import fs from 'fs';
import path from 'path';
import { Readable } from 'stream'; 
import { Buffer } from 'buffer';
import PDFDocument from 'pdfkit';
import csvParser from 'csv-parser';

export default function handler(req, res) {
    if (req.method === 'POST') {
      const { fileBase64 } = req.body;
      const buffer = Buffer.from(fileBase64, 'base64');
  
      const data = [];
      const csvStream = csvParser();
  
      // Create a new Readable stream and push the buffer to it
      const readable = new Readable();
      readable._read = () => {}; // _read is required but you can noop it
      readable.push(buffer);
      readable.push(null); // Push null to signal the end of the stream (EOF)
  
      readable
        .pipe(csvStream)
        .on('data', (row) => data.push(row))
        .on('end', () => {
          createPDF(data, (pdfBuffer) => {
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfBuffer);
          });
        });
  
    } else {
      res.status(405).end();
    }
  }


function createPDF(data, callback) {
  const doc = new PDFDocument({
    margins: {
      // Set each margin individually
      top: 72,
      bottom: 36,
      left: 36,
      right: 36,
    },
  });

  const pdfChunks = [];

  doc.on('data', (chunk) => pdfChunks.push(chunk));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(pdfChunks);
    callback(pdfBuffer);
  });


  const fontSize = 8;
  const lineHeight = 10;
  const leftMargin = 36;
  const topMargin = 72;
  const firstLineY = 72;
  const columnWidth = 172;
  const columnGutter = 12;
  const secondColumnX = leftMargin + columnWidth + columnGutter;
  const thirdColumnX = leftMargin + columnWidth * 2 + columnGutter * 2;

  const fontPathName = path.join(process.cwd(), 'fonts', 'Bell-Centennial-Std-Name---Number_6529.ttf');
  doc.registerFont(
    "CentName",
    fontPathName
  );
  const fontPathAddress = path.join(process.cwd(), 'fonts', 'Bell-Centennial-Std-Address_6527.ttf');

  doc.registerFont(
    "CentAddress",
    fontPathAddress
  );
  const fontPathTitle = path.join(process.cwd(), 'fonts', 'Knockout-HTF94-UltmtSumo.otf');
  doc.registerFont("Title", fontPathTitle);
  let directoryTitle = "D  i  r  e  c  t  o  r  y";
  directoryTitle = directoryTitle.toUpperCase();

  let titleFontSize = 36;
  doc.font("Title").fontSize(36);
  let directoryTitleWidth = doc.widthOfString(directoryTitle);
  let leftTitleMargin = (612 - directoryTitleWidth) / 2;

  let topTitleMargin = (topMargin - titleFontSize) / 2;

  doc
    .fillColor("#2133a6")
    .text(directoryTitle, leftTitleMargin, topTitleMargin)
    .fillColor("#000000");

  let rowsPerColumn = 68;

  for (let i = 0; i < data.length; i++) {
    let columnNumber = Math.floor(i / rowsPerColumn) + 1;

    let leftText = data[i].leftText;
    let middleText = data[i].middleText;
    let rightText = data[i].rightText;
    let xValueLeft =
      leftMargin + (columnNumber - 1) * (columnWidth + columnGutter);

    let rowWithinColumn = i % rowsPerColumn;
    let yValue = firstLineY + rowWithinColumn * lineHeight;
    doc.fontSize(fontSize).font("CentName").text(leftText, xValueLeft, yValue);
    let leftTextWidth = doc.widthOfString(leftText);
    let xValueMiddle = xValueLeft + leftTextWidth + 1;
    doc.font("CentAddress");
    let middleTextWidth = doc.widthOfString(middleText);
    doc.text(middleText, xValueMiddle, yValue);

    doc.font("CentName");
    let rightTextWidth = doc.widthOfString(rightText);
    let totalTextWidth = leftTextWidth + middleTextWidth + rightTextWidth;
    let leaderDotsWidth = columnWidth - totalTextWidth;

    let xValueRight = xValueLeft + columnWidth - rightTextWidth;
    if (leaderDotsWidth > 10) {
      const dotWidth = doc.widthOfString(".");
      const spaceWidth = doc.widthOfString(" ");

      // Initialize the leader dots string
      let leaderDots = "";
      let currentWidth = 0;

      // Build the leader dots string within the available width
      while (currentWidth + dotWidth + spaceWidth <= leaderDotsWidth) {
        leaderDots += " .";
        currentWidth += dotWidth + spaceWidth;
      }

      
      let xValueDots = xValueRight - leaderDotsWidth;

      doc.text(leaderDots, xValueDots, yValue);

      doc.fillColor("#000000").text(rightText, xValueRight, yValue);
    } else {
      doc
        //.fillColor("#FF5733") // mark the line as red if it's too long
        .text(rightText, xValueRight, yValue)
        .fillColor("#000000");
    }
  }

  doc.end();
}
