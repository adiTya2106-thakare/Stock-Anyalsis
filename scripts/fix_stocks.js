const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'data', 'stocks.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace : N/A with : null
const updated = content.replace(/:\s*N\/A\s*,/g, ': null,');

fs.writeFileSync(filePath, updated, 'utf8');
console.log('Fixed all unquoted N/A in stocks.js!');
