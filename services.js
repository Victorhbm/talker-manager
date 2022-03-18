const fs = require('fs').promises;

async function readAFile(fileName) {
  const data = await fs.readFile(fileName, 'utf-8');
  return JSON.parse(data);
}

function writeAFile(fileName, data) {
  return fs.writeFile(fileName, JSON.stringify(data));
}

function generateRandomString(size) {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i += 1) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

module.exports = { readAFile, writeAFile, generateRandomString };
