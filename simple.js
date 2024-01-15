const PDFDocument = require("pdfkit");
const fs = require("fs");

const doc = new PDFDocument({
  margins: {
    // Allows you to set each margin individually
    top: 72,
    bottom: 36, // Set a specific bottom margin
    left: 36,
    right: 36,
  },
});
doc.pipe(fs.createWriteStream("output.pdf"));
const fontSize = 8;
const lineHeight = 10;
const leftMargin = 36;
const topMargin = 72;
const firstLineY = 72;
const columnWidth = 172;
const columnGutter = 12;
const secondColumnX = leftMargin + columnWidth + columnGutter;
const thirdColumnX = leftMargin + columnWidth * 2 + columnGutter * 2;

const data = [
  {
    leftText: "Acquisitions",
    middleText: "Basement-32",
    rightText: "867-806-7274",
  },
  {
    leftText: "Acquisitions",
    middleText: "Zara Knight",
    rightText: "241-648-7179",
  },
  {
    leftText: "Acquisitions",
    middleText: "Sophie Díaz",
    rightText: "998-228-5448",
  },
  {
    leftText: "Acquisitions",
    middleText: "Erik Fuller",
    rightText: "1376",
  },
  {
    leftText: "Business Development",
    middleText: "Juan Carlos",
    rightText: "8195",
  },
  {
    leftText: "Business Development",
    middleText: "HQ-Rm 200",
    rightText: "3234/1279",
  },
  {
    leftText: "Compliance",
    middleText: "David Lee",
    rightText: "197-775-5989",
  },
  {
    leftText: "Corporate Strategy",
    middleText: "East Wing",
    rightText: "628-249-9922",
  },
  {
    leftText: "Cybersecurity",
    middleText: "Studio B",
    rightText: "788-320-3847",
  },
  {
    leftText: "Data Analysis",
    middleText: "David Lee",
    rightText: "810-313-9152",
  },
  {
    leftText: "Environmental Health",
    middleText: "B620",
    rightText: "268-583-9773",
  },
  {
    leftText: "Environmental Health",
    middleText: "M. Bernard",
    rightText: "523-195-2017",
  },
  {
    leftText: "Facilities Management",
    middleText: "Sophie Díaz",
    rightText: "179-598-7022",
  },
  {
    leftText: "Facilities Management",
    middleText: "Annex Lobby",
    rightText: "212-536-8216",
  },
  {
    leftText: "Global Logistics",
    middleText: "Erik Fuller",
    rightText: "367-684-8559",
  },

  {
    leftText: "Human Resources",
    middleText: "Studio B",
    rightText: "814-225-9500",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Cassandra Wu",
    rightText: "279-810-7882",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Erik Fuller",
    rightText: "770-729-7549",
  },
  {
    leftText: "Investor Relations",
    middleText: "3rd Floor",
    rightText: "253-193-9467",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Building A",
    rightText: "967-783-4436",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Linda White",
    rightText: "279-152-3878",
  },
  {
    leftText: "Market Research",
    middleText: "Robert Fischer",
    rightText: "565-594-9207",
  },
  {
    leftText: "Market Research",
    middleText: "Remote Office",
    rightText: "565-329-8558",
  },
  {
    leftText: "Media Production",
    middleText: "Omar Hassan",
    rightText: "427-856-1420",
  },
  {
    leftText: "Media Production",
    middleText: "Basement-32",
    rightText: "328-653-4874",
  },

  {
    leftText: "Sales and Marketing",
    middleText: "Tom Clark",
    rightText: "730-987-8678",
  },
  {
    leftText: "Supply Chain",
    middleText: "Fitness Center",
    rightText: "359-691-6051",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Sarah Johnson",
    rightText: "469-780-3748",
  },
  {
    leftText: "Public Affairs",
    middleText: "Sarah Johnson",
    rightText: "448-482-7783",
  },
  {
    leftText: "Outreach Programs",
    middleText: "Main Office",
    rightText: "661-754-6268",
  },
  {
    leftText: "Software Engineering",
    middleText: "Obs. Deck",
    rightText: "614-241-7717",
  },
  {
    leftText: "Supply Chain",
    middleText: "Basement-32",
    rightText: "233-603-8228",
  },
  {
    leftText: "Product Development",
    middleText: "Exec. Suite",
    rightText: "898-587-5793",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Erik Fuller",
    rightText: "715-602-7783",
  },
  {
    leftText: "Virtual Reality Unit",
    middleText: "Brian Taylor",
    rightText: "266-981-2094",
  },
  {
    leftText: "Acquisitions",
    middleText: "Basement-32",
    rightText: "867-806-7274",
  },
  {
    leftText: "Acquisitions",
    middleText: "Zara Knight",
    rightText: "241-648-7179",
  },
  {
    leftText: "Acquisitions",
    middleText: "Sophie Díaz",
    rightText: "998-228-5448",
  },
  {
    leftText: "Acquisitions",
    middleText: "Erik Fuller",
    rightText: "117-645-1376",
  },
  {
    leftText: "Business Development",
    middleText: "Juan Carlos",
    rightText: "710-734-8195",
  },
  {
    leftText: "Business Development",
    middleText: "HQ:Rm 200",
    rightText: "904-299-1279",
  },
  {
    leftText: "Compliance",
    middleText: "David Lee",
    rightText: "197-775-5989",
  },
  {
    leftText: "Corporate Strategy",
    middleText: "East Wing",
    rightText: "628-249-9922",
  },
  {
    leftText: "Cybersecurity",
    middleText: "Studio B",
    rightText: "788-320-3847",
  },
  {
    leftText: "Data Analysis",
    middleText: "David Lee",
    rightText: "810-313-9152",
  },
  {
    leftText: "Environmental Health",
    middleText: "B620",
    rightText: "268-583-9773",
  },
  {
    leftText: "Environmental Health",
    middleText: "M. Bernard",
    rightText: "523-195-2017",
  },
  {
    leftText: "Facilities Management",
    middleText: "Sophie Díaz",
    rightText: "179-598-7022",
  },
  {
    leftText: "Facilities Management",
    middleText: "Annex Bldg",
    rightText: "212-536-8216",
  },
  {
    leftText: "Global Logistics",
    middleText: "Erik Fuller",
    rightText: "367-684-8559",
  },

  {
    leftText: "Human Resources",
    middleText: "Studio B",
    rightText: "814-225-9500",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Cassandra Wu",
    rightText: "279-810-7882",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Erik Fuller",
    rightText: "770-729-7549",
  },
  {
    leftText: "Investor Relations",
    middleText: "3rd Floor",
    rightText: "253-193-9467",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Building A",
    rightText: "967-783-4436",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Linda White",
    rightText: "279-152-3878",
  },
  {
    leftText: "Market Research",
    middleText: "Robert Fischer",
    rightText: "565-594-9207",
  },
  {
    leftText: "Market Research",
    middleText: "Remote Office",
    rightText: "565-329-8558",
  },
  {
    leftText: "Media Production",
    middleText: "Omar Hassan",
    rightText: "427-856-1420",
  },
  {
    leftText: "Media Production",
    middleText: "Basement-32",
    rightText: "328-653-4874",
  },

  {
    leftText: "Sales and Marketing",
    middleText: "Tom Clark",
    rightText: "730-987-8678",
  },
  {
    leftText: "Supply Chain",
    middleText: "Fitness Center",
    rightText: "359-691-6051",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Sarah Johnson",
    rightText: "469-780-3748",
  },
  {
    leftText: "Public Affairs",
    middleText: "Sarah Johnson",
    rightText: "448-482-7783",
  },
  {
    leftText: "Outreach Programs",
    middleText: "Main Office",
    rightText: "661-754-6268",
  },
  {
    leftText: "Software Engineering",
    middleText: "Obs. Deck",
    rightText: "614-241-7717",
  },
  {
    leftText: "Supply Chain",
    middleText: "Basement-32",
    rightText: "233-603-8228",
  },
  {
    leftText: "Product Development",
    middleText: "Exec. Suite",
    rightText: "898-587-5793",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Erik Fuller",
    rightText: "715-602-7783",
  },
  {
    leftText: "Virtual Reality Unit",
    middleText: "Brian Taylor",
    rightText: "266-981-2094",
  },
  {
    leftText: "Acquisitions",
    middleText: "Basement-32",
    rightText: "867-806-7274",
  },
  {
    leftText: "Acquisitions",
    middleText: "Zara Knight",
    rightText: "241-648-7179",
  },
  {
    leftText: "Acquisitions",
    middleText: "Sophie Díaz",
    rightText: "998-228-5448",
  },
  {
    leftText: "Acquisitions",
    middleText: "Erik Fuller",
    rightText: "117-645-1376",
  },
  {
    leftText: "Business Development",
    middleText: "Juan Carlos",
    rightText: "710-734-8195",
  },
  {
    leftText: "Business Development",
    middleText: "HQ-Rm 200",
    rightText: "904-299-1279",
  },
  {
    leftText: "Compliance",
    middleText: "David Lee",
    rightText: "197-775-5989",
  },
  {
    leftText: "Corporate Strategy",
    middleText: "East Wing",
    rightText: "628-249-9922",
  },
  {
    leftText: "Cybersecurity",
    middleText: "Studio B",
    rightText: "788-320-3847",
  },
  {
    leftText: "Data Analysis",
    middleText: "David Lee",
    rightText: "810-313-9152",
  },
  {
    leftText: "Environmental Health",
    middleText: "B620",
    rightText: "268-583-9773",
  },
  {
    leftText: "Environmental Health",
    middleText: "M. Bernard",
    rightText: "523-195-2017",
  },
  {
    leftText: "Facilities Management",
    middleText: "Sophie Díaz",
    rightText: "179-598-7022",
  },
  {
    leftText: "Facilities Management",
    middleText: "Annex Lobby",
    rightText: "212-536-8216",
  },
  {
    leftText: "Global Logistics",
    middleText: "Erik Fuller",
    rightText: "367-684-8559",
  },

  {
    leftText: "Human Resources",
    middleText: "Studio B",
    rightText: "814-225-9500",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Cassandra Wu",
    rightText: "279-810-7882",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Erik Fuller",
    rightText: "770-729-7549",
  },
  {
    leftText: "Investor Relations",
    middleText: "3rd Floor",
    rightText: "253-193-9467",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Building A",
    rightText: "967-783-4436",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Linda White",
    rightText: "279-152-3878",
  },
  {
    leftText: "Market Research",
    middleText: "Robert Fischer",
    rightText: "565-594-9207",
  },
  {
    leftText: "Market Research",
    middleText: "Remote Office",
    rightText: "565-329-8558",
  },
  {
    leftText: "Media Production",
    middleText: "Omar Hassan",
    rightText: "427-856-1420",
  },
  {
    leftText: "Media Production",
    middleText: "Basement-32",
    rightText: "328-653-4874",
  },

  {
    leftText: "Sales and Marketing",
    middleText: "Tom Clark",
    rightText: "730-987-8678",
  },
  {
    leftText: "Supply Chain",
    middleText: "Fitness Center",
    rightText: "359-691-6051",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Sarah Johnson",
    rightText: "469-780-3748",
  },
  {
    leftText: "Public Affairs",
    middleText: "Sarah Johnson",
    rightText: "448-482-7783",
  },
  {
    leftText: "Outreach Programs",
    middleText: "Main Office",
    rightText: "661-754-6268",
  },
  {
    leftText: "Software Engineering",
    middleText: "Obs. Deck",
    rightText: "614-241-7717",
  },
  {
    leftText: "Supply Chain",
    middleText: "Basement-32",
    rightText: "233-603-8228",
  },
  {
    leftText: "Product Development",
    middleText: "Exec. Suite",
    rightText: "898-587-5793",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Erik Fuller",
    rightText: "715-602-7783",
  },
  {
    leftText: "Virtual Reality Unit",
    middleText: "Brian Taylor",
    rightText: "266-981-2094",
  },
  {
    leftText: "Acquisitions",
    middleText: "Basement-32",
    rightText: "867-806-7274",
  },
  {
    leftText: "Acquisitions",
    middleText: "Zara Knight",
    rightText: "241-648-7179",
  },
  {
    leftText: "Acquisitions",
    middleText: "Sophie Díaz",
    rightText: "998-228-5448",
  },
  {
    leftText: "Acquisitions",
    middleText: "Erik Fuller",
    rightText: "117-645-1376",
  },
  {
    leftText: "Business Development",
    middleText: "Juan Carlos",
    rightText: "710-734-8195",
  },
  {
    leftText: "Business Development",
    middleText: "HQ:Rm 200",
    rightText: "904-299-1279",
  },
  {
    leftText: "Compliance",
    middleText: "David Lee",
    rightText: "197-775-5989",
  },
  {
    leftText: "Corporate Strategy",
    middleText: "East Wing",
    rightText: "628-249-9922",
  },
  {
    leftText: "Cybersecurity",
    middleText: "Studio B",
    rightText: "788-320-3847",
  },
  {
    leftText: "Data Analysis",
    middleText: "David Lee",
    rightText: "810-313-9152",
  },
  {
    leftText: "Environmental Health",
    middleText: "B620",
    rightText: "268-583-9773",
  },
  {
    leftText: "Environmental Health",
    middleText: "M. Bernard",
    rightText: "523-195-2017",
  },
  {
    leftText: "Facilities Management",
    middleText: "Sophie Díaz",
    rightText: "179-598-7022",
  },
  {
    leftText: "Facilities Management",
    middleText: "Annex Bldg",
    rightText: "212-536-8216",
  },
  {
    leftText: "Global Logistics",
    middleText: "Erik Fuller",
    rightText: "367-684-8559",
  },

  {
    leftText: "Human Resources",
    middleText: "Studio B",
    rightText: "814-225-9500",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Cassandra Wu",
    rightText: "279-810-7882",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Erik Fuller",
    rightText: "770-729-7549",
  },
  {
    leftText: "Investor Relations",
    middleText: "3rd Floor",
    rightText: "253-193-9467",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Building A",
    rightText: "967-783-4436",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Linda White",
    rightText: "279-152-3878",
  },
  {
    leftText: "Market Research",
    middleText: "Robert Fischer",
    rightText: "565-594-9207",
  },
  {
    leftText: "Market Research",
    middleText: "Remote Office",
    rightText: "565-329-8558",
  },
  {
    leftText: "Media Production",
    middleText: "Omar Hassan",
    rightText: "427-856-1420",
  },
  {
    leftText: "Media Production",
    middleText: "Basement-32",
    rightText: "328-653-4874",
  },

  {
    leftText: "Sales and Marketing",
    middleText: "Tom Clark",
    rightText: "730-987-8678",
  },
  {
    leftText: "Supply Chain",
    middleText: "Fitness Center",
    rightText: "359-691-6051",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Sarah Johnson",
    rightText: "469-780-3748",
  },
  {
    leftText: "Public Affairs",
    middleText: "Sarah Johnson",
    rightText: "448-482-7783",
  },
  {
    leftText: "Outreach Programs",
    middleText: "Main Office",
    rightText: "661-754-6268",
  },
  {
    leftText: "Software Engineering",
    middleText: "Obs. Deck",
    rightText: "614-241-7717",
  },
  {
    leftText: "Supply Chain",
    middleText: "Basement-32",
    rightText: "233-603-8228",
  },
  {
    leftText: "Product Development",
    middleText: "Exec. Suite",
    rightText: "898-587-5793",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Erik Fuller",
    rightText: "715-602-7783",
  },
  {
    leftText: "Virtual Reality Unit",
    middleText: "Brian Taylor",
    rightText: "266-981-2094",
  },
  {
    leftText: "Acquisitions",
    middleText: "Basement-32",
    rightText: "867-806-7274",
  },
  {
    leftText: "Acquisitions",
    middleText: "Zara Knight",
    rightText: "241-648-7179",
  },
  {
    leftText: "Acquisitions",
    middleText: "Sophie Díaz",
    rightText: "998-228-5448",
  },
  {
    leftText: "Acquisitions",
    middleText: "Erik Fuller",
    rightText: "117-645-1376",
  },
  {
    leftText: "Business Development",
    middleText: "Juan Carlos",
    rightText: "710-734-8195",
  },
  {
    leftText: "Business Development",
    middleText: "HQ-Rm 200",
    rightText: "904-299-1279",
  },
  {
    leftText: "Compliance",
    middleText: "David Lee",
    rightText: "197-775-5989",
  },
  {
    leftText: "Corporate Strategy",
    middleText: "East Wing",
    rightText: "628-249-9922",
  },
  {
    leftText: "Cybersecurity",
    middleText: "Studio B",
    rightText: "788-320-3847",
  },
  {
    leftText: "Data Analysis",
    middleText: "David Lee",
    rightText: "810-313-9152",
  },
  {
    leftText: "Environmental Health",
    middleText: "B620",
    rightText: "268-583-9773",
  },
  {
    leftText: "Environmental Health",
    middleText: "M. Bernard",
    rightText: "523-195-2017",
  },
  {
    leftText: "Facilities Management",
    middleText: "Sophie Díaz",
    rightText: "179-598-7022",
  },
  {
    leftText: "Facilities Management",
    middleText: "Annex Lobby",
    rightText: "212-536-8216",
  },
  {
    leftText: "Global Logistics",
    middleText: "Erik Fuller",
    rightText: "367-684-8559",
  },

  {
    leftText: "Human Resources",
    middleText: "Studio B",
    rightText: "814-225-9500",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Cassandra Wu",
    rightText: "279-810-7882",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Erik Fuller",
    rightText: "770-729-7549",
  },
  {
    leftText: "Investor Relations",
    middleText: "3rd Floor",
    rightText: "253-193-9467",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Building A",
    rightText: "967-783-4436",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Linda White",
    rightText: "279-152-3878",
  },
  {
    leftText: "Market Research",
    middleText: "Robert Fischer",
    rightText: "565-594-9207",
  },
  {
    leftText: "Market Research",
    middleText: "Remote Office",
    rightText: "565-329-8558",
  },
  {
    leftText: "Media Production",
    middleText: "Omar Hassan",
    rightText: "427-856-1420",
  },
  {
    leftText: "Media Production",
    middleText: "Basement-32",
    rightText: "328-653-4874",
  },

  {
    leftText: "Sales and Marketing",
    middleText: "Tom Clark",
    rightText: "730-987-8678",
  },
  {
    leftText: "Supply Chain",
    middleText: "Fitness Center",
    rightText: "359-691-6051",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Sarah Johnson",
    rightText: "469-780-3748",
  },
  {
    leftText: "Public Affairs",
    middleText: "Sarah Johnson",
    rightText: "448-482-7783",
  },
  {
    leftText: "Outreach Programs",
    middleText: "Main Office",
    rightText: "661-754-6268",
  },
  {
    leftText: "Software Engineering",
    middleText: "Obs. Deck",
    rightText: "614-241-7717",
  },
  {
    leftText: "Supply Chain",
    middleText: "Basement-32",
    rightText: "233-603-8228",
  },
  {
    leftText: "Product Development",
    middleText: "Exec. Suite",
    rightText: "898-587-5793",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Erik Fuller",
    rightText: "715-602-7783",
  },
  {
    leftText: "Virtual Reality Unit",
    middleText: "Brian Taylor",
    rightText: "266-981-2094",
  },
  {
    leftText: "Acquisitions",
    middleText: "Basement-32",
    rightText: "867-806-7274",
  },
  {
    leftText: "Acquisitions",
    middleText: "Zara Knight",
    rightText: "241-648-7179",
  },
  {
    leftText: "Acquisitions",
    middleText: "Sophie Díaz",
    rightText: "998-228-5448",
  },
  {
    leftText: "Acquisitions",
    middleText: "Erik Fuller",
    rightText: "117-645-1376",
  },
  {
    leftText: "Business Development",
    middleText: "Juan Carlos",
    rightText: "710-734-8195",
  },
  {
    leftText: "Business Development",
    middleText: "HQ:Rm 200",
    rightText: "904-299-1279",
  },
  {
    leftText: "Compliance",
    middleText: "David Lee",
    rightText: "197-775-5989",
  },
  {
    leftText: "Corporate Strategy",
    middleText: "East Wing",
    rightText: "628-249-9922",
  },
  {
    leftText: "Cybersecurity",
    middleText: "Studio B",
    rightText: "788-320-3847",
  },
  {
    leftText: "Data Analysis",
    middleText: "David Lee",
    rightText: "810-313-9152",
  },
  {
    leftText: "Environmental Health",
    middleText: "B620",
    rightText: "268-583-9773",
  },
  {
    leftText: "Environmental Health",
    middleText: "M. Bernard",
    rightText: "523-195-2017",
  },
  {
    leftText: "Facilities Management",
    middleText: "Sophie Díaz",
    rightText: "179-598-7022",
  },
  {
    leftText: "Facilities Management",
    middleText: "Annex Bldg",
    rightText: "212-536-8216",
  },
  {
    leftText: "Global Logistics",
    middleText: "Erik Fuller",
    rightText: "367-684-8559",
  },

  {
    leftText: "Human Resources",
    middleText: "Studio B",
    rightText: "814-225-9500",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Cassandra Wu",
    rightText: "279-810-7882",
  },
  {
    leftText: "Innovation Lab",
    middleText: "Erik Fuller",
    rightText: "770-729-7549",
  },
  {
    leftText: "Investor Relations",
    middleText: "3rd Floor",
    rightText: "253-193-9467",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Building A",
    rightText: "967-783-4436",
  },
  {
    leftText: "Legal Affairs",
    middleText: "Linda White",
    rightText: "279-152-3878",
  },
  {
    leftText: "Market Research",
    middleText: "Robert Fischer",
    rightText: "565-594-9207",
  },
  {
    leftText: "Market Research",
    middleText: "Remote Office",
    rightText: "565-329-8558",
  },
  {
    leftText: "Media Production",
    middleText: "Omar Hassan",
    rightText: "427-856-1420",
  },
  {
    leftText: "Media Production",
    middleText: "Basement-32",
    rightText: "328-653-4874",
  },

  {
    leftText: "Sales and Marketing",
    middleText: "Tom Clark",
    rightText: "730-987-8678",
  },
  {
    leftText: "Supply Chain",
    middleText: "Fitness Center",
    rightText: "359-691-6051",
  },
  {
    leftText: "Workplace Safety",
    middleText: "Sarah Johnson",
    rightText: "469-780-3748",
  },
  {
    leftText: "Public Affairs",
    middleText: "Sarah Johnson",
    rightText: "448-482-7783",
  },
  //   {
  //     leftText: "Outreach Programs",
  //     middleText: "Main Office",
  //     rightText: "661-754-6268",
  //   },
  //   {
  //     leftText: "Software Engineering",
  //     middleText: "Obs. Deck",
  //     rightText: "614-241-7717",
  //   },
  //   {
  //     leftText: "Supply Chain",
  //     middleText: "Basement-32",
  //     rightText: "233-603-8228",
  //   },
  //   {
  //     leftText: "Product Development",
  //     middleText: "Exec. Suite",
  //     rightText: "898-587-5793",
  //   },
  //   {
  //     leftText: "Workplace Safety",
  //     middleText: "Erik Fuller",
  //     rightText: "715-602-7783",
  //   },
  //   {
  //     leftText: "Virtual Reality Unit",
  //     middleText: "Brian Taylor",
  //     rightText: "266-981-2094",
  //   },
];

doc.registerFont(
  "CentName",
  "./fonts/Bell-Centennial-Std-Name---Number_6529.ttf"
);
doc.registerFont("CentAddress", "./fonts/Bell-Centennial-Std-Address_6527.ttf");

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

    // Now print the leader dots string
    // Assuming xValueMiddle is the starting position for the middle text
    let xValueDots = xValueRight - leaderDotsWidth;

    doc.text(leaderDots, xValueDots, yValue);

    doc.fillColor("#000000").text(rightText, xValueRight, yValue);
  } else {
    doc
      .fillColor("#FF5733")
      .text(rightText, xValueRight, yValue)
      .fillColor("#000000");
  }
}

// doc
//   .font("CentAddress")
//   .fontSize(fontSize)
//   .text("Column #2", secondColumnX, firstLineY);
// doc.fontSize(fontSize).text("Column #3", thirdColumnX, firstLineY);
doc.end();
