const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Important variables
const canvasHeight = 600, canvasWidth = 600;
const row = 5, col = 5;

// Cell will be square
const cellWidth = 100, cellHeight = 100;

function makeLine(start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function makeGrid() {
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

// draw vertical lines
  let start = {
    x: 0, y: 0
  };
  let end = {
    x: 0, y: col * cellWidth
  };

  ctx.strokeStyle = 'white';

  for(let i = 0; i < row + 1; i++) {
    makeLine(start, end);
    start.x += cellWidth;
    end.x += cellWidth;
  }

  // draw horizontal lines
  start = {
    x: 0, y: 0
  };

  end = {
    x: row * cellWidth, y: 0
  };

  for(let i = 0; i < col + 1; i++) {
    makeLine(start, end);
    start.y += cellHeight;
    end.y += cellHeight;
  }
}

makeGrid();
