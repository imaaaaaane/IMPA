const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const assetDirs = [
  path.join(projectRoot, 'public'),
  path.join(projectRoot, 'src', 'assets')
];
const srcDir = path.join(projectRoot, 'src');

const mediaExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.mp4', '.webm'];
const sourceExtensions = ['.js', '.jsx', '.css'];

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

// Check assets against source code and delete if unused
let deletedCount = 0;
let deletedFiles = [];

console.log('\nDeleting unused assets:');
allAssets.forEach(assetPath => {
  const fileName = path.basename(assetPath);
  
  // Check if the exact filename appears anywhere in the source code
  if (!sourceCode.includes(fileName)) {
    try {
      fs.unlinkSync(assetPath);
      deletedCount++;
      deletedFiles.push(fileName);
      console.log(`[DELETED] - ${fileName}`);
    } catch (err) {
      console.error(`Failed to delete ${assetPath}:`, err.message);
    }
  }
});

console.log(`\n--- Cleanup Complete ---`);
console.log(`Total media assets found initially: ${allAssets.length}`);
console.log(`Source files scanned: ${allSourceFiles.length}`);
console.log(`Total assets permanently deleted: ${deletedCount}`);
