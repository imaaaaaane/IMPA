const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.jsx') || dirFile.endsWith('.js')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('/Users/Emy/impa/src');

let totalModified = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  content = content.replace(/<img\s+([^>]*?)>/g, (match, p1) => {
    // Skip if already has loading attribute
    if (p1.includes('loading=')) return match;
    
    // Skip logos (usually above the fold)
    if (p1.toLowerCase().includes('logo')) return match;
    
    // Add loading="lazy"
    let newAttrs = 'loading="lazy"';
    
    // Add dummy width and height if missing to prevent CLS
    // We assume 800x600 as a placeholder which works well with object-cover
    if (!p1.includes('width=')) newAttrs += ' width="800"';
    if (!p1.includes('height=')) newAttrs += ' height="600"';

    return `<img ${newAttrs} ${p1}>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    totalModified++;
    console.log(`Modified: ${file}`);
  }
});

console.log(`Total files modified: ${totalModified}`);
