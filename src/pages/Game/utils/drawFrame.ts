import { GameState, Pew } from '../types';
import * as CONST from '../consts';
import { Fruit } from '../../Game/models';

import buddyFrontSrc from '../../../assets/buddy-1-front.png';
import buddyBackSrc from '../../../assets/buddy-1-back.png';
import treeSrc from '../../../assets/tree.png';
import fetus1Src from '../../../assets/fetus-1.png';
import fetus2Src from '../../../assets/fetus-2.png';
import fetus3Src from '../../../assets/fetus-3.png';
import fetus4Src from '../../../assets/fetus-4.png';
import fetus5Src from '../../../assets/fetus-5.png';

let isLoadComplete = false;
const images: HTMLImageElement[] = [];
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

export function checkLoadCompete() {
  return isLoadComplete;
}

/**
 * Главная функция, отвечающая за отрисовку состояния игры в кадре
 * @param ctx
 * @param state
 */
export function drawFrame(ctx: CanvasRenderingContext2D, state: GameState) {
  clearFrame(ctx);

  if (state.isLoading) {
    ctx.font = `${CONST.CANVAS_BASE_HEIGHT/6}px averia-serif-libre`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2);
    return;
  }

  ctx.drawImage(buddyBack, state.buddyX, state.buddyY);

  const treeWidth = tree.width * ctx.canvas.height / tree.height;

  ctx.drawImage(tree, CONST.CANVAS_BASE_WIDTH - treeWidth, 0, treeWidth, ctx.canvas.height);

  state.fruits.forEach(function (fruit) {
    drawFruit(ctx, fruit);
  });
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

function onImageLoad() {
  if (images.every((img) => img.complete)) {
    isLoadComplete = true;
  }
}

function getImage(src: string) {
  const img = new Image();

  img.onload = onImageLoad;
  img.src = src;
  images.push(img);
  return img;
}

function drawFruit(ctx: CanvasRenderingContext2D, fruit: Fruit) {
  const img = fetuses[fruit.age];

  ctx.drawImage(img, fruit.x - img.width/2, fruit.y);
}
