import * as CONST from '../consts';

export class Bullet {
  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = this.startX = x;
    this.y = this.startY = y;
    this.vx = vx;
    this.vy = vy;
    this.startTime = performance.now();
  }

  x: number;
  y: number;
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  startTime: number;

  readonly radius = 20;

  updatePosition() {
    const time = performance.now() - this.startTime;

    this.x = this.startX + this.vx * time;
    this.y = this.startY - this.vy * time + CONST.g * time**2;
  }
}
