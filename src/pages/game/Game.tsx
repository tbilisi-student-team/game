import React, {useCallback, useEffect, useLayoutEffect, useRef} from 'react';

import { GameState } from './types';
import { Bullet, Fruit } from './models';
import { Drawer } from './controllers';
import {
  INITIAL_GAME_STATE,
  GAME_TIME,
  CANVAS_BASE_HEIGHT,
  CANVAS_BASE_WIDTH,
  FRUITS_LOCS,
  BUDDY_START_Y,
  PEW_FADE_TIME,
  BULLET_SPEED_MAX,
  BULLET_START_X,
  BULLET_START_Y,
} from './consts';
import { getGameImages, getElapsedTime, getPauseTime } from './utils';
import { toggleFullscreen } from '@/utils/index';
import { useWindowVisualViewportSize } from '@/hooks/index';
import  PlaySounds from './utils/PlaySounds';
import { useRouter } from 'next/router'
import { RoutePaths } from '@/types/index'

export default function Game() {
  const windowVisualViewportSize = useWindowVisualViewportSize(
    {
      width: CANVAS_BASE_WIDTH,
      height: CANVAS_BASE_HEIGHT,
    }
  );

  const stateRef = useRef<GameState>({ ...INITIAL_GAME_STATE });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawerRef = useRef<Drawer>(new Drawer());
  const rafIdRef = useRef<number | null>(null);
  const router = useRouter()
  
  useEffect(() => {
    drawerRef.current.setImages(getGameImages());
  }, [])

  const onKeyDown = useCallback(function onKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyP':
      // case 'KeyH':
      //   router.push(RoutePaths.Main)
      case 'Space':
        if (!stateRef.current.isGameOver) {
          stateRef.current.isPause = !stateRef.current.isPause;
        }
        break;
      case 'KeyR':
        if (stateRef.current.isGameOver) {
          stateRef.current = { ...INITIAL_GAME_STATE, isPause: false, };
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
        if (stateRef.current.isGameStarted&&!stateRef.current.isPause&&!stateRef.current.isGameOver) {
          PlaySounds(['pew-1','pew-2','pew-3','pew-4','pew-5','pew-6','pew-7']);
        }
        break;
    }
  }, [])

  const updatePauseTime = useCallback((currentTime: DOMHighResTimeStamp) => {
    stateRef.current.pauseTime = getPauseTime(
      currentTime,
      stateRef.current.startTime,
      stateRef.current.elapsedTimeSinceStart,
    );
    
  }, []);

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

    if (stateRef.current.elapsedTimeSinceStart > GAME_TIME) {
      stateRef.current.isGameOver = true;
      PlaySounds(['final-1','final-2']);
      //TODO emit event
      return;
    }

    if ((stateRef.current.elapsedTimeSinceStart - stateRef.current.fruitGrowthTime) >= 2000) {
      stateRef.current.fruitGrowthTime = stateRef.current.elapsedTimeSinceStart;
      growNewFruit();
    }
    stateRef.current.fruits.forEach(function (fruit) {
      fruit.updateState(stateRef.current.elapsedTimeSinceStart);
    });
    stateRef.current.bullets.forEach(function (bullet) {
      bullet.updatePosition();
    });
    stateRef.current.pews =//TODO move to Drawer
      stateRef.current.pews.filter((pew) => ((performance.now() - pew.startTime) <= PEW_FADE_TIME));
    stateRef.current.bullets = stateRef.current.bullets.filter(
      (bullet) => !bullet.isCollided && bullet.x < CANVAS_BASE_WIDTH && bullet.y < CANVAS_BASE_HEIGHT
    );
    stateRef.current.fruits = stateRef.current.fruits.filter(
      (fruit) => fruit.y < CANVAS_BASE_HEIGHT
    );
    //TODO bullet может быть только 1?
    for (const bullet of stateRef.current.bullets) {
      for (const fruit of stateRef.current.fruits) {
        if (!fruit.isDropping && checkIntersectionWithFruit(bullet, fruit)) {
          stateRef.current.score += fruit.age;
          fruit.drop(stateRef.current.elapsedTimeSinceStart);
          PlaySounds(['yes-1','yes-2','yes-3','yes-4']);
          bullet.isCollided = true;
          break;
        }
      }
    }
  }, []);

  const pew = (dx: number, dy: number) => {
    stateRef.current.pews.push({
      x: 200 + Math.random() * 200,
      y: BUDDY_START_Y - 300 + Math.random() * 200,
      startTime: performance.now(),
    });
    stateRef.current.bullets.push(new Bullet( 
      BULLET_START_X, BULLET_START_Y,
      Math.min(dx / 100, BULLET_SPEED_MAX), -Math.min(dy / 100, BULLET_SPEED_MAX)));
  }

  const checkIntersectionWithFruit = (bullet: Bullet, fruit: Fruit) => {
    const fruitCenterY = fruit.y + fruit.radius;//фрукт висит на черенке
    const distance = Math.sqrt((bullet.x - fruit.x)**2 + (bullet.y - fruitCenterY)**2);

    return distance <= (bullet.radius + fruit.radius);
  }

  const growNewFruit = () => {
    if (stateRef.current.fruits.length >= FRUITS_LOCS.length) {
      return;
    }
    for (const loc of FRUITS_LOCS) {
      if (!stateRef.current.fruits.find((fruit) => fruit.x === loc.x && fruit.y === loc.y)) {
        const fruit = new Fruit(loc.x, loc.y, stateRef.current.elapsedTimeSinceStart);

        fruit.onRot = function() {
          stateRef.current.score -= 1;
        };
        stateRef.current.fruits.push(fruit);
        break;
      }
    }
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

  return (
    <canvas
      ref={canvasRef}
      width={windowVisualViewportSize.width}
      height={windowVisualViewportSize.height}>
    </canvas>
  )
}
