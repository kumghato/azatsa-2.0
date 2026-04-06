const fs = require('fs');

// Read the data file
const data = fs.readFileSync('src/data.ts', 'utf8');

// Extract the array content
const start = data.indexOf('export const dictionaryData = [');
const end = data.lastIndexOf('];');
const arrayContent = data.substring(start + 'export const dictionaryData = ['.length, end);

// Parse the array (this is tricky because it's not valid JSON, but we can eval it or use a parser)
const arrayString = '[' + arrayContent + ']';

// Use eval to parse (be careful)
let dictionaryData;
try {
  dictionaryData = eval(arrayString);
} catch (e) {
  console.error('Error parsing array:', e);
  process.exit(1);
}

// Find and remove duplicate id 99
const index99 = dictionaryData.findIndex(item => item.id === 99);
if (index99 !== -1) {
  dictionaryData.splice(index99, 1);
}

// Re-sequence ids starting from 99
dictionaryData.forEach((item, index) => {
  item.id = index + 1;
});

// Generate new content
const newArrayContent = dictionaryData.map(item => {
  return `  {
    id: ${item.id},
    sumi: "${item.sumi}",
    meaning: "${item.meaning.replace(/"/g, '\\"')}",
    english: "${item.english.replace(/"/g, '\\"')}",
  }`;
}).join(',\n');

const newData = data.substring(0, start) + 'export const dictionaryData = [\n' + newArrayContent + '\n];';

// Write back
fs.writeFileSync('src/data.ts', newData);

console.log('Fixed duplicates and re-sequenced ids.');