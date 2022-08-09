import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import useInterval from './hooks/useInterval';
import { GameProps, GameState } from './types';
import { Bullet, Fruit } from './models';
import { drawCircle } from './utils/CanvasUtils';
import * as CONST from './consts';


import buddyFront from '../../assets/buddy-1-front.png';
import buddyBack from '../../assets/buddy-1-back.png';
import { drawFrame } from 'pages/Game/utils/drawFrame';

const BUDDY_START_X = 100;
const BUDDY_START_Y = 400;
const BULLET_START_X = BUDDY_START_X + 270;
const BULLET_START_Y = BUDDY_START_Y + 110;

const FRUITS_X = CONST.CANVAS_BASE_WIDTH - 500;
const FRUITS_Y = 100;

const buddyImgFront = new Image();
const buddyImgBack = new Image();

const imagesToLoad = [ buddyImgFront, buddyImgBack ];

export function Game (props: GameProps) {
  console.log('Game init');

  const stateRef = useRef<GameState>({
    buddyX: BUDDY_START_X,
    buddyY: BUDDY_START_Y,
    pews: [],
    bullets: [],
    fruits: [],
    score: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafIdRef = useRef(0);
  const drawCountRef = useRef(0);

  const [ isPaused, setPaused ] = useState(false);
  const [ areImagesReady, setImagesReady ] = useState(false);

  if (!areImagesReady) {
    Promise.all(imagesToLoad.map((img) => {
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      })
    })).then(() => {
      setImagesReady(true);
    });

    buddyImgFront.src = buddyFront;
    buddyImgBack.src = buddyBack;
  }

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
    console.log('layoutEffect');

    if (!areImagesReady) {
      return;
    }

    if (!isPaused) {
      onAnimationFrame();
    }

    return function() {
      cancelAnimationFrame(rafIdRef.current);
    }
  }, [ isPaused, areImagesReady ]);

  useInterval(() => {
    const fruit = new Fruit(FRUITS_X + 400*Math.random(), FRUITS_Y + 400*Math.random());

    fruit.onRot = function() {
      stateRef.current.score -= 1;
    };
    stateRef.current.fruits.push(fruit);
  }, 2000);

  function onAnimationFrame() {
    const state = stateRef.current;

    state.fruits.forEach(function (fruit) {
      fruit.updateState();
    });
    state.bullets.forEach(function (bullet) {
      bullet.updatePosition();
    });
    state.pews = state.pews.filter((pew) => ((performance.now() - pew.startTime) <= CONST.PEW_FADE_TIME));
    state.bullets = state.bullets.filter(
      (bullet) => bullet.x < CONST.CANVAS_BASE_WIDTH && bullet.y < CONST.CANVAS_BASE_HEIGHT
    );

    const ctx = canvasRef.current?.getContext('2d');

    if (ctx) {
      drawFrame(state, ctx);

      drawDebugInfo(ctx,
        `mouseX: ${mouseStateRef.current.x}, mouseY: ${mouseStateRef.current.y}, ${drawCountRef.current++}`);

      //TODO bullet может быть только 1?
      for (let b = 0; b < state.bullets.length; b++) {
        const bullet = state.bullets[b];

        state.fruits.filter((fruit) => !fruit.isDropping).every((fruit) => {
          //TODO снаряд может пролететь через фрукт между кадрами!
          if (checkIntersection(bullet, fruit)) {
            state.score += (fruit.state > 1 ? fruit.state - 1 : 0);
            fruit.drop();
            drawCircle(ctx, bullet.x, bullet.y, bullet.radius, { fillStyle: '#fff' });
            state.bullets.splice(b, 1);
            return false;
          }
          return true;
        });
      }
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

function checkIntersection(bullet: Bullet, fruit: Fruit) {
  const distance = Math.sqrt((bullet.x - fruit.x)**2 + (bullet.y - fruit.y)**2);

  return distance <= (bullet.radius + fruit.radius);
}
