import { Bullet } from '../models/Bullet';
import { Fruit } from '../models/Fruit';

export type GameProps = {
  width?: number;
  height?: number;
}

export type Pew = {
  startTime: number;
  x: number;
  y: number;
}

export type MouseState = {
  x: number,
  y: number,
  isPressed: boolean,
  pressX: number,
  pressY: number,
}

export type GameState = {
  score: number;
  buddyX: number;
  buddyY: number;
  pews: Pew[],
  bullets: Bullet[],
  fruits: Fruit[],
  isGameOver: boolean,
  isPause: boolean,
  isGameStarted: boolean,
  debug: boolean,
  startTime: number,
  pauseTime: number,
  elapsedTimeSinceStart: number,
  mouseState: MouseState
}
