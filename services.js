const fs = require('fs').promises;

async function readAFile(fileName) {
  const data = await fs.readFile(fileName, 'utf-8');
  return JSON.parse(data);
}

function writeAFile(fileName, data) {
  return fs.writeFile(fileName, JSON.stringify(data));
}

module.exports = { readAFile, writeAFile };
