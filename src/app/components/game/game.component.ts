import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {
  ctx: any;

  // Margin of the canvas element
  marginLeft = 0;
  marginTop = 0;

  gridStart: any = {};

  gridHeight = 0;
  gridWidth = 0;
  row = 6;
  col = 6;

  // Cell will be square
  cellSize = 100;

  dx = [0, 0, 1, -1];
  dy = [1, -1, 0, 0];

  ballCount: any = {};
  cellsToUpdate: any = [];
  transitions: any = [];

  constructor() {
  }

  ngOnInit() {
    this.setGridSize();
    this.gridStart = {
      x: 0, y: 0
    };
    for(let i = 0; i < this.row; i++) {
      this.ballCount[i] = {};
      for(let j = 0; j < this.col; j++) {
        this.ballCount[i][j] = 0;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResizeWindow() {
    const canvasWrapper = <HTMLElement>document.getElementById('canvases-wrapper');
    this.gridStart.x = canvasWrapper.getBoundingClientRect().left;
    this.gridStart.y = canvasWrapper.getBoundingClientRect().top;
  }

  ngAfterViewInit() {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    canvas.onselectstart = () => { return false};
    this.initCanvasses();
    const canvasWrapper = <HTMLElement>document.getElementById('canvases-wrapper');
    canvasWrapper.style.marginLeft = `-${this.gridWidth}px`;
    this.onResizeWindow();
  }

  setGridSize() {
    this.gridWidth = this.cellSize * this.col;
    this.gridHeight = this.cellSize * this.row;
  }

  initCanvasses() {
    for(let i = 0; i < this.row; i++) {
      for(let j = 0; j < this.col; j++) {
        this.resetCell(i, j);
      }
    }

    this.ctx.strokeRect(0, 0, this.gridWidth, this.gridHeight);
  }

  blackenCell(r: number, c: number) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
  }

  borderCell(r: number, c: number) {
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
  }

  resetCell(r: number, c: number) {
    this.blackenCell(r, c);
    this.borderCell(r, c);
  }

  isCorner(r: number, c: number) {
    return (r === 0 && c === 0) || (r === 0 && c === this.col - 1)
      || (r === this.row - 1 && c === 0) || (r === this.row - 1 && c === this.col - 1);
  }

  isEdge(r: number, c: number) {
    return (r === 0 && c > 0 && c < this.col - 1) || (r === this.row - 1 && c > 0 && c < this.col - 1)
      || (c === 0 && r > 0 && r < this.row - 1) || (c === this.col - 1 && r > 0 && r < this.row - 1);
  }

  isValidCell(r: number, c: number) {
    return r >= 0 && r < this.row && c >= 0 && c < this.col;
  }

  shouldExplode(r: number, c: number) {
    return ((this.isCorner(r, c) && this.ballCount[r][c] > 1) || (this.isEdge(r, c) && this.ballCount[r][c] > 2) || (this.ballCount[r][c] > 3));
  }

  drawCircle(center: any, radius: number, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawCircleInCell(r: number, c: number, color: string) {
    if(this.ballCount[r][c] === 1) {
      this.drawCircle({x: c * this.cellSize + this.cellSize / 2, y: r * this.cellSize + this.cellSize /  2}, this.cellSize / 5, color);
    } else if(this.ballCount[r][c] === 2) {
      this.drawCircle({x: c * this.cellSize + this.cellSize / 2, y: r * this.cellSize + this.cellSize /  3}, this.cellSize / 5, color);
      this.drawCircle({x: c * this.cellSize + this.cellSize / 2, y: r * this.cellSize + ((2 * this.cellSize) /  3)}, this.cellSize / 5, color);
    } else if(this.ballCount[r][c] === 3) {
      this.drawCircle({x: c * this.cellSize + this.cellSize / 2.8, y: r * this.cellSize + this.cellSize /  3}, this.cellSize / 5, color);
      this.drawCircle({x: c * this.cellSize + this.cellSize / 2.8, y: r * this.cellSize + ((2 * this.cellSize) /  3)}, this.cellSize / 5, color);
      this.drawCircle({x: c * this.cellSize + this.cellSize / 1.5, y: r * this.cellSize + this.cellSize /  2}, this.cellSize / 5, color);
    }
  }

  renderUpdatedCells() {
    for(let i = 0; i < this.cellsToUpdate.length; i++) {
      this.resetCell(this.cellsToUpdate[i].r, this.cellsToUpdate[i].c);
      this.drawCircleInCell(this.cellsToUpdate[i].r, this.cellsToUpdate[i].c, 'red');
    }
  }

  updateCellsBFS(r: number, c: number) {
    const queue = [];
    queue.push({r, c});

    while(queue.length !== 0) {
      let levelNodes = queue.length;

      this.cellsToUpdate = [];
      this.transitions = [];

      for(let k = 0; k < levelNodes; k++) {
        let front: any = queue[0];
        queue.shift();
        this.ballCount[front.r][front.c]++;

        if(this.shouldExplode(front.r, front.c)) {
          let transition: any = {from: {r: front.r, c: front.c}, to: []};
          this.ballCount[front.r][front.c] = 0;

          for(let i = 0; i < this.dx.length; i++) {
            let x = front.r + this.dx[i];
            let y = front.c + this.dy[i];

            if(this.isValidCell(x, y)) {
              transition.to.push({r: x, c: y});
              queue.push({r: x, c: y});
            }
          }
          this.transitions.push(transition);
        }
        this.cellsToUpdate.push({r: front.r, c: front.c});
      }
      this.renderUpdatedCells();
      // renderTransitions();
    }
  }

  onCellClick(e: any) {
    const canvasCo = {
      x: e.clientX - (this.marginLeft + this.gridStart.x),
      y: e.clientY - (this.marginTop + this.gridStart.y)
    };

    const clickedCol = Math.floor(canvasCo.x / this.cellSize), clickedRow = Math.floor(canvasCo.y / this.cellSize);
    console.log('CLICKED ROW COL:', clickedRow, clickedCol);
    if(clickedRow < this.row && clickedCol < this.col) {
      this.updateCellsBFS(clickedRow, clickedCol);
    }
  }
}
