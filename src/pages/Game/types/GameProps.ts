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

export type GameState = {
  score: number;
  buddyX: number;
  buddyY: number;
  pews: Pew[],
  bullets: Bullet[],
  fruits: Fruit[],
  isLoading: boolean,
  debug: boolean
}
