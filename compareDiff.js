const fs = require('fs');

// Read the contents of the log files
const logFile1 = 'logDiff.log';
const logFile2 = 'parsedFile_v3.log';
const logData1 = fs.readFileSync(logFile1, 'utf-8').split('\n');
const logData2 = fs.readFileSync(logFile2, 'utf-8').split('\n');

// Create a new file to store the differences
const diffFile = 'compareLog.txt';
fs.writeFileSync(diffFile, '');

// Compare the contents of the log files line by line
for (let i = 0; i < logData1.length; i++) {
  if (logData1[i].trim() !== logData2[i].trim()) {
    // Append the line to the diff file
    if(!(logData1[i].includes('\'S') || logData1[i].includes('\'E') || logData2[i].includes('\'S') || logData2[i].includes('\'E'))) {
        fs.appendFileSync(diffFile, `Difference on line ${i + 1}:\n`);
        fs.appendFileSync(diffFile, `${logFile1}: ${logData1[i]}\n`);
        fs.appendFileSync(diffFile, `${logFile2}: ${logData2[i]}\n\n`);
    }
  }
}
