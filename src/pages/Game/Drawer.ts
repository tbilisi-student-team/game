import { GameState, MouseState, Pew } from './types';
import * as CONST from './consts';
import { Bullet, Fruit } from '../Game/models';
import { drawCircle } from './utils/CanvasUtils';

import buddyFrontSrc from '../../assets/buddy-1-front.png';
import buddyBackSrc from '../../assets/buddy-1-back.png';
import treeSrc from '../../assets/tree.png';
import fetus1Src from '../../assets/fetus-1.png';
import fetus2Src from '../../assets/fetus-2.png';
import fetus3Src from '../../assets/fetus-3.png';
import fetus4Src from '../../assets/fetus-4.png';
import fetus5Src from '../../assets/fetus-5.png';

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

export default class Drawer {
  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
  }

  ctx: CanvasRenderingContext2D;

  /**
   * Главная функция, отвечающая за отрисовку состояния игры в кадре
   * @param state
   */
  drawFrame(state: GameState) {
    this.clearFrame();

    if (state.isLoading) {
      this.ctx.font = `${CONST.CANVAS_BASE_HEIGHT/6}px averia-serif-libre`;
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Loading...', CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2);
      return;
    }

    this.ctx.drawImage(buddyBack, state.buddyX, state.buddyY);

    const treeWidth = tree.width * CONST.CANVAS_BASE_HEIGHT / tree.height;

    this.ctx.drawImage(tree, CONST.CANVAS_BASE_WIDTH - treeWidth, 0, treeWidth, CONST.CANVAS_BASE_HEIGHT);

    state.fruits.forEach((fruit) => {
      this.drawFruit(fruit);
    });

    state.bullets.forEach((bullet) => {
      this.drawBullet(bullet);
    });

    this.ctx.drawImage(buddyFront, state.buddyX, state.buddyY);

    state.pews.forEach((pew) => {
      this.drawPew(pew);
    });

    if (state.isGameOver) {
      this.drawGameOver(state.score);
    }
    else {
      this.drawScore(state.score);
      this.drawTimeLeft(state.startTime);
    }

    if (state.debug) {
      this.ctx.strokeStyle = '#fff';
      this.ctx.strokeRect(0, 0, CONST.CANVAS_BASE_WIDTH, CONST.CANVAS_BASE_HEIGHT);

      state.fruits.forEach((fruit) => {
        drawCircle(this.ctx, fruit.x, fruit.y + fruit.radius, fruit.radius, { fillStyle: 'yellow' });
      });

      this.drawDebugInfo(`mouseX: ${state.mouse.x}, mouseY: ${state.mouse.y}`);

      if (state.mouse.isPressed) {
        this.drawDebugTrajectory(state.mouse);
      }
    }
  }

  clearFrame() {
    this.ctx.resetTransform();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.scale(this.ctx.canvas.width / CONST.CANVAS_BASE_WIDTH, this.ctx.canvas.height / CONST.CANVAS_BASE_HEIGHT);
    //TODO resize
  }

  drawPew(pew: Pew) {
    const now = performance.now();
    const alpha = Math.max((CONST.PEW_FADE_TIME - (now - pew.startTime)) / CONST.PEW_FADE_TIME, 0);

    this.ctx.font = '50px averia-serif-libre';
    this.ctx.strokeStyle = 'rgba(0, 0, 0, ' + alpha + ')';
    this.ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
    this.ctx.strokeText('Pew!', pew.x, pew.y);
    this.ctx.fillText('Pew!', pew.x, pew.y);
  }

  drawScore(score: number) {
    const text = `Score: ${score}`;
    const padding = 10;

    this.ctx.font = '40px averia-serif-libre';
    this.ctx.strokeStyle = '#fff';
    this.ctx.fillStyle = '#000';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    this.ctx.strokeText(text, CONST.CANVAS_BASE_WIDTH/2, padding);
    this.ctx.fillText(text.toString(), CONST.CANVAS_BASE_WIDTH/2, padding);
  }

  drawTimeLeft(timeStart: number) {
    const timeLeft = Math.floor(CONST.GAME_TIME - (performance.now() - timeStart));
    const seconds = Math.floor(timeLeft / 1000);
    const mseconds = timeLeft % 1000;
    const pad = seconds < 10 ? '0' : '';
    const text = `00${seconds % 2 === 0 ? ':' : ' '}${pad}${seconds}.${mseconds.toString(10)[0]}`;
    const padding = 60;

    this.ctx.font = '40px averia-serif-libre';
    this.ctx.strokeStyle = '#fff';
    this.ctx.fillStyle = '#000';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    this.ctx.strokeText(text, CONST.CANVAS_BASE_WIDTH/2, padding);
    this.ctx.fillText(text.toString(), CONST.CANVAS_BASE_WIDTH/2, padding);
  }

  drawGameOver(score: number) {
    const drawLine = (text: string, dy: number) => {
      this.ctx.strokeText(text, CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2 + dy);
      this.ctx.fillText(text, CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2 + dy);
    }

    this.ctx.fillStyle = '#00000088';
    this.ctx.fillRect(0, 0, CONST.CANVAS_BASE_WIDTH, CONST.CANVAS_BASE_HEIGHT);

    this.ctx.font = '60px averia-serif-libre';
    this.ctx.strokeStyle = '#fff';
    this.ctx.fillStyle = '#fff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    drawLine('Game Over!', -30);

    this.ctx.font = '40px averia-serif-libre';
    drawLine(`Your score is: ${score}!`, 20);
  }

  drawBullet(bullet: Bullet) {
    if (bullet.isCollided) {
      drawCircle(this.ctx, bullet.x, bullet.y, bullet.radius*2, { fillStyle: '#f00' });
    }
    else {
      drawCircle(this.ctx, bullet.x, bullet.y, bullet.radius, { fillStyle: '#00f' });
    }
  }

  drawFruit(fruit: Fruit) {
    const img = fetuses[fruit.age];

    this.ctx.drawImage(img, fruit.x - img.width/2, fruit.y);
  }

  drawDebugInfo(debugInfo: string) {
    const padding = 10;

    this.ctx.font = '40px averia-serif-libre';
    this.ctx.strokeStyle = '#fff';
    this.ctx.fillStyle = '#000';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'bottom';
    this.ctx.strokeText(debugInfo, CONST.CANVAS_BASE_WIDTH - padding, CONST.CANVAS_BASE_HEIGHT - padding);
    this.ctx.fillText(debugInfo.toString(), CONST.CANVAS_BASE_WIDTH - padding, CONST.CANVAS_BASE_HEIGHT - padding);
  }

  drawDebugTrajectory(mouse: MouseState) {
    //функция - прототип. Потребуется при прицеливании что-то отображать все равно.
    const vx = Math.min((mouse.pressX - mouse.x) / 100, CONST.BULLET_SPEED_MAX);
    const vy = -Math.min((mouse.pressY - mouse.y) / 100, CONST.BULLET_SPEED_MAX);

    if (Math.abs(vx) < 0.1 || Math.abs(vy)  < 0.1) {
      return;
    }

    this.ctx.save();
    this.ctx.strokeStyle = '#fff';
    this.ctx.setLineDash([ 5, 5 ]);
    this.ctx.beginPath();
    for (let time = 0; time < 1000; time += 10) {
      const x = CONST.BULLET_START_X + vx * time;
      const y = CONST.BULLET_START_Y - vy * time + CONST.g * time**2;

      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }
}

export function checkLoadCompete() {
  return isLoadComplete;
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
