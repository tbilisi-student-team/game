import { GameState, Pew } from '../types';
import * as CONST from '../consts';

import buddyFront from 'assets/buddy-1-front.png';
import buddyBack from 'assets/buddy-1-back.png';
import tree from 'assets/tree.png';
import fetus1 from 'assets/fetus-1.png';
import fetus2 from 'assets/fetus-2.png';
import fetus3 from 'assets/fetus-3.png';
import fetus4 from 'assets/fetus-4.png';
import fetus5 from 'assets/fetus-5.png';
//TODO проверить загрузку

/**
 * Главная функция, отвечающая за отрисовку состояния игры в кадре
 * @param state
 * @param ctx
 */
export function drawFrame(state: GameState, ctx: CanvasRenderingContext2D) {
  clearFrame(ctx);
  ctx.drawImage(buddyBack, state.buddyX, state.buddyY);
  state.fruits.forEach(function (fruit) {
    fruit.draw(ctx);
  })
  state.bullets.forEach(function (bullet) {
    bullet.draw(ctx);
  });
  ctx.drawImage(buddyFront, state.buddyX, state.buddyY);
  state.pews.forEach(function (pew) {
    drawPew(ctx, pew);
  });
  drawScore(ctx, state.score);
}

function clearFrame(ctx: CanvasRenderingContext2D) {
  ctx.resetTransform();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.scale(ctx.canvas.width / CONST.CANVAS_BASE_WIDTH, ctx.canvas.height / CONST.CANVAS_BASE_HEIGHT);//TODO resize
}

function drawPew(ctx: CanvasRenderingContext2D, pew: Pew) {
  const now = performance.now();
  const alpha = Math.max((CONST.PEW_FADE_TIME - (now - pew.startTime)) / CONST.PEW_FADE_TIME, 0);

  ctx.font = '50px averia-serif-libre';
  ctx.strokeStyle = 'rgba(0, 0, 0, ' + alpha + ')';
  ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
  ctx.strokeText('Pew!', pew.x, pew.y);
  ctx.fillText('Pew!', pew.x, pew.y);
}

function drawScore(ctx: CanvasRenderingContext2D, score: number) {
  const text = `Score: ${score}`;
  const padding = 10;

  ctx.font = '40px averia-serif-libre';
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.strokeText(text, CONST.CANVAS_BASE_WIDTH/2, padding);
  ctx.fillText(text.toString(), CONST.CANVAS_BASE_WIDTH/2, padding);
}
