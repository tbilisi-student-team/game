import { drawCircle } from '../utils/CanvasUtils';
import * as CONST from '../consts';

enum FruitState {
  New,
  Growing,
  Unripe,
  Ripe,
  Rotten
}

export class Fruit {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  x: number;
  y: number;
  startTime = performance.now();
  dropTime = 0;
  state = FruitState.New;
  isDropping = false;

  radius = 10;

  updateState() {
    if (this.isDropping) {
      const time = performance.now() - this.dropTime;

      this.y += CONST.g * time**2;
    }
    else {
      const time = performance.now() - this.startTime;

      this.state = Math.floor(time / 2000);
      if (this.state === FruitState.Rotten) {
        this.drop();
      }
    }
  }

  drop() {
    this.isDropping = true;
    this.dropTime = performance.now();
  }

  draw(ctx: CanvasRenderingContext2D) {
    let fillStyle = '#0f0';

    switch (this.state) {
      case FruitState.New:
        break;
      case FruitState.Growing:
        this.radius = 20;
        break;
      case FruitState.Unripe:
        this.radius = 30;
        fillStyle = '#ff0';
        break;
      case FruitState.Ripe:
        this.radius = 30;
        fillStyle = '#f00';
        break;
      case FruitState.Rotten:
        this.radius = 30;
        fillStyle = '#000';
        break;
    }

    drawCircle(ctx, this.x, this.y, this.radius, { fillStyle });
  }
}
