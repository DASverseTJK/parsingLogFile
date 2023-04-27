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


    /**  
     * function filters out the filter out non-alphabetial languages from list. To filter out, we first have to filter out all non-alphabetial format from list
     * 
     */
    function filterNonAlphabetFromWordList(t) {
      // console.log("qqqqqqqqq " + t);
      // Trying to filter out non-alphabetial languages from list. To filter out, we first have to filter out all non-alphabetial format from list
      for (let i = 0; i < t.length; i++) {
        block.words = t.join(',');

        // if word is non-alphabetical, break for loop
        if (!(/^[a-zA-Z]+$/.test(t[i]))) {
          // console.log(!(/^[a-zA-Z]+$/.test(t[i])));
          // console.log(t[i]);
          block.words = null;
          // if program find any non-alphabetical functions, it breaks out the loop because program is not allowing a single non-alphabetical word.
          break;
        }
      }
    }

    /**  
     * function filters out the filter out non-alphabetial languages from list. To filter out, we first have to filter out all non-alphabetial format from list
     * 
     */
    function filterNonAlphabetFromValidator(t) {
      // console.log("qqqqqqqqq " + t);
      // Trying to filter out non-alphabetial languages from list. To filter out, we first have to filter out all non-alphabetial format from list
      for (let i = 0; i < t.length; i++) {
        // console.log(block.validator);
        block.validator = t.join(',');

        // if word is non-alphabetical
        if (!(/^[a-zA-Z]+$/.test(t[i]))) {
          // console.log(!(/^[a-zA-Z]+$/.test(t[i])));
          // console.log(t[i]);
          block.validator = null;
          // if program find any non-alphabetical functions, it breaks out the loop because program is not allowing a single non-alphabetical word.
          break;
        }
      }
    }

    let i = 1;
    // execute until file reaches end
    while (logs.length > 0) {  
      
      // checking console that program actually running because the log file is really big.
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      process.stdout.write(`:      working: ${i}\r`);
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      i = i + 1;
      /**  
       * .shift() function removes first element(line in this case) from logs data and return the element.
       * Meaning, it grabs first line of the log code and use it and discard it at the end so that program does not use the previous line
       * Almost same as iterating all the lines of data, but discard at the end
       * ---------------                                                                                   --------------
       * | asdfb sdf   |  ==> shift removes this line, uses, and discards at the end. ==> Transcation ==>  | arwefre er |
       * | arwefre er  |                                                                                   --------------
       * ---------------
       */
     const log = logs.shift();

      /**  
       * If line starts with 'S, which is starting point + has /mpocket/wallet/signup, we know this is the starting point of the block that we have to check
       * Those values are checklist that we have to check
       * Only saves fully checked list of block to save; if there is a single missing information in block, data will not be saved and return empty array
       * Continue is a trigger that stops loop if any of filtering is activated because once we find a single informaiton from line, we do not need to loop through
       */
      if (log.startsWith(startPoint) && log.includes(url)) {
        // creating empty object to start with new block
        block = {};
        block.start = log.replace(/\r/, "");
        block.uid = null;
        block.wid = null;
        block.words = null;
        block.validator = null;
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
        if (block && block.uid && block.wid && block.words && block.validator) {
          block.end = log.replace(/\r/, "");
          // blocks will be inserted into DB
          
          blocks.push(block);
          //console.log(block);
          
          con.query(`INSERT IGNORE INTO  parsing.validatelog (uid, wid, words, validator) VALUES (${block.uid}, ${block.wid}, '${block.words}', '${block.validator}')`);

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
          // console.log(t);
          if(t == '\'undefined\'') {   
            block.uid = null;
            continue;
          } else {
            block.uid = t.replace(/\r/, "");
          }
        }
        
        

        continue;
      }

      else if (block && log.includes('WID')) {
        if (block.wid === null) {
          // this will match one or more number + zero or more whitespace + ]
          // , 117 ]
          // \s* ==> 0 or more space
          // \d+ ==> 1 or more number
          // [1] ==> finding the first occurance of (\d+) // number
          const t = log.match(/,\s*(\d+)\s*\]/)[1];

           block.wid = t;
        } 
        continue;
      }

      // words......
      else if (block && log.includes('G] words [')) {
        if (block.words === null) {
          //console.log(log);
          if(!log.includes(' words \[ \'\{\"words\"')) {
              // console.log("hh?");
              // filters and make the block into null if filter out non-alphabetial word is found.
              
              // Because I am using shift() that removes first line and discard, the first element of array is next line of words, which is list of words.
              // For example, array {1,2,3,4} ==> array.shift() ==> while { array{2,3,4}, array[0] = 2   }
              block.words = logs[0].replace(/\r/, "");
              // console.log(block.words);
              // breaks down list of words into word pieces so that I can filter out the non-alphabeltical languages.
              let t = block.words.replace(/  \'/, "").replace(/\'/, "").split(",");

              if(t[0].includes('words\"\:\[')) {
                // console.log("ggg")
                t = JSON.parse(t);
                t = t.words;
              } 
              // console.log(t.length + " d");
              // Chekcing if the length of words are 12
              if(!(t.length == 12)) { 
                block.words = null; 
                continue;
              }

              // console.log("pass");
              // filters and make the block into null if filter out non-alphabetial word is found.
              filterNonAlphabetFromWordList(t); 
              //console.log(t[0] + " " + t[t.length-1]);
              // console.log("pass22");
              

              // setting up value to compare first and last words with validator later
              firstVal = t[0];
              lastVal = t[t.length-1];
              
              
            }        
          }
          continue;
      }
          
      // console.log(block);
      

      /**
       *   Exception : [2023/03/02 03:13:25.759] [DEBUG] validator [ '{"words":["program","SAS"]}' ]
       *      -- format is different, so it won't print out
       *      -- OG format : [2023/02/27 02:01:47.378] [DEBUG] validator [ 'Drive,override' ] 
       */
      // 왜 안들어오지??? ==> words 필터링 할때 먼저 걸려븜..
      // console.log(block);
      // console.log(log);
      // if(log.startsWith('{')) { log = JSON.parse(log)}
      // console.log("__ " + log);
      else if (block && log.includes('validator')) {
        if (block.validator === null) {
          const validatorStart = log.indexOf('[ ');
          block.validator = log.slice(validatorStart).replace(/\r/, "").replace('[ ', "").replace(' \]', "");
          // console.log(block.validator); // 'indigo,Gambia'
          t = block.validator.replace(/'/g, '').split(",");
          // console.log(t);
          
          // checking whether length of validator is 2 or not
          if(!(t.length == 2)) { 
            block.validator = null;
            continue; 
          }

          if(t[0].includes('words\"\:\[')) {  
            // console.log(t + " dddddddddddddddddddddddddddddddd");
            t = JSON.parse(t);
            t = t.words;
            // console.log(t);
          }
          filterNonAlphabetFromValidator(t);
          // console.log(t[0] + '\n' + t[t.length-1]);

          // checking whether first and last word matches with validator value
          if((!(t[0] == firstVal) || !(t[t.length-1] == lastVal) )) { 
            block.validator = null;
            continue;
           }
        } 
        // console.log(firstVal + "  " + lastVal);
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
     fs.appendFile('parsedFile_v2.log', JSON.stringify((blocks), null, 2), function(err) {
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