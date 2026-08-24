import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

// Directories where your images are stored
const DIRS = ['./public', './src/assets'];

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  // Target only PNGs and JPGs
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    const newFilePath = filePath.replace(new RegExp(`${ext}$`, 'i'), '.webp');

    let instance = image;
    
    // Resize if width > 1920px to prevent massively oversized images
    if (metadata.width && metadata.width > 1920) {
      instance = instance.resize({ width: 1920, withoutEnlargement: true });
    }

    // Convert to webp format at 75% quality
    await instance
      .webp({ quality: 75 })
      .toFile(newFilePath);

    console.log(`✅ Converted & Optimized: ${filePath} -> ${newFilePath}`);
    
    // Uncomment the next line if you want the script to automatically delete the original heavy images after conversion
    // await fs.unlink(filePath); 

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

async function walkDir(dir) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        await walkDir(fullPath);
      } else {
        await processFile(fullPath);
      }
    }
  } catch (err) {
    // Ignore directories that don't exist just in case
    if (err.code !== 'ENOENT') {
      console.error(`Error reading directory ${dir}:`, err.message);
    }
  }
}

async function run() {
  console.log('Starting image compression...');
  for (const dir of DIRS) {
    await walkDir(dir);
  }
  console.log('🎉 Compression complete!');
  console.log('👉 Remember to update your .jsx and .css files to point to the new .webp extensions!');
}

run();
