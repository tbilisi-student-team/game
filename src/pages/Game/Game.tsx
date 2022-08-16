import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import useInterval from './hooks/useInterval';
import { GameProps, GameState, Loc } from './types';
import { Fruit } from './models';
import { updateState, pew } from './Controller';
import Drawer from './Drawer';
import * as CONST from './consts';

const FRUITS_LOCS: Loc[] = [
  { x: 1289, y: 146 },
  { x: 1470, y: 241 },
  { x: 1520, y: 364 },
  { x: 1534, y: 566 },
  { x: 1574, y: 743 },
];

const INITIAL_STATE: GameState = {
  buddyX: CONST.BUDDY_START_X,
  buddyY: CONST.BUDDY_START_Y,
  pews: [],
  bullets: [],
  fruits: [],
  score: 0,
  isLoading: true,
  isGameOver: false,
  debug: false,
  startTime: 0,
  mouse: {
    x: 0,
    y: 0,
    isPressed: false,
    pressX: 0,
    pressY: 0
  }
};

export function Game (props: GameProps) {
  console.log('Game init');

  const stateRef = useRef<GameState>(INITIAL_STATE);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<Drawer | null>(null);
  const rafIdRef = useRef(0);

  const [ isPaused, setPaused ] = useState(false);

  const onKeyDown = useCallback(function onKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      pew(stateRef.current, 100, -100);
    }
    else if (e.key === 'p') {
      setPaused(!isPaused);
    }
    else if (e.key === 'd') {
      stateRef.current.debug = !stateRef.current.debug;
    }
  }, [ isPaused ]);

  const onMouse = useCallback(function (e: MouseEvent) {
    switch (e.type) {
      case 'mousemove':
        stateRef.current.mouse.x = e.clientX;
        stateRef.current.mouse.y = e.clientY;
        break;
      case 'mousedown':
        stateRef.current.mouse.pressX = e.clientX;
        stateRef.current.mouse.pressY = e.clientY;
        stateRef.current.mouse.isPressed = true;
        break;
      case 'mouseup':
        stateRef.current.mouse.isPressed = false;
        pew(stateRef.current, stateRef.current.mouse.pressX - e.x, stateRef.current.mouse.pressY - e.y);
        break;
    }
  }, [])

  useLayoutEffect(function addListeners() {
    const canvas = canvasRef.current;

    document.addEventListener('keydown', onKeyDown);
    canvas?.addEventListener('mousedown', onMouse);
    canvas?.addEventListener('mousemove', onMouse);
    canvas?.addEventListener('mouseup', onMouse);

    return function removeListeners() {
      document.removeEventListener('keydown', onKeyDown);
      canvas?.removeEventListener('mousedown', onMouse);
      canvas?.removeEventListener('mousemove', onMouse);
      canvas?.removeEventListener('mouseup', onMouse);
    }
  }, [ onKeyDown, onMouse ])


  useLayoutEffect(function mainLayoutEffect() {
    console.log('mainLayoutEffect');

    if (drawerRef.current === null) {
      const ctx = canvasRef.current?.getContext('2d');

      if (ctx) {
        drawerRef.current = new Drawer(ctx);
      }
    }

    if (!isPaused) {
      onAnimationFrame();
    }

    return function() {
      cancelAnimationFrame(rafIdRef.current);
    }
  }, [ isPaused ]);

  function onAnimationFrame() {
    const state = stateRef.current;

    updateState(state);

    if (drawerRef.current) {
      drawerRef.current?.drawFrame(state);
    }

    rafIdRef.current = requestAnimationFrame(onAnimationFrame);
  }

  useInterval(() => {//TODO move to Controller
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
