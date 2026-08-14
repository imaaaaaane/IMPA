const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const assetDirs = [
  path.join(projectRoot, 'public'),
  path.join(projectRoot, 'src', 'assets')
];
const srcDir = path.join(projectRoot, 'src');
const backupDir = path.join(projectRoot, 'unused-assets-backup');

const mediaExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.mp4', '.webm'];
const sourceExtensions = ['.js', '.jsx'];

// Helper to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  let files = [];
  try {
    files = fs.readdirSync(dirPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return arrayOfFiles; // Directory doesn't exist, skip
    }
    console.error(`Error reading directory ${dirPath}:`, err.message);
    return arrayOfFiles;
  }

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

console.log('Scanning for media assets and source code...');

// Get all assets
let allAssets = [];
assetDirs.forEach(dir => {
  const files = getAllFiles(dir);
  const filtered = files.filter(f => mediaExtensions.includes(path.extname(f).toLowerCase()));
  allAssets = allAssets.concat(filtered);
});

// Get all source files
const allSourceFiles = getAllFiles(srcDir).filter(f => sourceExtensions.includes(path.extname(f).toLowerCase()));

// Read all source code into memory for quick searching
let sourceCode = '';
allSourceFiles.forEach(file => {
  sourceCode += fs.readFileSync(file, 'utf8') + '\n';
});

// Check assets against source code
let unusedAssets = [];
allAssets.forEach(assetPath => {
  const fileName = path.basename(assetPath);
  // Simple check: does the filename appear anywhere in the source code?
  if (!sourceCode.includes(fileName)) {
    unusedAssets.push(assetPath);
  }
});

// Move unused assets
let movedCount = 0;
if (unusedAssets.length > 0) {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  console.log('\nMoving unused assets:');
  unusedAssets.forEach(assetPath => {
    let fileName = path.basename(assetPath);
    let destPath = path.join(backupDir, fileName);
    
    // Handle potential filename collisions in the backup directory
    if (fs.existsSync(destPath)) {
        const ext = path.extname(fileName);
        const name = path.basename(fileName, ext);
        destPath = path.join(backupDir, `${name}_${Date.now()}${ext}`);
    }

    try {
      fs.renameSync(assetPath, destPath);
      movedCount++;
      console.log(` -> ${fileName}`);
    } catch (err) {
      console.error(`Failed to move ${assetPath}:`, err.message);
    }
  });
}

console.log(`\n--- Scan Complete ---`);
console.log(`Total media assets found: ${allAssets.length}`);
console.log(`Source files scanned: ${allSourceFiles.length}`);
console.log(`Unused assets moved: ${movedCount}`);
if (movedCount > 0) {
  console.log(`Backup directory: ${backupDir}`);
} else {
  console.log('No unused assets were found!');
}
