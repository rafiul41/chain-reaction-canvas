const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Important variables
const marginLeft = 0, marginTop = 0;

const gridStart = {
  x: marginLeft, y: marginTop
};
const gridHeight = 600, gridWidth = 600;
const row = 5, col = 5;

// Cell will be square
const cellWidth = 100, cellHeight = 100;

function drawLine(start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function makeGrid() {
  ctx.fillRect(0, 0, gridWidth, gridHeight);

// draw vertical lines
  let start = {
    x: gridStart.x, y: gridStart.y
  };
  let end = {
    x: gridStart.x, y: col * cellWidth
  };

  ctx.strokeStyle = 'white';

  for(let i = 0; i < row + 1; i++) {
    drawLine(start, end);
    start.x += cellWidth;
    end.x += cellWidth;
  }

  // draw horizontal lines
  start = {
    x: gridStart.x, y: gridStart.y
  };

  end = {
    x: row * cellWidth, y: gridStart.y
  };

  for(let i = 0; i < col + 1; i++) {
    drawLine(start, end);
    start.y += cellHeight;
    end.y += cellHeight;
  }
}

makeGrid();
