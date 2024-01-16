# Directory Generator
This Node.js script generates a one-page directory in PDF format, designed to resemble a classic telephone book. It's ideal for environments that handle numerous daily phone calls, such as call centers, reception desks, front desk staff, and customer service representatives. The directory uses a three-column layout and includes leader dots for easy reading.

## Features
- Single-page PDF directory generation.
- Three-column layout, emulating the classic telephone book style.
- Custom leader dots between text elements for clarity.
- Adjustable settings for font size, line height, margins, and column width.
## Prerequisites
- Node.js
- PDF Kit library
- File System (fs) module
## Installation

```bash
# Clone the repository
git clone https://github.com/legertom/directory.git

# Navigate to the repository directory
cd directory

# Install dependencies (PDFKit)
npm install
```

## Usage 
1. Edit the data array in the script with your directory entries. Up to 204 entries (68 per column) can fit on a single page. 

1. Execute the script to generate the directory:
```bash
node simple.js
```
The generated directory will be saved as `output.pdf` in the same directory.

## Design Notes
The design of this directory emphasizes clarity and efficiency in presenting information. Each entry is composed of three key elements: primary data, secondary data (such as the name of a person or the location of an office), and a contact number, which can be in various formats. 

### Leader Dots
The use of leader dots plays a crucial role in enhancing readability. These dots guide the eye across the page, creating a visual bridge between the secondary data and the corresponding number. This feature is particularly useful in densely packed information, as it prevents the reader's eyes from straying to adjacent lines, thus making it easier to follow a line of text from start to finish. _N.B. The leader dots are ommited when the space available is less than 10 points wide._

### Typeface: Bell Centennial
The choice of font is integral to the directory's design. Bell Centennial, designed by Matthew Carter in 1978 specifically for AT&T Corporation to commemorate their 100th anniversary, is employed here. This typeface was created to address the unique challenges of telephone book printing, ensuring __high legibility at small sizes__ and compatibility with high-speed, cathode-ray-tube composing machines. This was a significant development over Bell Gothic, the typeface originally used for telephone books since 1937 but which became unsuitable with advancing technology.

Bell Centennial is a condensed sans-serif design, robust and space-efficient, making it ideal for this directory's purpose. Its excellent legibility, even in small print and lists, complements the directory's layout. The font's design allows for a high degree of clarity in tight spaces, an essential feature for a one-page directory with numerous entries. Additionally, Bell Centennial, particularly in its Alternate version, integrates seamlessly with other fonts, ensuring a harmonious and professional appearance. This font not only serves a practical purpose but also pays homage to the historical context of telephone directories, blending tradition with modern display needs. Learn more at: https://fonts.adobe.com/fonts/bell-centennial-std

### Measurement Units
The directory's measurements are defined in points, adhering to PDFKit's requirements for print formatting. This choice ensures that the printed document maintains consistent and precise dimensions, essential for physical copies where accuracy and legibility are paramount. Using points, a standard in the print industry, guarantees that the directory's layout translates effectively from screen to paper, fulfilling the practical needs of quick referencing in printed form.

### Single-Page Design
A single-page directory epitomizes the agile approach to information dissemination, streamlining the retrieval process and enhancing operational efficiency. By condensing critical contact data onto one page, we significantly reduce the cognitive load and time spent by individuals in navigating through voluminous pages, thereby facilitating swift decision-making and prompt action. 

## Customization
Modify these parameters in the script for customization:

* `fontSize`: Font size for the text.
* `lineHeight`: Line height for each entry.
* `leftMargin`, `topMargin`: Margins for the document.
* `columnWidth`, `columnGutter`: Width and spacing of the columns.

## Fonts
The script uses specific fonts to emulate the look of a classic telephone book. Ensure you have `Bell-Centennial-Std-Name---Number_6529.ttf` and `Bell-Centennial-Std-Address_6527.ttf` in the `./fonts/` directory.

## Contributing
Contributions are welcome! Feel free to submit pull requests or open issues for any improvements or bug fixes.

## License
This project is licensed under the MIT License.


