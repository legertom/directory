const fs = require('fs');
const path = require('path');

const fontsPath = path.join(__dirname, 'fonts');
console.log('Fonts directory exists:', fs.existsSync(fontsPath)); // Should log true

const fontFiles = [
  "Bell-Centennial-Std-Name---Number_6529.ttf",
  "Bell-Centennial-Std-Address_6527.ttf",
  "Knockout-HTF94-UltmtSumo.otf"
];

fontFiles.forEach((fontFile) => {
  const filePath = path.join(fontsPath, fontFile);
  console.log(`Font file ${fontFile} exists:`, fs.existsSync(filePath));
});
