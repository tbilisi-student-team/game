import { G } from '../consts';

export class Bullet {
  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = this.startX = x;
    this.y = this.startY = y;
    this.vx0 = this.vx = vx;
    this.vy0 = this.vy = vy;
    this.startTime = performance.now();
  }

  x: number;
  y: number;
  vx: number;
  vy: number;
  vx0: number;
  vy0: number;
  startX: number;
  startY: number;
  startTime: number;
  isCollided = false;

  readonly radius = 20;

  updatePosition() {
    if (this.isCollided) {
      return;
    }
    const time = performance.now() - this.startTime;

    this.x = this.startX + this.vx0 * time;
    this.y = this.startY - this.vy0 * time + G * time**2;
    this.vy = this.vy0 - G * time;
  }
}
