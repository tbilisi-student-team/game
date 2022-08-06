import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { GameProps, GameVars, Bullet, Pew } from './types';

import buddyFront from '../../assets/buddy-1-front.png';
import buddyBack from '../../assets/buddy-1-back.png';

const PEW_FADE_TIME = 1000;
const BUDDY_START_X = 100;
const BUDDY_START_Y = 200;
const BULLET_START_X = BUDDY_START_X + 270;
const BULLET_START_Y = BUDDY_START_Y + 110;

const buddyImgFront = new Image();
const buddyImgBack = new Image();

const imagesToLoad = [ buddyImgFront, buddyImgBack ];

export function Game (props: GameProps) {
  console.log('Game init');

  const varsRef = useRef({
    buddyX: BUDDY_START_X,
    buddyY: BUDDY_START_Y,
    pews: [],
    bullets: []
  } as GameVars);

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
      console.log('Pew!');
      varsRef.current.pews.push({
        x: 200 + Math.random()*200,
        y: 100 + Math.random()*200,
        startTime: performance.now(),
      });
      varsRef.current.bullets.push({
        v: 2 + 2*Math.random(),
        startTime: performance.now(),
      })
    }
    else if (e.key === 'p') {
      setPaused(!isPaused);
    }
  }, [ isPaused ]);

  useLayoutEffect(function () {
    console.log('layoutEffect');

    if (!areImagesReady) {
      return;
    }

    if (!isPaused) {
      draw();
    }

    document.addEventListener('keydown', onKeyDown);

    return function() {
      cancelAnimationFrame(rafIdRef.current);
      document.removeEventListener('keydown', onKeyDown);
    }
  }, [ isPaused, areImagesReady ]);

  function draw() {
    console.log('draw');
    const vars = varsRef.current;

    if (canvasRef && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        ctx.drawImage(buddyImgBack, vars.buddyX, vars.buddyY);

        vars.bullets.forEach(function (bullet) {
          drawBullet(ctx, bullet);
        })

        ctx.drawImage(buddyImgFront, vars.buddyX, vars.buddyY);
        vars.pews.forEach(function (pew) {
          drawPew(ctx, pew);
        });

        drawDrawCount(ctx, drawCountRef.current++);
      }
    }
    vars.pews = vars.pews.filter((pew) => ((performance.now() - pew.startTime) <= PEW_FADE_TIME));
    rafIdRef.current = requestAnimationFrame(draw);
  }

  return (
    <>
      <h1>Game</h1>
      <canvas
        ref={canvasRef}
        width={props.width || document.body.clientWidth}
        height={props.height || (window.innerHeight - 100)}>
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
  const x = BULLET_START_X + bullet.v * time;
  const y = BULLET_START_Y - bullet.v * time + 0.01 * time**2;

  drawCircle(ctx, x, y, 20);
}

function drawDrawCount(ctx: CanvasRenderingContext2D, drawCount: number, dx = -100, dy = -100) {
  ctx.font = '40px averia-serif-libre';
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#000';
  ctx.strokeText(drawCount.toString(), ctx.canvas.width + dx, ctx.canvas.height + dy);
  ctx.fillText(drawCount.toString(), ctx.canvas.width + dx, ctx.canvas.height + dy);
}
