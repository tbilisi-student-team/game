export type GameProps = {
  width?: number;
  height?: number;
}

export type Pew = {
  startTime: number;
  x: number;
  y: number;
}

export type Bullet = {
  startTime: number;
  vx: number;
  vy: number;
}

export type GameVars = {
  buddyX: number;
  buddyY: number;
  pews: Pew[],
  bullets: Bullet[]
}
