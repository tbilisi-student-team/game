import { Bullet } from './Bullet';
import { Fruit } from './Fruit';

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
  buddyX: number;
  buddyY: number;
  pews: Pew[],
  bullets: Bullet[],
  fruits: Fruit[]
}
