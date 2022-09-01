import * as CONST from '../consts';

export enum FruitAge {
  New,
  Growing,
  Unripe,
  Ripe,
  Rotten
}

export class Fruit {
  constructor(x: number, y: number, time: number) {
    this.x = this.startX = x;
    this.y = this.startY = y;
    this.startTime = time;
  }

  x: number;
  y: number;
  startX: number;
  startY: number;
  startTime: number;
  dropTime = 0;
  age = FruitAge.New;
  isDropping = false;
  radius = 10;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRot() {}

  updateState(elapsedTime: number) {
    if (this.isDropping) {
      const time = elapsedTime - this.dropTime;

      this.y = this.startY + CONST.g * time**2;
    }
    else {
      const time = elapsedTime - this.startTime;

      this.age = Math.floor(time / 2000);
      switch (this.age) {
        case FruitAge.New:
          break;
        case FruitAge.Growing:
          this.radius = 30;
          break;
        case FruitAge.Unripe:
          this.radius = 55;
          break;
        case FruitAge.Ripe:
          this.radius = 65;
          break;
        case FruitAge.Rotten:
          this.radius = 40;
          this.drop(elapsedTime);
          //TODO temporary
          this.onRot();
          break;
      }
    }
  }

  drop(time: number) {
    this.isDropping = true;
    this.dropTime = time;
  }
}
