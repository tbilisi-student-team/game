import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import useInterval from './hooks/useInterval';
import { GameProps, GameState, Loc } from './types';
import { Bullet, Fruit } from './models';
import { updateState } from './Controller';
import { drawFrame } from './utils/drawFrame';
import * as CONST from './consts';

const BUDDY_START_X = 100;
const BUDDY_START_Y = 400;
const BULLET_START_X = BUDDY_START_X + 270;
const BULLET_START_Y = BUDDY_START_Y + 110;

const FRUITS_LOCS: Loc[] = [
  { x: 1289, y: 146 },
  { x: 1470, y: 241 },
  { x: 1520, y: 364 },
  { x: 1534, y: 566 },
  { x: 1574, y: 743 },
];

const INITIAL_STATE: GameState = {
  buddyX: BUDDY_START_X,
  buddyY: BUDDY_START_Y,
  pews: [],
  bullets: [],
  fruits: [],
  score: 0,
  isLoading: true
};

export function Game (props: GameProps) {
  console.log('Game init');

  const stateRef = useRef<GameState>(INITIAL_STATE);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafIdRef = useRef(0);
  const drawCountRef = useRef(0);

  const [ isPaused, setPaused ] = useState(false);

  const onKeyDown = useCallback(function onKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      pew(100, -100);
    }
    else if (e.key === 'p') {
      setPaused(!isPaused);
    }
  }, [ isPaused ]);

  const mouseStateRef = useRef({
    x: 0,
    y: 0,
    isPressed: false,
    pressX: 0,
    pressY: 0
  });

  const onMouse = useCallback(function (e: MouseEvent) {
    switch (e.type) {
      case 'mousemove':
        mouseStateRef.current.x = e.clientX;
        mouseStateRef.current.y = e.clientY;
        break;
      case 'mousedown':
        mouseStateRef.current.pressX = e.clientX;
        mouseStateRef.current.pressY = e.clientY;
        mouseStateRef.current.isPressed = true;
        break;
      case 'mouseup':
        mouseStateRef.current.isPressed = false;
        pew(mouseStateRef.current.pressX - e.x, mouseStateRef.current.pressY - e.y);
        break;
    }
  }, [])

  function pew(dx: number, dy: number) {
    stateRef.current.pews.push({
      x: 200 + Math.random()*200,
      y: BUDDY_START_Y - 300 + Math.random()*200,
      startTime: performance.now(),
    });
    stateRef.current.bullets.push(new Bullet(BULLET_START_X, BULLET_START_Y, dx/100, -dy/100));
  }

  useLayoutEffect(function addListeners() {
    const canvas = canvasRef.current;

    document.addEventListener('keydown', onKeyDown);
    canvas?.addEventListener('mousedown', onMouse);
    canvas?.addEventListener('mousemove', onMouse);
    canvas?.addEventListener('mouseup', onMouse);

    return function () {
      document.removeEventListener('keydown', onKeyDown);
      canvas?.removeEventListener('mousedown', onMouse);
      canvas?.removeEventListener('mousemove', onMouse);
      canvas?.removeEventListener('mouseup', onMouse);
    }
  }, [])


  useLayoutEffect(function mainLayoutEffect() {
    console.log('mainLayoutEffect');

    if (!isPaused) {
      onAnimationFrame();
    }

    return function() {
      cancelAnimationFrame(rafIdRef.current);
    }
  }, [ isPaused ]);

  useInterval(() => {
    //TODO пока первый падает, второй может уже расти?
    if (stateRef.current.isLoading || stateRef.current.fruits.length >= FRUITS_LOCS.length) {
      return;
    }
    for (const loc of FRUITS_LOCS) {
      if (!stateRef.current.fruits.find((fruit) => fruit.x === loc.x && fruit.y === loc.y)) {
        const fruit = new Fruit(loc.x, loc.y);

        fruit.onRot = function() {
          stateRef.current.score -= 1;
        };
        stateRef.current.fruits.push(fruit);
        break;
      }
    }
  }, 2000);

  function onAnimationFrame() {
    const state = stateRef.current;

    updateState(state);

    const ctx = canvasRef.current?.getContext('2d');

    if (ctx) {
      drawFrame(ctx, state);

      drawDebugInfo(ctx,
        `mouseX: ${mouseStateRef.current.x}, mouseY: ${mouseStateRef.current.y}, ${drawCountRef.current++}`);
    }

    rafIdRef.current = requestAnimationFrame(onAnimationFrame);
  }

  let canvasWidth = props.width || visualViewport.width;
  let canvasHeight = props.height || visualViewport.height;
  const currentAspect = canvasWidth / canvasHeight;
  const desiredAspect = CONST.CANVAS_BASE_WIDTH / CONST.CANVAS_BASE_HEIGHT;

  if (currentAspect > desiredAspect) {
    canvasWidth = desiredAspect * canvasHeight;
  }
  else if (currentAspect < desiredAspect) {
    canvasHeight = canvasWidth / desiredAspect;
  }

  //TODO canvas align middle

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}>
      </canvas>
    </>
  )
}

function drawDebugInfo(ctx: CanvasRenderingContext2D, debugInfo: string) {
  const padding = 10;

  ctx.font = '40px averia-serif-libre';
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.strokeText(debugInfo, CONST.CANVAS_BASE_WIDTH - padding, CONST.CANVAS_BASE_HEIGHT - padding);
  ctx.fillText(debugInfo.toString(), CONST.CANVAS_BASE_WIDTH - padding, CONST.CANVAS_BASE_HEIGHT - padding);
}

