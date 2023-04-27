/**
 * Copyright (c) 2023 DASverse
 * File: parsing.js
 * Author: Tae Jin Kim
 * IDE    : VSCode
 * DB     : MySQL using workbench
 * Date: April 21 2023
 * Description: - This program reads non-formalized sign up log file and parse successful log 
 *                   Starts with   
 *                              'S ===================== 3001. POST /mpocket/wallet/signup ====================='
 *                            ]
 *                                                              ...
 *                   Ends with   
 *                              'E ===================== 3001. POST /mpocket/wallet/signup ====================='
 *                            ]
 * 
 *              - Successful Log Example: Starts with 'S and ends with 'E
 *                          'S ===================== 3001. POST /mpocket/wallet/signup ====================='
                                ]
                                [2023/04/05 09:49:44.798] [DEBUG] bid [ '5' ]
                                [2023/04/05 09:49:44.798] [DEBUG] uid [ 'M1000178' ]
                                [2023/04/05 09:49:44.798] [DEBUG] sid [ '65fWRXLfy1S2NEqNNksG2K' ]
                                [2023/04/05 09:49:44.798] [DEBUG] first [ '1' ]
                                [2023/04/05 09:49:44.798] [DEBUG] second [ '12' ]
                                [2023/04/05 09:49:44.799] [DEBUG] words [
                                '{"words":["Rwanda","SQL","Adaptive","Assistant","Garden","teal","Pizza","Savings","program","connecting","quantify","Tala"]}'
                                ]
                                [2023/04/05 09:49:44.799] [DEBUG] validator [ '{"words":["Rwanda","Tala"]}' ]
                                [2023/04/05 09:49:44.799] [LOG] splitIp [ '3.35.54.112', ' 172.31.29.18' ]
                                [2023/04/05 09:49:44.806] [LOG] 586
                                [2023/04/05 09:49:44.807] [LOG] BID/UID/WID :  [ '5', 'M1000178', 586 ]
                                [2023/04/05 09:49:48.590] [DEBUG] new account :  [ '0x55A077001C4c8566d6907Ca96E30bac0c3481453' ]
                                [2023/04/05 09:49:48.596] [DEBUG] insert ok  [ '0x55A077001C4c8566d6907Ca96E30bac0c3481453' ]
                                [2023/04/05 09:49:48.596] [LOG] ERC20 Wallet address :  [ '0x55A077001C4c8566d6907Ca96E30bac0c3481453' ]
                                [2023/04/05 09:49:48.603] [DEBUG] { result: 'Y', message: 'Success', code: 0, wid: 586 }
                                [2023/04/05 09:49:48.603] [DEBUG] 3.35.54.112 [
                            'E ===================== 3001. POST  /mpocket/wallet/signup ====================='
                                ]
 *              - Failed Log Example: Starts with 'S, but there is no ending with 'E and starts with 'S again for new log
 *                          'S ===================== 3005. GET /mpocket/wallet/history ====================='
                              ]
                              [2023/04/05 08:43:39.895] [DEBUG] bid [ '5' ]
                              [2023/04/05 08:43:39.895] [DEBUG] wid [ '582' ]
                              [2023/04/05 08:43:39.895] [DEBUG] sid [ 'Dsoxuk27gUn6kQvk7pZt8Z' ]
                              [2023/04/05 08:43:39.895] [DEBUG] symbol [ 'ETH' ]
                              [2023/04/05 08:43:39.896] [DEBUG] from [ '2023-03-29 00:00:00' ]
                              [2023/04/05 08:43:39.896] [DEBUG] to [ '2023-04-05 23:59:59' ]
                              [2023/04/05 08:43:39.896] [LOG] splitIp [ '3.35.54.112', ' 172.31.32.132' ]
                              [2023/04/05 08:43:39.897] [DEBUG] 3.35.54.112 [
                            'S ===================== 3003. GET /mpocket/wallet/asset ====================='
                              ]

 *              - URL that program will search for the start of log file : /mpocket/wallet/        
 *                           
 *              - *** Program only saves successful log into DB ***
 *                  "UID" and "WID" from [BID/UID/WID], "words" (whole list), two words from "validator" will be saved into DB
 *                  - if any of them are missing, it is failure so DO NOT save into DB
 *              
 *              - If [BID/UID/WID] and "new account" is missing, it counts as failure
 *                  EXCEPTION example : 
 *                      1. what if it's successful log and [BID/UID/WID] section is missing? 
 *                          ==> uid, wid, words, validator are all missing  ==> Do not save into DB
 *                            'S ===================== 3001. POST /wallet/ai/signup ====================='
                                ]
                                [2023/02/10 01:29:52.055] [DEBUG] email [ 'M1000001' ]
                                [2023/02/10 01:29:52.056] [DEBUG] bid [ '5' ]
                                [2023/02/10 01:29:52.056] [DEBUG] api [ 'W1KTXAV-B3PMMR0-NBN2K4F-0THATMQ' ]
                                [2023/02/10 01:29:52.057] [DEBUG] 3.35.149.99 [ 'W1KTXAV-B3PMMR0-NBN2K4F-0THATMQ' ]
                                [2023/02/10 01:29:52.057] [DEBUG] sec [ 'e067aeab-58ed-4a60-aaea-299106a2ad52' ]
                                [2023/02/10 01:29:52.058] [DEBUG] signature [ 'd72cbc1e0588f6133f9bebc77bd7b3a1582544f6de1b67e587e562290a376bff' ]
                                [2023/02/10 01:29:52.058] [DEBUG] d72cbc1e0588f6133f9bebc77bd7b3a1582544f6de1b67e587e562290a376bff
                                [2023/02/10 01:29:52.059] [DEBUG] check [ true ]
                                [2023/02/10 01:29:52.071] [LOG] 80
                                [2023/02/10 01:29:52.071] [LOG] reg id :  [ 80 ]
                                [2023/02/10 01:29:54.069] [DEBUG] new account :  [ '0x4C624a78C0c5045073A3D6A18249E6ed93BC1e88' ]
                                [2023/02/10 01:29:54.078] [DEBUG] insert ok  [ '0x4C624a78C0c5045073A3D6A18249E6ed93BC1e88' ]
                                [2023/02/10 01:29:54.079] [LOG] address :  [ '0x4C624a78C0c5045073A3D6A18249E6ed93BC1e88' ]
                                [2023/02/10 01:29:54.081] [DEBUG] 3.35.149.99 [
                              'E ===================== 3001. POST /wallet/ai/signup ====================='
                                ]  
 *              - Program will be synchronous
 * 
 * History:
 * - April 20, 2023: Created the program with basic DB connection and fs for reading log file with some basic regex filtering format to prepare.
 * - April 21, 2023: Program structure is built and analysing the log file data to build up exception handling before building code.
 * 
 * - April 24, 2023: - Rebuilt program structure whereas I set up few flags to check up whether my checklists are checked, I am currently using null array to check whether values are in
 *                   - Deleted multiple methods to one single method, but can be divided to multiple methods.
 *                   - Filtering Start, uid, wid, validator, end are done with small dummy log file since our file is way to big
 * 
 * - April 25, 2023: - Filtering words is done. (All the filtering & gathering is done)
 *                              {
                                  start: "  'S ===================== 3001. POST /mpocket/wallet/signup ====================='",
                                  uid: "'1000008'",
                                  wid: '995',
                                  words: "  'Pants,Credit,Incredible,Comoro,Analyst,copy,Music,Planner,XML,AGP,hacking,Tasty'",
                                  validator: 'Pants,Credit',
                                  end: "  'E ===================== 3001. POST  /mpocket/wallet/signup ====================='"
                                }
 *                   - probably working on exception to handle exception handling.
 *                   - Creating trigger to insert filtered data into DB
 *                   - COULDN'T FIGURE OUT WHY LAVENDER IS NOT GETTING FILTERRED OUT... ( ' won't come out )
 *                       - if I filter "" out from output, it will have error when program puts data into DB
 * 
 * - April 26, 2023: - Filtering words is done: filterNonAlphabetFromWordList function is added and being used in words to make code cleaner.
 *                   - fixed validate error: not accepting anything
 *                      - because words section was catching 'words' before 'validate' and words if statement checks next line, validate's words list couldn't get anything from next line
 *                        So, words if statement is changed from 'words' to 'G] words [' to only catch what belongs to words.
 *                   - For list of words and valiate, some of them were wrapped as array such as [ '{"words":["Pants","Tasty"]}' ], so gave exception
 *                   - There were come values without any values from words section and it was same line as words because they didn't need to go next line.
 *                      exception: did not save word list without values [ '{"words":[""]}' ]
 *                   - Appended succeed blocks to parsedFile.log ==> 216 blocks total 
 * 
 *                   - Problem : blocks.length is 216 and 216 blocks are being saved in file, but 206 values are in DB.
 *                      - File : 216
 *                      - DB   : 206, no duplication of uid, wid, words, validator
 *                      - Not sure : maybe since uid is unique, and IGNORE is being used, it filtered out duplicated uid ??
 *                          -- need to check
 *  - April 27, 2023: - Added process output to see program is actually working since log file is big
 *                    - firstVal and lastVal is added in startPoint
 *                    - Validator : - two words     : checking validator list are two words                                                       ==> 216 to 216, no change
 *                                  - list matching : checking two words of validator list is matching with first and last letter of word list    ==> 216 to 216, 1 change
 *                    - Word      : - Set first letter to firstVal and set last letter to lastVal
 *                                  - 12 length     : Check if the length of word list is 12                                                      ==> 216 to 216, no change
 *                    - WID       : - Had error with getting WID, parsedFile.log ==> has wrong WID,    parsedFIle_v1.log is correct information of WID ==> 216 to 208, reduced
 *                    - parsedFile230.log is only log with uid values in to find if there is any missing inforamtion.
 *                    - Fixed undefined error ==> I thought uid value was 'undefined' but it was ==> '\'undefined\''                              (undefined ==> 'undefined')
 
 */


// import modules program needs
const fs = require('fs');
const mysql = require('mysql');


const fileName = 'metapocket-dev-out.log';
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

    // function filters out the filter out non-alphabetial languages from list. To filter out, we first have to filter out all non-alphabetial format from list
    function filterNonAlphabetFromWordList(t) {
      // console.log("qqqqqqqqq " + t);
      // Trying to filter out non-alphabetial languages from list. To filter out, we first have to filter out all non-alphabetial format from list
      for (let i = 0; i < t.length; i++) {
        block.words = t.join(',');

        // if word is non-alphabetical
        if (!(/^[a-zA-Z]+$/.test(t[i]))) {
          // console.log(!(/^[a-zA-Z]+$/.test(t[i])));
          // console.log(t[i]);
          block.words = null;
          // if program find any non-alphabetical functions, it breaks out the loop because program is not allowing a single non-alphabetical word.
          break;
        }
      }
    }


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
      
      
      process.stdout.write(`  working: ${i}\r`);
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
        continue;
      }
      
      /**  
       * If line has endingPoint('E) with desire url and have all the values in
       * fill up the block.end with value and push the full block into array
       */
      if (log.startsWith(endPoint) && log.includes(url)) {
        // if statement won't get passed if value is null.
        if (block && block.uid && block.wid && block.words && block.validator) {
          block.end = log.replace(/\r/, "");
          // blocks will be inserted into DB
          
          blocks.push(block);
          //console.log(block);
          // con.query(`INSERT IGNORE INTO  parsing.validatelog (uid, wid, words, validator) VALUES (${block.uid}, ${block.wid}, ${block.words}, ${block.validator})`);
          
        }
        // emptying the block so that program can filter and fill up the value
        block = null;
        continue;
      } 
      
      if (block && log.includes('uid')) {
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

      if (block && log.includes('WID')) {
        if (block.wid === null) {
          // this will match one or more number + zero or more whitespace + ]
           const t = log.match(/\d+\s*\]/)[0];
           // by using slice, 987], program is starting outside of starting point 0 to t.length -1 ==> 9 is starting point which is 0 position, 7 is t.length-1 position where it ends
           block.wid = t.slice(0, t.length-1);
        } 
        continue;
      }
      
      // words......
      if (block && log.includes('G] words [')) {
        if (block.words === null) {
          //console.log(log);

          // words [ '{"words" :: filters out values less than 12. If value is 12 words, list of words goes to next time.
          if(!log.includes(' words \[ \'\{\"words\"')) {
              // console.log("hh?");
              // filters and make the block into null if filter out non-alphabetial word is found.
              
              // Because I am using shift() that removes first line and discard, the first element of array is next line of words, which is list of words.
              // For example, array {1,2,3,4} ==> array.shift() ==> while { array{2,3,4}, array[0] = 2   }
              block.words = logs[0].replace(/\r/, "");
              // console.log(block.words);
              // breaks down list of words into word pieces so that I can filter out the non-alphabeltical languages.
              let t = block.words.replace(/  \'/, "").replace(/\'/, "").split(",");
              // words":[
              if(t[0].includes('words\"\:\[')) {
                // console.log("ggg")
                t = JSON.parse(t);
                t = t.words;
              }
              // filters and make the block into null if filter out non-alphabetial word is found.
              filterNonAlphabetFromWordList(t);  
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
      if (block && log.includes('validator')) {
        if (block.validator === null) {
          const validatorStart = log.indexOf('[ ');
          block.validator = log.slice(validatorStart).replace(/\r/, "").replace('[ ', "").replace(' \]', "");
          // console.log(block.validator);
          t = block.validator.replace(/'/g, '').split(",");
          // words":[
          // if value is in array format
          // [2023/03/02 03:00:51.053] [DEBUG] validator [ '{"words":["program","SAS"]}' ]
          if(t[0].includes('words\"\:\[')) {  
            // console.log(t + " dddddddddddddddddddddddddddddddd");
            t = JSON.parse(t);
            t = t.words;
            // console.log(t);
          }
          filterNonAlphabetFromValidator(t);
        } 
        continue;
      }

    } // while

    //  console.log(blocks);
     

     
    /**
     * creating a new file using appendFIle.
     * By runnig this file, whatever the file name inputted will be created
     * null ==> filter parameter; but I am not filtering out anything here
     * 2 ==> space parameter; gives 2 second to give space between objects
     */
     fs.appendFile('parsedFile.log', JSON.stringify((blocks), null, 2), function(err) {
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