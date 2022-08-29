import React, { useCallback, useLayoutEffect, useRef } from 'react';
import useInterval from './hooks/useInterval';
import { GameProps, GameState, Loc } from './types';
import { Bullet, Fruit } from './models';
import Drawer from './Drawer';
import * as CONST from './consts';
import './index.css';
import buddyBackSrc from 'assets/buddy-1-back.png';
import buddyFrontSrc from 'assets/buddy-1-front.png';
import treeSrc from 'assets/tree.png';
import fetus1Src from 'assets/fetus-1.png';
import fetus2Src from 'assets/fetus-2.png';
import fetus3Src from 'assets/fetus-3.png';
import fetus4Src from 'assets/fetus-4.png';
import fetus5Src from 'assets/fetus-5.png';
import seedSrc from 'assets/seed.png';
import seedRaysSrc from 'assets/seed-rays.png';
import flowerSrc from 'assets/flower.png';

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
  isGameOver: false,
  isPause: true,
  isGameStarted: false,
  debug: false,
  startTime: 0,
  pauseTime: 0,
  elapsedTimeSinceStart: 0,
  mouseState: {
    x: 0,
    y: 0,
    isPressed: false,
    pressX: 0,
    pressY: 0
  }
};

function getImage(src: string) {
  const img = new Image();

  img.src = src;
  return img;
}

const buddyBack = getImage(buddyBackSrc);
const buddyFront = getImage(buddyFrontSrc);
const tree = getImage(treeSrc);
const fetuses = [
  getImage(fetus1Src),
  getImage(fetus2Src),
  getImage(fetus3Src),
  getImage(fetus4Src),
  getImage(fetus5Src),
];
const seed = getImage(seedSrc);
const seedRays = getImage(seedRaysSrc);
const flower = getImage(flowerSrc);

function getPauseTime (currentTime: number, startTime: number, elapsedTime: number) {
  return (currentTime - startTime) - elapsedTime;
}

function getElapsedTime (currentTime: number, startTime: number, pauseTime: number) {
  return (currentTime - startTime) - pauseTime;
}

export function Game (props: GameProps) {
  console.log('Game init');

  const stateRef = useRef<GameState>({ ...INITIAL_STATE });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawerRef = useRef<Drawer>(new Drawer(
    {
      images: {
        seed,
        seedRays,
        flower,
        fetuses,
        buddyBack,
        buddyFront,
        tree,
      }
    }
  ));
  const rafIdRef = useRef(0);

  const onKeyDown = useCallback(function onKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      pew(100, -100);
    }
    else if (e.key === 'p') {
      if (!stateRef.current.isGameOver) {
        stateRef.current.isPause = !stateRef.current.isPause;
      }

    } else if (e.key === 'r') {
      if (stateRef.current.isGameOver) {
        stateRef.current = { ...INITIAL_STATE, isPause: false, };
      }
    }
    else if (e.key === 'd' && drawerRef.current) {
      drawerRef.current.debug = !drawerRef.current.debug;
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

    if (stateRef.current.elapsedTimeSinceStart > CONST.GAME_TIME) {
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
      stateRef.current.pews.filter((pew) => ((performance.now() - pew.startTime) <= CONST.PEW_FADE_TIME));
    stateRef.current.bullets = stateRef.current.bullets.filter(
      (bullet) => !bullet.isCollided && bullet.x < CONST.CANVAS_BASE_WIDTH && bullet.y < CONST.CANVAS_BASE_HEIGHT
    );
    stateRef.current.fruits = stateRef.current.fruits.filter(
      (fruit) => fruit.y < CONST.CANVAS_BASE_HEIGHT
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
      y: CONST.BUDDY_START_Y - 300 + Math.random() * 200,
      startTime: performance.now(),
    });
    stateRef.current.bullets.push(new Bullet(
      CONST.BULLET_START_X, CONST.BULLET_START_Y,
      Math.min(dx / 100, CONST.BULLET_SPEED_MAX), -Math.min(dy / 100, CONST.BULLET_SPEED_MAX)));
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
      cancelAnimationFrame(rafIdRef.current);
    }
  }, [ onAnimationFrame ]);

  useInterval(() => {//TODO move to Controller
    //TODO пока первый падает, второй может уже расти?
    if (stateRef.current.fruits.length >= FRUITS_LOCS.length) {
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
        className={'game'}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}>
      </canvas>
    </>
  )
}
