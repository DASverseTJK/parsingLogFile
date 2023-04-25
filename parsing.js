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
 * - April 25, 2023: - Filtering words is done.
 *                   - probably working on exception to handle exception handling.
 *                   - Creating trigger to insert filtered data into DB
 */


// import modules program needs
const fs = require('fs');
const mysql = require('mysql');


const fileName = 'dum.log';
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

    // execute until file reaches end
    while (logs.length > 0) {
      // .shift() function removes first element(line in this case) from logs data and return the element.
      // Meaning, it grabs first line of the log code and use it and discard it at the end so that program does not use the previous line
      // Almost same as iterating all the lines of data, but discard at the end
      const log = logs.shift();

      /**  
       * If line starts with 'S, which is starting point + has /mpocket/wallet/signup, we know this is the starting point of the block that we have to check
       * Those values are checklist that we have to check
       * Only saves fully checked list of block to save; if there is a single missing information in block, data will not be saved and return empty array
       * Continue is a trigger that stops loop if any of filtering is activated because once we find a single informaiton from line, we do not need to loop through
       * 
       * 
       */
      if (log.startsWith(startPoint) && log.includes(url)) {
        block = {};
        block.start = log;
        block.uid = null;
        block.wid = null;
        block.words = null;
        block.validator = null;
        block.end = null;
        continue;
      }
      
      
      if (block && log.includes('uid')) {
        if (block.uid === null) {
          // this line will print out 2023, because it will grab the any matched word characters
          // block.uid = log.match(/\w+/)[0];
          // however, /'\w+'/, which is wrapped by single quote '', will print out any matched word characters that is wrapped by single quote
          block.uid = log.match(/'\w+'/)[0];
        }
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

                                                            //////////////////////////// START FROM HERE ////////////////////////////////////////////////////
      // should I set a flag and if current line is passed, should I make the flag into true and bring the next line right here to grab the list of the words and print out??
      if (block && log.includes('words')) {
        if (block.words === null) {
          const wordsStart = log.indexOf('words');
          block.words = log.slice(wordsStart);
        }
        continue;
      }

      if (block && log.includes('validator')) {
        if (block.validator === null) {
          const validatorStart = log.indexOf('[ ');
          block.validator = log.slice(validatorStart).replace('\r', "").replace('[ \'', "").replace('\' \]', "");
        }
        continue;
      }

      if (log.startsWith(endPoint) && log.includes(url)) {
        if (block && block.uid && block.wid && block.words && block.validator) {
          block.end = log;
          blocks.push(block);
        }
        block = null;
        continue;
      } 
    }

    console.log(blocks);
  });
}

con.connect(function(err) {
  if (err) throw err;

  validateFile(fileName);
});