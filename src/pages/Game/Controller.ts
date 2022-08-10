import { GameState } from './types';
import * as CONST from './consts';
import { checkLoadCompete } from './utils/drawFrame';

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
}
