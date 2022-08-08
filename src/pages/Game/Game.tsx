import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { GameProps, GameVars, Bullet, Pew } from './types';

import buddyFront from '../../assets/buddy-1-front.png';
import buddyBack from '../../assets/buddy-1-back.png';

const PEW_FADE_TIME = 1000;
const BUDDY_START_X = 100;
const BUDDY_START_Y = 400;
const BULLET_START_X = BUDDY_START_X + 270;
const BULLET_START_Y = BUDDY_START_Y + 110;
const g = 0.001;

const CANVAS_BASE_WIDTH = 1920;
const CANVAS_BASE_HEIGHT = 948;

const buddyImgFront = new Image();
const buddyImgBack = new Image();

const imagesToLoad = [ buddyImgFront, buddyImgBack ];

export function Game (props: GameProps) {
  console.log('Game init');

  const stateRef = useRef<GameVars>({
    buddyX: BUDDY_START_X,
    buddyY: BUDDY_START_Y,
    pews: [],
    bullets: []
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
      pew(100, 100);
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
    console.log('pew');
    stateRef.current.pews.push({
      x: 200 + Math.random()*200,
      y: BUDDY_START_Y - 300 + Math.random()*200,
      startTime: performance.now(),
    });
    stateRef.current.bullets.push({
      vx: dx/100,
      vy: -dy/100,
      startTime: performance.now(),
    })
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
      draw();
    }

    return function() {
      cancelAnimationFrame(rafIdRef.current);
    }
  }, [ isPaused, areImagesReady ]);

  function draw() {
    console.log('draw');
    const vars = stateRef.current;

    const ctx = canvasRef.current?.getContext('2d');

    if (ctx) {
      ctx.resetTransform();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.scale(ctx.canvas.width / CANVAS_BASE_WIDTH, ctx.canvas.height/ CANVAS_BASE_HEIGHT);//TODO aspect ratio, resize

      ctx.drawImage(buddyImgBack, vars.buddyX, vars.buddyY);

      vars.bullets.forEach(function (bullet) {
        drawBullet(ctx, bullet);
      })

      ctx.drawImage(buddyImgFront, vars.buddyX, vars.buddyY);
      vars.pews.forEach(function (pew) {
        drawPew(ctx, pew);
      });

      drawDebugInfo(ctx,
        `mouseX: ${mouseStateRef.current.x}, mouseY: ${mouseStateRef.current.y}, ${drawCountRef.current++}`);
    }
    vars.pews = vars.pews.filter((pew) => ((performance.now() - pew.startTime) <= PEW_FADE_TIME));
    vars.bullets = vars.bullets.filter((pew) => ((performance.now() - pew.startTime) <= PEW_FADE_TIME));
    rafIdRef.current = requestAnimationFrame(draw);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={props.width || visualViewport.width}
        height={props.height || visualViewport.height}>
      </canvas>
    </>
  )
}

function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, r: number) {
  context.beginPath();
  context.fillStyle = '#0077aa';
  context.strokeStyle = '#0077aa47';
  context.lineWidth = 2;

  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fill();
  context.stroke();
}

function drawPew(ctx: CanvasRenderingContext2D, pew: Pew) {
  const now = performance.now();
  const alpha = Math.max((PEW_FADE_TIME - (now - pew.startTime)) / PEW_FADE_TIME, 0);

  ctx.font = '40px averia-serif-libre';
  ctx.strokeStyle = 'rgba(0, 0, 0, ' + alpha + ')';
  ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
  ctx.strokeText('Pew!', pew.x, pew.y);
  ctx.fillText('Pew!', pew.x, pew.y);
}

function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet) {
  const time = performance.now() - bullet.startTime;
  const x = BULLET_START_X + bullet.vx * time;
  const y = BULLET_START_Y - bullet.vy * time + g * time**2;

  drawCircle(ctx, x, y, 20);
}

function drawDebugInfo(ctx: CanvasRenderingContext2D, debugInfo: string) {
  const padding = 10;

  ctx.font = '40px averia-serif-libre';
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom'
  ctx.strokeText(debugInfo, ctx.canvas.width - padding, ctx.canvas.height - padding);
  ctx.fillText(debugInfo.toString(), ctx.canvas.width - padding, ctx.canvas.height - padding);
}
