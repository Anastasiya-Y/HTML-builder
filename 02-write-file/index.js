const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');
const { stdin, stdout, exit } = require('node:process');

const pathToFile = path.join(__dirname, 'text.txt');
const textFile = fs.createWriteStream(pathToFile);

const rl = readline.createInterface(stdin, stdout);

stdout.write('Please write something:\n');

const closeTask = () => {
  stdout.write('\nGoodbye!');
  exit();
};

rl.on('line', (data) => {
  if (data.trim().toLowerCase() === 'exit') {
    closeTask();
  } else {
    textFile.write(data);
  }
});

rl.on('SIGINT', () => closeTask());
