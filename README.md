# ParsingLogFile
This program reads non-formalized sign up log file and parse successful log 

# Parsing

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT) 
- Copyright (c) 2023 DASverse
- IDE    : VSCode
- DB     : MySQL using workbench
- Date   : 2023-04-21 ~ 2023-04-28
- Author : Tae Jin Kim


## Description

This program reads non-formalized sign up log file and parse successful log. 
```
     // Starts with   
        'S ===================== 3001. POST /mpocket/wallet/signup ====================='
          ]
          [2023/04/05 09:49:44.798] [DEBUG] bid [ '1' ]
          [2023/04/05 09:49:44.798] [DEBUG] uid [ 'M111111' ] // can be [11111]
          [2023/04/05 09:49:44.798] [DEBUG] sid [ '1adc' ]
          [2023/04/05 09:49:44.798] [DEBUG] first [ '1' ]
          [2023/04/05 09:49:44.798] [DEBUG] second [ '12' ]
          [2023/04/05 09:49:44.799] [DEBUG] words [
          '{"words":["a","ab","ABc","adfe","adsdad","fsadf","sds","ger","aaa","aqwe","yrtu","zxc"]}'
          ]
          [2023/04/05 09:49:44.799] [DEBUG] validator [ '{"words":["a","zxc"]}' ]
          [2023/04/05 09:49:44.799] [LOG] splitIp [ '1.1.1.1', ' 1.1.1.1' ]
          [2023/04/05 09:49:44.806] [LOG] 12345
          [2023/04/05 09:49:44.807] [LOG] BID/UID/WID :  [ '1', 'M111111', 12345 ]
          [2023/04/05 09:49:48.590] [DEBUG] new account :  [ '0x123abc123abc1234cvbs' ]
          [2023/04/05 09:49:48.596] [DEBUG] insert ok  [ '0x12345678990qwertyuiop' ]
          [2023/04/05 09:49:48.596] [LOG] ERC20 Wallet address :  [ '0x2345678oiuytre' ]
          [2023/04/05 09:49:48.603] [DEBUG] { result: 'Y', message: 'Success', code: 0, wid: 12345 }
          [2023/04/05 09:49:48.603] [DEBUG] 1.1.1.1 [
      // Ends with   
        'E ===================== 3001. POST /mpocket/wallet/signup ====================='
          ]
              // - Successful Log Example: Starts with 'S and ends with 'E
```

- parsing.js<br /> 
  - (Full) Async : save data as while loop runs
  - latest version that contains all you need.
  - Back up + running file after testing code
- db_dums.js<br />
  - The file that will be tested and written on as I write code.
  - Everything happens here until testing is done and ready to push code to parsing.js
- read.js
  - Sync : blocks [] Array (draft 1 version)
  - Purpose of this file was grabbing all the blocks only within uid so that I can compare which uid is duplicated since number of my blocks and DB are different
  - aka. this is grabage file for QA for myself to figure out more about log info
- tester.js
  - (half)Async : saves at the end of while
  - Grabage file to test out small parts before I edit my OG code.

- Log files are not provided but successful format is provided above with random dummy data I manually put in
<br /><br />

- Parsing flowchart
![Metapocket_log_file_flowchart drawio (16)](https://user-images.githubusercontent.com/131336470/235111221-4a4da42b-a23f-4ea1-845e-e8fbe29d454d.png)



## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation

To install the necessary dependencies, run the following command:


## Usage
- To run program
```
$ node parsing.js
```
- MySQL Query
 -Creating Tables
```
CREATE TABLE `validatelog` (
  `uid` varchar(200) NOT NULL,
  `wid` int DEFAULT NULL,
  `words` varchar(1000) DEFAULT NULL,
  `validator` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid_UNIQUE` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```


-- Since DB do not allow duplication, running both line at a time will clear out all DB and returns 0 rows in DB
```
delete from validatelog where wid > 0 and uid > '0';
select * from validatelog;
```

-- Return how much rows the DB has
```
select COUNT(*) from validatelog;
```

-- checking duplication
```
SELECT validator FROM validatelog GROUP BY uid HAVING COUNT(*) > 1;
```

## License

This project is licensed under the [MIT license](https://opensource.org/licenses/MIT).



## Contributing

Purpose of this repo is for person use for future work.

## Tests

To run tests, run the following command:
```
$ 
```

## Questions

If you have any questions about this project, please feel free to contact the project owner at [tjmax0930@gmail.com].


