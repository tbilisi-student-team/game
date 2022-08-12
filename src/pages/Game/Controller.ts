import { GameState } from './types';
import * as CONST from './consts';
import { checkLoadCompete } from './utils/drawFrame';
import { Bullet, Fruit } from 'pages/Game/models';

export function updateState(state: GameState) {
  if (state.isLoading) {
    state.isLoading = !checkLoadCompete();
    return;
  }
  state.fruits.forEach(function (fruit) {
    fruit.updateState();
  });
  state.bullets.forEach(function (bullet) {
    bullet.updatePosition();
  });
  state.pews = state.pews.filter((pew) => ((performance.now() - pew.startTime) <= CONST.PEW_FADE_TIME));
  state.bullets = state.bullets.filter(
    (bullet) => bullet.x < CONST.CANVAS_BASE_WIDTH && bullet.y < CONST.CANVAS_BASE_HEIGHT
  );
  state.fruits = state.fruits.filter(
    (fruit) => fruit.y < CONST.CANVAS_BASE_HEIGHT
  );
  //TODO bullet может быть только 1?
  for (const bullet of state.bullets) {
    for (const fruit of state.fruits) {
      if (!fruit.isDropping && checkIntersection(bullet, fruit)) {
        state.score += (fruit.age > 1 ? fruit.age - 1 : 0);
        fruit.drop();
        // TODO setBulletState drawCircle(ctx, bullet.x, bullet.y, bullet.radius, { fillStyle: '#fff' });
        // state.bullets.splice(b, 1);
        break;
      }
    }
  }
}

export function pew(state: GameState, dx: number, dy: number) {
  state.pews.push({
    x: 200 + Math.random() * 200,
    y: CONST.BUDDY_START_Y - 300 + Math.random() * 200,
    startTime: performance.now(),
  });
  state.bullets.push(new Bullet(CONST.BULLET_START_X, CONST.BULLET_START_Y, dx / 100, -dy / 100));
}

function checkIntersection(bullet: Bullet, fruit: Fruit) {
  const fruitCenterY = fruit.y + fruit.radius;//фрукт висит на черенке
  const distance = Math.sqrt((bullet.x - fruit.x)**2 + (bullet.y - fruitCenterY)**2);

  return distance <= (bullet.radius + fruit.radius);
}
