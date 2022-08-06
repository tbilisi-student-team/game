import React, { useCallback, useLayoutEffect, useRef, } from 'react';

import { GameProps, GameVars, Bullet, Pew } from './types';

import buddyFront from '../../assets/buddy-1-front.png';
import buddyBack from '../../assets/buddy-1-back.png';

const PEW_FADE_TIME = 1000;
const BULLET_START_X = 370;
const BULLET_START_Y = 210;

const buddyImgFront = new Image();
const buddyImgBack = new Image();

const imagesToLoad = [ buddyImgFront, buddyImgBack ];

export function Game (props: GameProps) {
  console.log('Game init');

  const varsRef = useRef({
    buddyX: 100,
    buddyY: 100,
    pews: [],
    bullets: []
  } as GameVars);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafIdRef = useRef<number>(0);

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
  }, []);

  useLayoutEffect(function () {
    console.log('layoutEffect');

    Promise.all(imagesToLoad.map((img) => {
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      })
    })).then(() => {
      draw();
    });

    buddyImgFront.src = buddyFront;
    buddyImgBack.src = buddyBack;

    document.addEventListener('keydown', onKeyDown);

    return function() {
      cancelAnimationFrame(rafIdRef.current);
      document.removeEventListener('keydown', onKeyDown);
    }
  });

  function draw() {
    console.log('draw');
    const vars = varsRef.current;

    if (canvasRef && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        // ctx.restore();

        ctx.drawImage(buddyImgBack, vars.buddyX, vars.buddyY);

        vars.bullets.forEach(function (bullet) {
          drawBullet(ctx, bullet);
        })

        ctx.drawImage(buddyImgFront, vars.buddyX, vars.buddyY);
        vars.pews.forEach(function (pew) {
          drawPew(ctx, pew);
        });
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
