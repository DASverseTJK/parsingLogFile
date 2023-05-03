const fs = require('fs');
const mysql = require('mysql');

// Set up a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'testpw',
  database: 'parsing',
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
  
  // Query the database to retrieve data
  const query = 'SELECT * FROM validatelog';
  connection.query(query, (err, results) => {
    if (err) throw err;
    
    // Write the data to the log file
    const logFile = 'logDiff.log';
    const logData = JSON.stringify(results, null, 2);
    fs.writeFileSync(logFile, logData);
    console.log('Data written to log file.');
    
    // Disconnect from the database
    connection.end((err) => {
      if (err) throw err;
      console.log('Disconnected from the database.');
    });
  });
});
