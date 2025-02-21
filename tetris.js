const execSync = require('child_process').execSync;
const fs = require('fs');

// Tetris Game State
let grid = Array(7).fill().map(() => Array(52).fill(0)); // 7 days, 52 weeks
let currentBlock = { shape: 'I', position: [0, 0] }; // Example Block

// Load Game State
if (fs.existsSync('state.json')) {
  const state = JSON.parse(fs.readFileSync('state.json'));
  grid = state.grid;
  currentBlock = state.currentBlock;
}

// Move Block Down
function moveBlockDown() {
  currentBlock.position[1] += 1;
  if (currentBlock.position[1] >= 52) {
    currentBlock.position[1] = 0;
  }
}

// Make Commit for Current Block Position
function makeCommit() {
  const date = new Date();
  date.setDate(date.getDate() - currentBlock.position[1] * 7 - currentBlock.position[0]);
  fs.writeFileSync('tetris.txt', `Block at ${currentBlock.position}\n`);
  execSync('git add .');
  execSync(`git commit --date="${date.toISOString()}" -m "Tetris Block"`);
  execSync('git push');
}

// Update State and Save
moveBlockDown();
makeCommit();
fs.writeFileSync('state.json', JSON.stringify({ grid, currentBlock }));
