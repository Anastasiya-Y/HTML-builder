const path = require('node:path');
const fsPromises = require('node:fs/promises');
const fs = require('node:fs');
const { exit } = require('node:process');

const projectDistDir = path.join(__dirname, 'project-dist');

const htmlTemplate = path.join(__dirname, 'template.html');
const newHtmlPath = path.join(projectDistDir, 'index.html');
const htmlDir = path.join(__dirname, 'components');

const stylesDir = path.join(__dirname, 'styles');
const style = path.join(projectDistDir, 'style.css');

const assetsDir = path.join(__dirname, 'assets');
const assetsNewDir = path.join(projectDistDir, 'assets');

const createHtml = async () => {
  try {
    let template = await fsPromises.readFile(htmlTemplate, 'utf-8');

    const newHtml = await fs.createWriteStream(newHtmlPath);
    const elements = await fsPromises.readdir(htmlDir, { withFileTypes: true });

    const handledContent = elements.map(async (elem) => {
      if (elem.isFile()) {
        const elemCur = path.join(htmlDir, elem.name);

        if (path.extname(elemCur).toLowerCase() === '.html') {
          const elemCont = (await fsPromises.readFile(elemCur, 'utf-8')).trim();
          const elemName = path.basename(elemCur).replace('.html', '');
          template = template.replace(`{{${elemName}}}`, elemCont);
        }
      }
    });

    await Promise.all(handledContent);
    await newHtml.write(template);
  } catch (err) {
    console.log(err.message);
  }
};

const mergeStyles = async () => {
  try {
    const fileCreation = await fsPromises.open(style, 'w');
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

    await fsPromises.appendFile(style, styles);
    exit();
  } catch (err) {
    console.log(err.message);
  }
};

const copyDir = async (dir, newDir) => {
  try {
    const content = await fsPromises.readdir(dir, { withFileTypes: true });
    await fsPromises.mkdir(newDir);

    const handledContent = content.map(async (chunk) => {
      const chunkPath = path.join(dir, chunk.name);
      const chunkNewPath = path.join(newDir, chunk.name);
      if (chunk.isFile()) {
        await fsPromises.copyFile(chunkPath, chunkNewPath);
      } else if (chunk.isDirectory()) {
        copyDir(chunkPath, chunkNewPath);
      }
    });
    await Promise.all(handledContent);
  } catch (err) {
    console.log(err.message);
  }
};

const buildPage = async () => {
  await fsPromises.rm(projectDistDir, { recursive: true, force: true });
  await fsPromises.mkdir(projectDistDir, { recursive: true });

  copyDir(assetsDir, assetsNewDir);
  createHtml();
  mergeStyles();
};

buildPage();
