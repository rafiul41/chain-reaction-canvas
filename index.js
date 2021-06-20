const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Important variables

// Margin of the canvas element
const marginLeft = 0, marginTop = 0;

// Padding of the grid
const paddingLeft = 0, paddingTop = 0;

const gridStart = {
  x: paddingLeft, y: paddingTop
};
const gridHeight = 600, gridWidth = 600;
const row = 6, col = 6;

// Cell will be square
const cellSize = 100;

const dx = [0, 0, 1, -1];
const dy = [1, -1, 0, 0];

const ballCount = {};
let cellsToUpdate = [];

for(let i = 0; i < row; i++) {
  ballCount[i] = {};
  for(let j = 0; j < col; j++) {
    ballCount[i][j] = 0;
  }
}

// Utility functions

function isCorner(r, c) {
  return (r === 0 && c === 0) || (r === 0 && c === col - 1)
    || (r === row - 1 && c === 0) || (r === row - 1 && c === col - 1);
}

function isEdge(r, c) {
  return (r === 0 && c > 0 && c < col - 1) || (r === row - 1 && c > 0 && c < col - 1)
    || (c === 0 && r > 0 && r < row - 1) || (c === col - 1 && r > 0 && r < row - 1);
}

function isValidCell(r, c) {
  return r >= 0 && r < row && c >= 0 && c < col;
}

function shouldExplode(r, c) {
  return !!((isCorner(r, c) && ballCount[r][c] > 1) || (isEdge(r, c) && ballCount[r][c] > 2) || (ballCount[r][c] > 3));

}

function drawLine(start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function drawCircle(center, radius, color) {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

function drawCircleInCell(r, c, color) {
  if(ballCount[r][c] === 1) {
    drawCircle({x: c * cellSize + cellSize / 2, y: r * cellSize + cellSize /  2}, cellSize / 5, color);
  } else if(ballCount[r][c] === 2) {
    drawCircle({x: c * cellSize + cellSize / 2, y: r * cellSize + cellSize /  3}, cellSize / 5, color);
    drawCircle({x: c * cellSize + cellSize / 2, y: r * cellSize + ((2 * cellSize) /  3)}, cellSize / 5, color);
  } else if(ballCount[r][c] === 3) {
    drawCircle({x: c * cellSize + cellSize / 2.8, y: r * cellSize + cellSize /  3}, cellSize / 5, color);
    drawCircle({x: c * cellSize + cellSize / 2.8, y: r * cellSize + ((2 * cellSize) /  3)}, cellSize / 5, color);
    drawCircle({x: c * cellSize + cellSize / 1.5, y: r * cellSize + cellSize /  2}, cellSize / 5, color);
  }
}

function resetCell(r, c) {
  ctx.fillStyle = 'black';
  ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
  ctx.strokeStyle = 'white';
  ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
}

function makeGrid() {
  for(let i = 0; i < row; i++) {
    for(let j = 0; j < col; j++) {
      resetCell(i, j);
    }
  }

  ctx.strokeRect(0, 0, gridWidth, gridHeight);
}

makeGrid();

function renderUpdatedCells() {
  for(let i = 0; i < cellsToUpdate.length; i++) {
    resetCell(cellsToUpdate[i].r, cellsToUpdate[i].c);
    drawCircleInCell(cellsToUpdate[i].r, cellsToUpdate[i].c, 'red');
  }
}

function updateCellsBFS(r, c) {
  const queue = [];
  queue.push({r, c});

  while(queue.length !== 0) {
    let levelNodes = queue.length;

    cellsToUpdate = [];

    for(let k = 0; k < levelNodes; k++) {
      let front = queue[0];
      queue.shift();
      ballCount[front.r][front.c]++;

      if(shouldExplode(front.r, front.c)) {
        ballCount[front.r][front.c] = 0;

        for(let i = 0; i < dx.length; i++) {
          let x = front.r + dx[i];
          let y = front.c + dy[i];

          if(isValidCell(x, y)) {
            queue.push({r: x, c: y});
          }
        }
      }
      cellsToUpdate.push({r: front.r, c: front.c});
    }
    renderUpdatedCells();
  }
}

canvas.addEventListener('click', (e) => {
  const canvasCo = {
    x: e.clientX - (paddingLeft + marginLeft + gridStart.x),
    y: e.clientY - (paddingTop + marginTop + gridStart.y)
  };

  const clickedCol = Math.floor(canvasCo.x / cellSize), clickedRow = Math.floor(canvasCo.y / cellSize);
  console.log(clickedRow, clickedCol);
  if(clickedRow < row && clickedCol < col) {
    updateCellsBFS(clickedRow, clickedCol);
  }
});
