// 1. Get the current date and subtract 2 days
const date = new Date();
date.setDate(date.getDate() - 2);

// 2. Format as MM-DD-YYYY
const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const dd = String(date.getDate()).padStart(2, '0');
const yyyy = date.getFullYear();

const startDate = `${mm}-${dd}-${yyyy}`;

// Get the current date and add 2,592,000 seconds (30 days)
const date = new Date();
date.setSeconds(date.getSeconds() + 2592000);

// Format as YYYY-MM-DD
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const day = String(date.getDate()).padStart(2, '0');

const endDate = `${month}-${day}-${year}`;

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
