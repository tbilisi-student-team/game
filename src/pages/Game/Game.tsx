import React, { useCallback, useLayoutEffect, useRef } from 'react';
import useInterval from './hooks/useInterval';
import { GameProps, GameState } from './types';
import { Bullet, Fruit } from './models';
import Drawer from './Drawer';
import * as CONSTS from './consts';
import './index.css';
import { getGameImages, getElapsedTime, getPauseTime } from './utils';
import { toggleFullscreen } from 'utils';

const gameImages = getGameImages();

export function Game (props: GameProps) {
  const stateRef = useRef<GameState>({ ...CONSTS.INITIAL_GAME_STATE });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawerRef = useRef<Drawer>(new Drawer(
    {
      images: gameImages,
    }
  ));
  const rafIdRef = useRef<number | null>(null);

  const onKeyDown = useCallback(function onKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyP':
      case 'Space':
        if (!stateRef.current.isGameOver) {
          stateRef.current.isPause = !stateRef.current.isPause;
        }
        break;
      case 'KeyR':
        if (stateRef.current.isGameOver) {
          stateRef.current = { ...CONSTS.INITIAL_GAME_STATE, isPause: false, };
        }
        break;
      case 'KeyD':
        drawerRef.current.debug = !drawerRef.current.debug;
        break;
      case 'KeyF':
        toggleFullscreen();
        break;
    }
  }, []);

  const onMouse = useCallback(function (e: MouseEvent) {
    switch (e.type) {
      case 'mousemove':
        stateRef.current.mouseState.x = e.clientX;
        stateRef.current.mouseState.y = e.clientY;
        break;
      case 'mousedown':
        stateRef.current.mouseState.pressX = e.clientX;
        stateRef.current.mouseState.pressY = e.clientY;
        stateRef.current.mouseState.isPressed = true;
        canvasRef.current?.classList.add('grabbing');
        break;
      case 'mouseup':
        stateRef.current.mouseState.isPressed = false;
        canvasRef.current?.classList.remove('grabbing');
        pew(stateRef.current.mouseState.pressX - e.x, stateRef.current.mouseState.pressY - e.y);
        break;
    }
  }, [])

  const updatePauseTime = useCallback((currentTime: DOMHighResTimeStamp) => {
    stateRef.current.pauseTime = getPauseTime(
      currentTime,
      stateRef.current.startTime,
      stateRef.current.elapsedTimeSinceStart,
    );

    stateRef.current.elapsedTimeSinceStart = getElapsedTime(
      currentTime,
      stateRef.current.startTime,
      stateRef.current.pauseTime,
    );
  }, [])

  const updateGame = useCallback((currentTime: DOMHighResTimeStamp) => {
    if (!stateRef.current.isGameStarted) {
      stateRef.current.isGameStarted = true;
    }

    if (!stateRef.current.startTime) {
      stateRef.current.startTime = currentTime;
    }

    stateRef.current.elapsedTimeSinceStart = getElapsedTime(
      currentTime,
      stateRef.current.startTime,
      stateRef.current.pauseTime,
    );

    if (stateRef.current.elapsedTimeSinceStart > CONSTS.GAME_TIME) {
      stateRef.current.isGameOver = true;
      //TODO emit event
      return;
    }
    stateRef.current.fruits.forEach(function (fruit) {
      fruit.updateState();
    });
    stateRef.current.bullets.forEach(function (bullet) {
      bullet.updatePosition();
    });
    stateRef.current.pews =
      stateRef.current.pews.filter((pew) => ((performance.now() - pew.startTime) <= CONSTS.PEW_FADE_TIME));
    stateRef.current.bullets = stateRef.current.bullets.filter(
      (bullet) => !bullet.isCollided && bullet.x < CONSTS.CANVAS_BASE_WIDTH && bullet.y < CONSTS.CANVAS_BASE_HEIGHT
    );
    stateRef.current.fruits = stateRef.current.fruits.filter(
      (fruit) => fruit.y < CONSTS.CANVAS_BASE_HEIGHT
    );
    //TODO bullet может быть только 1?
    for (const bullet of stateRef.current.bullets) {
      for (const fruit of stateRef.current.fruits) {
        if (!fruit.isDropping && checkIntersectionWithFruit(bullet, fruit)) {
          stateRef.current.score += fruit.age;
          fruit.drop();
          bullet.isCollided = true;
          break;
        }
      }
    }
  }, []);

  const pew = (dx: number, dy: number) => {
    stateRef.current.pews.push({
      x: 200 + Math.random() * 200,
      y: CONSTS.BUDDY_START_Y - 300 + Math.random() * 200,
      startTime: performance.now(),
    });
    stateRef.current.bullets.push(new Bullet(
      CONSTS.BULLET_START_X, CONSTS.BULLET_START_Y,
      Math.min(dx / 100, CONSTS.BULLET_SPEED_MAX), -Math.min(dy / 100, CONSTS.BULLET_SPEED_MAX)));
  }

  const checkIntersectionWithFruit = (bullet: Bullet, fruit: Fruit) => {
    const fruitCenterY = fruit.y + fruit.radius;//фрукт висит на черенке
    const distance = Math.sqrt((bullet.x - fruit.x)**2 + (bullet.y - fruitCenterY)**2);

    return distance <= (bullet.radius + fruit.radius);
  }

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

  const onAnimationFrame = useCallback((time: DOMHighResTimeStamp) => {
    const ctx = canvasRef.current?.getContext('2d');

    if (ctx) {
      rafIdRef.current = requestAnimationFrame(onAnimationFrame);
      drawerRef.current?.clearFrame({ ctx });

      if (stateRef.current.isPause) {
        if (stateRef.current.isGameStarted) {
          updatePauseTime(time);
        }
        drawerRef.current?.drawStart({ ctx });
      } else if (stateRef.current.isGameOver) {
        if (stateRef.current.isGameStarted) {
          updatePauseTime(time);
        }
        drawerRef.current?.drawGameOver({ ctx, score: stateRef.current.score });
      } else {
        updateGame(time);

        drawerRef.current?.drawGame({ ctx, gameState: stateRef.current });

        if (stateRef.current.debug) {
          drawerRef.current?.drawDebug({ ctx, gameState: stateRef.current });
        }
      }
    }
  }, [ updateGame, updatePauseTime ])

  useLayoutEffect(function mainLayoutEffect() {
    rafIdRef.current = requestAnimationFrame(onAnimationFrame)

    return function() {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    }
  }, [ onAnimationFrame ]);

  useInterval(() => {//TODO move to Controller
    //TODO пока первый падает, второй может уже расти?
    if (stateRef.current.fruits.length >= CONSTS.FRUITS_LOCS.length) {
      return;
    }
    for (const loc of CONSTS.FRUITS_LOCS) {
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
  const desiredAspect = CONSTS.CANVAS_BASE_WIDTH / CONSTS.CANVAS_BASE_HEIGHT;

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
        className={'game'}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}>
      </canvas>
    </>
  )
}
