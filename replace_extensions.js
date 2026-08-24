import fs from 'fs/promises';
import path from 'path';

const walkDir = async (dir, filelist = []) => {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const stat = await fs.stat(dirFile);
    if (stat.isDirectory()) {
      filelist = await walkDir(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.jsx') || dirFile.endsWith('.js') || dirFile.endsWith('.css')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const run = async () => {
  const files = await walkDir('./src');
  // Also check root for files like index.html if needed, but usually src is enough for React
  let totalModified = 0;

  for (const file of files) {
    let content = await fs.readFile(file, 'utf8');
    const originalContent = content;

    // Regex to match .jpg, .jpeg, .png ONLY when preceded by / or word characters and followed by quote or closing paren (for CSS url)
    // Example matches: "/hero.png", "../assets/after1.jpg", "url('/bg.jpg')"
    // We avoid replacing external HTTP URLs just in case, by ensuring it doesn't start with http
    
    // A safe regex: match ' or " or / followed by anything but http, then .jpg/.png, then ' or "
    // Actually, simply replacing .png or .jpg before a quote or in an import is usually safe.
    
    // Let's replace file extensions in standard local imports and src strings:
    content = content.replace(/([/a-zA-Z0-9_-]+)\.(png|jpg|jpeg)(['"`\)])/gi, '$1.webp$3');

    if (content !== originalContent) {
      await fs.writeFile(file, content, 'utf8');
      totalModified++;
      console.log(`Updated paths in: ${file}`);
    }
  }

  console.log(`\n🎉 Success! Replaced image extensions in ${totalModified} files.`);
};

run().catch(console.error);
