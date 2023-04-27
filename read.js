// import modules program needs
const fs = require('fs');
const mysql = require('mysql');


const fileName = 'metapocket-dev-out.log';
// const fileName = 'dd.log';

const url = '/mpocket/wallet/signup';
const fileNameOG = 'metapocket-dev-out.log';
const startPoint = "  \'S";
const endPoint = "  \'E";


// creating connection to 'Dictrionary' database from workbench
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'testpw',
  database: 'parsing'  
});


/**
 * It opens file and filters out
 * 
 */
function validateFile(filename) {
  fs.readFile(filename, 'utf8', (err, data) => {
    // file open file.
    if (err) {
      console.error("File is not correctly opened. Either check file name or file path: " + err);
      return;
    }
    // split the file data into lines of array to check each lines 
    const logs = data.split('\n');
    
    // empty array block to save logs into array format to set up flags for checklist 
    const blocks = [];
    let block = null;

    let i = 1;
    // execute until file reaches end
    while (logs.length > 0) {  
      // checking console that program actually running because the log file is really big.
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      process.stdout.write(`:      working: ${i}\r`);
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      i = i + 1;

     const log = logs.shift();

      if (log.startsWith(startPoint) && log.includes(url)) {
        // creating empty object to start with new block
        block = {};
        block.start = log.replace(/\r/, "");
        block.uid = null;
        block.end = null;
        // first + last word == validator checking variable
        firstVal = null;
        lastVal = null;
        continue;
      }
      
      /**  
       * If line has endingPoint('E) with desire url and have all the values in
       * fill up the block.end with value and push the full block into array
       */
      else if (log.startsWith(endPoint) && log.includes(url)) {
        // if statement won't get passed if value is null.
        if (block && block.uid ) {
          block.end = log.replace(/\r/, "");
          // blocks will be inserted into DB
          
          blocks.push(block);
          //console.log(block);
          
          // con.query(`INSERT IGNORE INTO  parsing.validatelog (uid, wid, words, validator) VALUES (${block.uid}, ${block.wid}, '${block.words}', '${block.validator}')`);

        }
        // emptying the block so that program can filter and fill up the value
        block = null;
        continue;
      } 
      
      else if (block && log.includes('uid')) {
        // if there is value, don't fill up the block.
        if (block.uid === null) {
          /**
           * Log : [2023/02/27 01:15:16.618] [DEBUG] uid [ '1000001' ]
           * block.uid = log.match(/\w+/)[0];
           * This line will print out 2023, because it will grab the any matched word characters
           * However, /'\w+'/, which is wrapped by single quote '', will print out any matched word characters that is wrapped by single quote
           */
          const t = log.match(/'\w+'/)[0];
          block.uid = t.replace(/\r/, "");
        } else if(block.uid == 'undefined') {   continue;   }

        continue;
      }


    } // while

      // console.log(blocks);
     

    /**
     * creating a new file using appendFIle.
     * By runnig this file, whatever the file name inputted will be created
     * null ==> filter parameter; but I am not filtering out anything here
     * 2 ==> space parameter; gives 2 second to give space between objects
     */
     fs.appendFile('parsedFile230.log', JSON.stringify((blocks), null, 2), function(err) {
      if(err) throw err;
      console.log('A file is now created using the inputted file name');
       console.log(blocks.length); // 216
    });
    

  });
}

con.connect(function(err) {
  if (err) throw err;

  validateFile(fileName);
});