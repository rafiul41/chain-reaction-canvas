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

const ballCount = {};

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
}

function drawCircleInCell(r, c, color) {
  drawCircle({x: c * cellSize + cellSize / 2, y: r * cellSize + cellSize /  2}, cellSize / 5, color);
  window.requestAnimationFrame(new Function());
}

function makeGrid() {
  ctx.fillRect(0, 0, gridWidth, gridHeight);

// draw vertical lines
  let start = {
    x: gridStart.x, y: gridStart.y
  };
  let end = {
    x: gridStart.x, y: col * cellSize
  };

  ctx.strokeStyle = 'white';

  for(let i = 0; i < row + 1; i++) {
    drawLine(start, end);
    start.x += cellSize;
    end.x += cellSize;
  }

  // draw horizontal lines
  start = {
    x: gridStart.x, y: gridStart.y
  };

  end = {
    x: row * cellSize, y: gridStart.y
  };

  for(let i = 0; i < col + 1; i++) {
    drawLine(start, end);
    start.y += cellSize;
    end.y += cellSize;
  }
}

makeGrid();

canvas.addEventListener('click', (e) => {
  // get row and col number
  // first get the x and y coordinates of the canvas

  const canvasCo = {
    x: e.clientX - (paddingLeft + marginLeft + gridStart.x),
    y: e.clientY - (paddingTop + marginTop + gridStart.y)
  };

  const clickedCol = Math.floor(canvasCo.x / cellSize), clickedRow = Math.floor(canvasCo.y / cellSize);
  console.log(clickedRow, clickedCol);
  if(clickedRow < row && clickedCol < col) {
    drawCircleInCell(clickedRow, clickedCol, 'red');
  }
});
