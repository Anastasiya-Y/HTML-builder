const path = require('node:path');
const fsPromises = require('node:fs/promises');
const { exit } = require('node:process');

const projectDistDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const bundle = path.join(projectDistDir, 'bundle.css');

const mergeStyles = async () => {
  try {
    const fileCreation = await fsPromises.open(bundle, 'w');
    await fileCreation.close();

    const stylesArr = [];

    const files = await fsPromises.readdir(stylesDir, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const fileTarget = path.join(stylesDir, file.name);

        if (path.extname(fileTarget).toLowerCase() === '.css') {
          const style = await fsPromises.readFile(fileTarget, 'utf-8');
          stylesArr.push(style);
        }
      }
    }
    const styles = stylesArr.join('\n');

    await fsPromises.appendFile(bundle, styles);
    exit();
  } catch (err) {
    console.log(err.message);
  }
};

mergeStyles();
