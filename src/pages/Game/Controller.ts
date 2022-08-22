import { GameState } from './types';
import * as CONST from './consts';
import { checkLoadCompete } from './Drawer';
import { Bullet, Fruit } from './models';

export default class Controller {
  constructor(state: GameState) {
    this.state = state;
  }

  readonly state: GameState;

  updateState() {
    if (this.state.isLoading) {
      this.state.isLoading = !checkLoadCompete();
      if (!this.state.isLoading) {
        this.state.startTime = performance.now();
      }
      return;
    }
    if (this.state.isGameOver) {
      return;
    }
    if (performance.now() - this.state.startTime > CONST.GAME_TIME) {
      this.state.isGameOver = true;
      //TODO emit event
      return;
    }
    this.state.fruits.forEach(function (fruit) {
      fruit.updateState();
    });
    this.state.bullets.forEach(function (bullet) {
      bullet.updatePosition();
    });
    this.state.pews = this.state.pews.filter((pew) => ((performance.now() - pew.startTime) <= CONST.PEW_FADE_TIME));
    this.state.bullets = this.state.bullets.filter(
      (bullet) => !bullet.isCollided && bullet.x < CONST.CANVAS_BASE_WIDTH && bullet.y < CONST.CANVAS_BASE_HEIGHT
    );
    this.state.fruits = this.state.fruits.filter(
      (fruit) => fruit.y < CONST.CANVAS_BASE_HEIGHT
    );
    //TODO bullet может быть только 1?
    for (const bullet of this.state.bullets) {
      for (const fruit of this.state.fruits) {
        if (!fruit.isDropping && Controller.checkIntersection(bullet, fruit)) {
          this.state.score += fruit.age;
          fruit.drop();
          bullet.isCollided = true;
          break;
        }
      }
    }
  }

  pew(dx: number, dy: number) {
    this.state.pews.push({
      x: 200 + Math.random() * 200,
      y: CONST.BUDDY_START_Y - 300 + Math.random() * 200,
      startTime: performance.now(),
    });
    this.state.bullets.push(new Bullet(
      CONST.BULLET_START_X, CONST.BULLET_START_Y,
      Math.min(dx / 100, CONST.BULLET_SPEED_MAX), -Math.min(dy / 100, CONST.BULLET_SPEED_MAX)));
  }

  static checkIntersection(bullet: Bullet, fruit: Fruit) {
    const fruitCenterY = fruit.y + fruit.radius;//фрукт висит на черенке
    const distance = Math.sqrt((bullet.x - fruit.x)**2 + (bullet.y - fruitCenterY)**2);

    return distance <= (bullet.radius + fruit.radius);
  }
}
