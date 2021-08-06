// @ts-ignore
import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import { ContextService } from 'src/app/services/context.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {
  ctx: any;
  transitionCtx: any = {};
  canvas: any = {};
  transitionCanvas: any = {};
  transitionRequest: any = {};

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

  constructor(
    private contextService: ContextService
  ) {
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
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.transitionCanvas = <HTMLCanvasElement>document.getElementById('transition-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.transitionCtx = this.transitionCanvas.getContext('2d');
    this.canvas.onselectstart = () => { return false};
    this.transitionCanvas.onselectionchange = () => {return false};
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
        this.contextService.resetCell(this.ctx, i, j, this.cellSize);
      }
    }
    this.ctx.strokeRect(0, 0, this.gridWidth, this.gridHeight);
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

  drawCircleInCell(r: number, c: number, color: string) {
    if(this.ballCount[r][c] === 1) {
      this.contextService.drawCircle(this.ctx, {x: c * this.cellSize + this.cellSize / 2, y: r * this.cellSize + this.cellSize /  2}, this.cellSize / 5, color);
    } else if(this.ballCount[r][c] === 2) {
      this.contextService.drawCircle(this.ctx, {x: c * this.cellSize + this.cellSize / 2, y: r * this.cellSize + this.cellSize /  3}, this.cellSize / 5, color);
      this.contextService.drawCircle(this.ctx, {x: c * this.cellSize + this.cellSize / 2, y: r * this.cellSize + ((2 * this.cellSize) /  3)}, this.cellSize / 5, color);
    } else if(this.ballCount[r][c] === 3) {
      this.contextService.drawCircle(this.ctx, {x: c * this.cellSize + this.cellSize / 2.8, y: r * this.cellSize + this.cellSize /  3}, this.cellSize / 5, color);
      this.contextService.drawCircle(this.ctx, {x: c * this.cellSize + this.cellSize / 2.8, y: r * this.cellSize + ((2 * this.cellSize) /  3)}, this.cellSize / 5, color);
      this.contextService.drawCircle(this.ctx, {x: c * this.cellSize + this.cellSize / 1.5, y: r * this.cellSize + this.cellSize /  2}, this.cellSize / 5, color);
    }
  }

  renderUpdatedCells() {
    for(let i = 0; i < this.cellsToUpdate.length; i++) {
      this.contextService.resetCell(this.ctx, this.cellsToUpdate[i].r, this.cellsToUpdate[i].c, this.cellSize);
      this.drawCircleInCell(this.cellsToUpdate[i].r, this.cellsToUpdate[i].c, 'red');
    }
  }
  
  renderTransition() {
    if(this.transitions.length === 0) {
      return Promise.resolve();
    }
    let steps = 10;
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        this.transitionCtx.clearRect(0, 0, this.gridWidth, this.gridHeight);
        for(let i = 0; i < this.transitions.length; i++) {
          for(let j  = 0; j < this.transitions[i].to.length; j++) {
            const from = this.transitions[i].from, to = this.transitions[i].to[j];
            const x = from.c === to.c
              ? (from.c * this.cellSize + (this.cellSize / 2))
              : (from.c > to.c ? ((from.c * this.cellSize) + this.cellSize / 2 - steps)
                : ((from.c * this.cellSize) + (this.cellSize / 2 + steps)));
            const y = from.r === to.r
              ? (from.r * this.cellSize + (this.cellSize / 2))
              : (from.r > to.r ? ((from.r * this.cellSize) + this.cellSize / 2 - steps)
                : ((from.r * this.cellSize) + (this.cellSize / 2 + steps)));
            this.contextService.drawCircle(this.transitionCtx, {x, y}, this.cellSize / 5, 'red');
          }
        }
        steps += 10;
        if(steps > this.cellSize) {
          clearInterval(intervalId);
          resolve();
        }
      }, 15);
    });
  }

  async renderTransitions() {
    this.transitionCanvas.style.zIndex = '10';
    await this.renderTransition();
    this.transitionCanvas.style.zIndex = '-1';
  }

  async updateCellsBFS(r: number, c: number) {
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
      await this.renderTransitions();
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
