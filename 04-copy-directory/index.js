const path = require('node:path');
const fsPromises = require('node:fs/promises');

const cleanDir = async (dir) => {
  const files = await fsPromises.readdir(dir);

  if (files) {
    for (const file of files) {
      const filePath = path.join(dir, file);
      await fsPromises.unlink(filePath);
    }
  }
};
const copyDir = async () => {
  try {
    const dir = path.join(__dirname, 'files');
    const newDir = path.join(__dirname, 'files-copy');

    await fsPromises.mkdir(newDir, { recursive: true });
    cleanDir(newDir);

    const files = await fsPromises.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const newFilePath = path.join(newDir, file);
      await fsPromises.copyFile(filePath, newFilePath);
    }
  } catch (err) {
    console.log(err.message);
  }
};

copyDir();
