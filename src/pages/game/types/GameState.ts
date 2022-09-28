import { Bullet, Fruit } from '../models';
import { PewState, MouseState } from './index';

export type GameState = {
  score: number;
  buddyX: number;
  buddyY: number;
  pews: PewState[],
  bullets: Bullet[],
  fruits: Fruit[],
  isGameOver: boolean,
  isPause: boolean,
  isGameStarted: boolean,
  debug: boolean,
  startTime: number,
  pauseTime: number,
  elapsedTimeSinceStart: number,
  fruitGrowthTime: number,
  mouseState: MouseState
}
