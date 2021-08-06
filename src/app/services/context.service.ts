import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  constructor() {
  }

  resetCell(ctx: CanvasRenderingContext2D, r: number, c: number, cellSize: number) {
    this.blackenCell(ctx, r, c, cellSize);
    this.borderCell(ctx, r, c, cellSize);
  }

  blackenCell(ctx: CanvasRenderingContext2D, r: number, c: number, cellSize: number) {
    ctx.fillStyle = 'black';
    ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
  }

  borderCell(ctx: CanvasRenderingContext2D, r: number, c: number, cellSize: number) {
    ctx.strokeStyle = 'white';
    ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
  }

  drawCircle(ctx: CanvasRenderingContext2D, center: any, radius: number, color: string) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  }
}
