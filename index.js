#!/usr/bin/env node

// Detect file changes => Package "chokidar"
// Provide help to users => Package "caporal"
// Execute JS from JS program => Library module "child_process"

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const {spawn} = require('child_process');
const chalk = require('chalk');

program
    .version('0.0.1')
    .argument('[filename]','Name of a file to execute')
    .action(async ({filename}) => {

        const name = filename || 'index.js';

        try {
            await fs.promises.access(name);
            // If the accessibility check is successful, the Promise is resolved with no value.
            // if name doesn't exist, entire function will throw error.
        } catch (err) {
            throw new Error(`Could not find the file ${name}`)
        }

        //: Debounce를 통해서 얼마나 자주 호출할것인지 정할수 있다. 
        let proc;
        const start = debounce(() => {
          if(proc) {
              // Terminate previous execution.
              proc.kill();
          } 
          console.log(chalk.blue('>>>>> Starting process....'));
          proc = spawn('node',[name],{stdio:'inherit'});
          
  
        }, 500);

        chokidar.watch('.')
            .on('add',start)
            //: 추가할 때 or 시작할 때 존재하는 모든 파일에 대해서 작동.
            .on('change',start)
            .on('unlink',start)
            //: 삭제할 때.
    })

program.parse(process.argv);


