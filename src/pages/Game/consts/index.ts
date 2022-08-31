import { GameState, Loc } from 'pages/Game/types';

export const g = 0.001;
export const CANVAS_BASE_WIDTH = 1920;
export const CANVAS_BASE_HEIGHT = 948;
export const PEW_FADE_TIME = 1000;
export const BUDDY_START_X = 100;
export const BUDDY_START_Y = 400;
export const BULLET_START_X = BUDDY_START_X + 270;
export const BULLET_START_Y = BUDDY_START_Y + 110;
export const BULLET_SPEED_MAX = 2;
export const GAME_TIME = 30_000;
export const FRUITS_LOCS: Loc[] = [
  { x: 1289, y: 146 },
  { x: 1470, y: 241 },
  { x: 1520, y: 364 },
  { x: 1534, y: 566 },
  { x: 1574, y: 743 },
];

export const INITIAL_GAME_STATE: GameState = {
  buddyX: BUDDY_START_X,
  buddyY: BUDDY_START_Y,
  pews: [],
  bullets: [],
  fruits: [],
  score: 0,
  isGameOver: false,
  isPause: true,
  isGameStarted: false,
  debug: false,
  startTime: 0,
  pauseTime: 0,
  elapsedTimeSinceStart: 0,
  fruitGrowthTime: -2000,//Отрицательное значение чтобы первый фрукт вырос сразу
  mouseState: {
    x: 0,
    y: 0,
    isPressed: false,
    pressX: 0,
    pressY: 0
  }
};
