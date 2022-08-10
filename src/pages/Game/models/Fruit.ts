import * as CONST from '../consts';

export enum FruitAge {
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
  age = FruitAge.New;
  isDropping = false;
  radius = 10;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRot() {}

  updateState() {
    if (this.isDropping) {
      const time = performance.now() - this.dropTime;

      this.y += CONST.g * time**2;
    }
    else {
      const time = performance.now() - this.startTime;

      this.age = Math.floor(time / 2000);
      switch (this.age) {
        case FruitAge.New:
          break;
        case FruitAge.Growing:
          this.radius = 20;
          break;
        case FruitAge.Unripe:
          this.radius = 30;
          break;
        case FruitAge.Ripe:
          this.radius = 30;
          break;
        case FruitAge.Rotten:
          this.radius = 30;
          this.drop();
          //TODO temporary
          this.onRot();
          break;
      }
    }
  }

  drop() {
    this.isDropping = true;
    this.dropTime = performance.now();
  }
}
