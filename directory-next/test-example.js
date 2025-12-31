const fs = require('fs');
const path = require('path');

// Example CSV data (180 entries)
const exampleCSV = `leftText,middleText,rightText
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

// Convert to base64
const base64 = Buffer.from(exampleCSV).toString('base64');

// Make API call
async function generatePDF() {
    try {
        const response = await fetch('http://localhost:3000/api/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                fileBase64: base64,
                isPaid: false 
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Error:', error);
            return;
        }

        const buffer = await response.arrayBuffer();
        fs.writeFileSync('example-preview.pdf', Buffer.from(buffer));
        console.log('PDF generated successfully: example-preview.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error.message);
    }
}

generatePDF();

