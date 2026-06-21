// --- 1. HANDLE DYNAMIC DATES (Fixing Redeclaration and Hyphen Errors) ---

// Setup Start Date (2 days ago)
const startDateObj = new Date();
startDateObj.setDate(startDateObj.getDate() - 2);

const startMm = String(startDateObj.getMonth() + 1).padStart(2, '0');
const startDd = String(startDateObj.getDate()).padStart(2, '0');
const startYyyy = startDateObj.getFullYear();
// Using forward slashes to match MLB API requirements
const startDate = `${startMm}/${startDd}/${startYyyy}`; 

// Setup End Date (30 days from now)
const endDateObj = new Date();
endDateObj.setSeconds(endDateObj.getSeconds() + 2592000);

const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
const endDay = String(endDateObj.getDate()).padStart(2, '0');
const endYear = endDateObj.getFullYear();
// Using forward slashes here as well
const endDate = `${endMonth}/${endDay}/${endYear}`;
const fs = require('fs');
const path = require('path');

// 1. Define the API endpoint
//const API_URL = "https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=112&startDate=06/02/2026&endDate=07/04/2026&hydrate=linescore";
// 1. Inject it into the API URL using template literals
const API_URL = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=112&startDate=${startDate}&endDate=${endDate}&hydrate=linescore`;

async function fetchAndSaveData() {
    try {
        // 2. Call the API using native fetch (available in Node.js 18+)
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // 3. Create a unique filename using the current timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const dirPath = path.join(__dirname, 'data');
        //const filePath = path.join(dirPath, `snapshot_${timestamp}.json`);
        const filePath = path.join(dirPath, `mlb_scoreboard.json`);

        // Ensure the 'data' directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // 4. Save the data locally
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log(`Successfully saved data to ${filePath}`);

    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        process.exit(1); // Exit with error code for GitHub Actions to notice
    }
}

fetchAndSaveData();
