import fs from 'fs';
import path from 'path';

const projectDir = './'; // директория проекта
const outputFile = 'project.txt'; // название итогового файла
const scriptFile = path.basename(new URL(import.meta.url).pathname); // имя текущего скрипта

// папки, которые исключаем
const ignoreDirs = [
  'node_modules',
  'dist',
  '.git',
  '.angular',
  '.vscode',
  '.nx',
];

// разрешённые расширения
const allowedExt = ['.ts', '.js', '.html', '.less', '.css'];

// строим красивое дерево
function buildTree(dir, prefix = '') {
  const entries = fs
    .readdirSync(dir)
    .filter((f) => !ignoreDirs.includes(f))
    .map((f) => ({
      name: f,
      path: path.join(dir, f),
      stat: fs.statSync(path.join(dir, f)),
    }));

  let tree = '';

  entries.forEach((entry, index) => {
    const connector = index === entries.length - 1 ? '└── ' : '├── ';
    if (entry.stat.isDirectory()) {
      tree += `${prefix}${connector}${entry.name}\n`;
      const newPrefix =
        prefix + (index === entries.length - 1 ? '    ' : '│   ');
      tree += buildTree(entry.path, newPrefix);
    } else {
      const ext = path.extname(entry.name);
      if (allowedExt.includes(ext) && entry.name !== scriptFile) {
        tree += `${prefix}${connector}${entry.name}\n`;
      }
    }
  });

  return tree;
}

// рекурсивный сбор файлов
function collectFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        collectFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (allowedExt.includes(ext) && path.basename(filePath) !== scriptFile) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

function packProject() {
  const outStream = fs.createWriteStream(outputFile, { flags: 'w' });

  // сначала дерево проекта
  outStream.write('=== PROJECT STRUCTURE ===\n');
  outStream.write(buildTree(projectDir) + '\n');

  // потом файлы
  const allFiles = collectFiles(projectDir);
  for (const file of allFiles) {
    const relPath = path.relative(projectDir, file);
    const content = fs.readFileSync(file, 'utf8');

    outStream.write(`=== FILE: ${relPath} ===\n`);
    outStream.write(content + '\n\n');
  }

  outStream.end();
  console.log(`✅ Проект собран в файл ${outputFile}`);
}

packProject();
