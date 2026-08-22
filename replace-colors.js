const fs = require('fs');
const path = require('path');

const rules = [
  ['bg-orange-50/50', 'bg-accent/50'],
  ['bg-orange-50/90', 'bg-accent/90'],
  ['bg-orange-500/20', 'bg-primary/20'],
  ['bg-orange-500/90', 'bg-primary/90'],
  ['bg-orange-900/30', 'bg-primary/20'],
  ['bg-orange-900/40', 'bg-primary/30'],
  ['bg-orange-950/20', 'bg-primary/15'],
  ['bg-orange-950/30', 'bg-primary/20'],
  ['from-orange-900/40', 'from-primary/30'],
  ['from-orange-950/20', 'from-primary/15'],
  ['hover:text-orange-600', 'hover:text-primary'],
  ['bg-orange-500', 'bg-primary'],
  ['bg-orange-400', 'bg-primary'],
  ['bg-orange-600', 'bg-primary'],
  ['bg-orange-50', 'bg-primary/5'],
  ['bg-orange-100', 'bg-primary/10'],
  ['text-orange-300', 'text-primary/70'],
  ['text-orange-400', 'text-primary'],
  ['text-orange-500', 'text-primary'],
  ['text-orange-600', 'text-primary'],
  ['text-orange-700', 'text-primary'],
  ['border-orange-200', 'border-primary/30'],
  ['border-orange-500', 'border-primary'],
  ['border-orange-800', 'border-primary/60'],
  ['ring-orange-500', 'ring-primary'],
  ['from-orange-50', 'from-accent'],
  ['from-orange-200', 'from-primary/20'],
  ['from-orange-400', 'from-primary'],
  ['from-orange-500', 'from-primary']
];

const brandingRules = [
  ['Dịch vụ nấu ăn Bảy Nhân', 'AFTER HOURS – MODERN DINING'],
  ['Nhà Hàng 7 Nhân', 'AFTER HOURS'],
  ['7Nhân', 'AFTER HOURS'],
  ['Bảy Nhân', 'AFTER HOURS']
];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const [from, to] of rules) {
    const regex = new RegExp(from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?![a-zA-Z0-9_-])', 'g');
    content = content.replace(regex, to);
  }
  
  for (const [from, to] of brandingRules) {
    const regex = new RegExp(from, 'gi');
    content = content.replace(regex, to);
  }
  
  if (originalContent !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

processDirectory('d:\\AFTERHOURS\\web-7nhan-cooking\\src');
console.log('Done.');
