const fs = require('node:fs');
const path = require('node:path');

const readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);

readableStream.on('data', (data) => console.log(data));
