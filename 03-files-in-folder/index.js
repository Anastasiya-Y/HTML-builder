const path = require('node:path');
const fsPromises = require('node:fs/promises');

const pathToDir = path.join(__dirname, 'secret-folder');

const getFilesInfo = async () => {
  try {
    const files = await fsPromises.readdir(pathToDir, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const fileTarget = path.join(pathToDir, file.name);

        const fileInfo = path.parse(fileTarget);
        const fileStats = await fsPromises.stat(fileTarget);

        const fileName = fileInfo.name;
        const fileExtension = fileInfo.ext.replace('.', '');
        const fileSize = (fileStats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

getFilesInfo();
