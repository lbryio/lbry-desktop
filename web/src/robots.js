const fs = require('fs');
const path = require('path');

let robots;
async function getRobots(ctx) {
  if (!robots) {
    robots = fs.readFileSync(path.join(__dirname, '/../dist/public/robots.txt'), 'utf8');
  }
  return robots;
}

module.exports = { getRobots };
