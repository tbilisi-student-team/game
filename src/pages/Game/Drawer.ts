import { GameState, Pew } from './types';
import * as CONST from './consts';
import { Bullet, Fruit } from '../Game/models';
import { drawCircle } from './utils/CanvasUtils';

import { FruitAge } from 'pages/Game/models/Fruit';//TODO move score calc to Controller

export default class Drawer {
  constructor(
    {
      images,
    }: {
      images: {
        buddyBack: HTMLImageElement,
        buddyFront: HTMLImageElement,
        tree: HTMLImageElement,
        fetuses: HTMLImageElement[],
        seed: HTMLImageElement,
        seedRays: HTMLImageElement,
        flower: HTMLImageElement,
      }
    }
  ) {
    this.images = images;
  }
  images: {
    buddyBack: HTMLImageElement,
    buddyFront: HTMLImageElement,
    tree: HTMLImageElement,
    fetuses: HTMLImageElement[],
    seed: HTMLImageElement,
    seedRays: HTMLImageElement,
    flower: HTMLImageElement,
  }
  nowPrev: number = performance.now();
  debug = false;

  /**
   * Главная функция, отвечающая за отрисовку состояния игры в кадре
   * @param state
   */

  drawText(
    {
      ctx,
      strokeTextArgs,
      fillTextArgs,
      canvasRenderingContext2DArgs,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      strokeTextArgs?: Parameters<CanvasText['strokeText']>,
      fillTextArgs?: Parameters<CanvasText['fillText']>,
      canvasRenderingContext2DArgs?: Partial<Pick<CanvasRenderingContext2D,
        'font' |
        'strokeStyle' |
        'fillStyle' |
        'textAlign' |
        'textBaseline'>>
    }
  ) {
    if (!ctx) {
      return;
    }

    if (!strokeTextArgs && !fillTextArgs) {
      return;
    }

    ctx.font =
      (canvasRenderingContext2DArgs && canvasRenderingContext2DArgs.font)
        ? canvasRenderingContext2DArgs.font
        : '40px averia-serif-libre';
    ctx.strokeStyle =
      (canvasRenderingContext2DArgs && canvasRenderingContext2DArgs.strokeStyle)
        ? canvasRenderingContext2DArgs.strokeStyle
        : '#fff';
    ctx.fillStyle =
      (canvasRenderingContext2DArgs && canvasRenderingContext2DArgs.fillStyle)
        ? canvasRenderingContext2DArgs.fillStyle
        :'#000';
    ctx.textAlign =
      (canvasRenderingContext2DArgs && canvasRenderingContext2DArgs.textAlign)
        ? canvasRenderingContext2DArgs.textAlign
        : 'center';
    ctx.textBaseline =
      (canvasRenderingContext2DArgs && canvasRenderingContext2DArgs.textBaseline)
        ? canvasRenderingContext2DArgs.textBaseline
        : 'top';

    if (strokeTextArgs) {
      ctx.strokeText(...strokeTextArgs);
    }

    if (fillTextArgs) {
      ctx.fillText(...fillTextArgs);
    }
  }

  drawLoading(ctx?: CanvasRenderingContext2D | null) {
    this.drawText({
      ctx,
      canvasRenderingContext2DArgs: {
        font: `${CONST.CANVAS_BASE_HEIGHT/6}px averia-serif-libre`,
        textBaseline: 'middle',
      },
      fillTextArgs: [ 'Loading...', CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2 ],
    })
  }

  drawStart(
    {
      ctx,
    }: {
      ctx?: CanvasRenderingContext2D | null,
    }
  ) {
    if (!ctx) {
      return;
    }

    this.drawText({
      ctx,
      canvasRenderingContext2DArgs: {
        textBaseline: 'middle',
        font: '60px averia-serif-libre',
        fillStyle: '#000',
      },
      strokeTextArgs: [ 'To start the game, press "P"', CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2 -30 ],
    });

    this.drawText({
      ctx,
      canvasRenderingContext2DArgs: {
        textBaseline: 'middle',
        font: '40px averia-serif-libre',
        fillStyle: '#000',
      },
      strokeTextArgs:
        [
          'After starting, you can pause the game by pressing the "P" button',
          CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2 + 20
        ],
    });
  }

  drawGame(
    {
      ctx,
      gameState,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      gameState: GameState
    }
  ) {
    if (!ctx) {
      return;
    }

    ctx.drawImage(
      this.images.flower,
      gameState.buddyX - 100,
      gameState.buddyY + this.images.buddyFront.height - 20
    );
    ctx.drawImage(this.images.buddyBack, gameState.buddyX, gameState.buddyY);

    const treeWidth = this.images.tree.width * CONST.CANVAS_BASE_HEIGHT / this.images.tree.height;

    ctx.drawImage(this.images.tree, CONST.CANVAS_BASE_WIDTH - treeWidth, 0, treeWidth, CONST.CANVAS_BASE_HEIGHT);

    gameState.fruits.forEach((fruit) => {
      this.drawFruit({ ctx, fruit });
    });

    gameState.bullets.forEach((bullet) => {
      this.drawBullet({ ctx, bullet });
    });

    ctx.drawImage(this.images.buddyFront, gameState.buddyX, gameState.buddyY);

    gameState.pews.forEach((pew) => {
      this.drawPew({ ctx, pew });
    });

    this.drawScore({ ctx, score: gameState.score });
    this.drawTimeLeft({ ctx, elapsedTimeSinceStart: gameState.elapsedTimeSinceStart });
    if (gameState.mouseState.isPressed) {
      this.drawTrajectory({ ctx, mouseState: gameState.mouseState });
    }

    this.nowPrev = performance.now();
  }

  drawDebug (
    {
      ctx,
      gameState,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      gameState: GameState
    }
  ) {
    if (!ctx) {
      return;
    }

    ctx.strokeStyle = '#fff';
    ctx.strokeRect(0, 0, CONST.CANVAS_BASE_WIDTH, CONST.CANVAS_BASE_HEIGHT);
    this.drawDebugInfo(
      {
        ctx,
        debugInfo: `mouseX: ${gameState.mouseState.x}, mouseY: ${gameState.mouseState.y}` +
      `, fps: ${Math.round(1000 / (performance.now() - this.nowPrev))}`
      });
  }

  clearFrame({ ctx }: { ctx?: CanvasRenderingContext2D | null }) {
    if (!ctx) {
      return;
    }

    ctx.resetTransform();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.scale(ctx.canvas.width / CONST.CANVAS_BASE_WIDTH, ctx.canvas.height / CONST.CANVAS_BASE_HEIGHT);
    //TODO resize
  }

  drawPew(
    {
      ctx,
      pew,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      pew: Pew
    }
  ) {
    const now = performance.now();
    const alpha = Math.max((CONST.PEW_FADE_TIME - (now - pew.startTime)) / CONST.PEW_FADE_TIME, 0);

    this.drawText({
      ctx,
      canvasRenderingContext2DArgs: {
        font: '50px averia-serif-libre',
        strokeStyle: 'rgba(0, 0, 0, ' + alpha + ')',
        fillStyle: 'rgba(255, 255, 255, ' + alpha + ')',
      },
      fillTextArgs: [ 'Pew!', pew.x, pew.y ],
      strokeTextArgs: [ 'Pew!', pew.x, pew.y ]
    });
  }

  drawScore(
    {
      ctx,
      score,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      score: GameState['score']
    }
  ) {
    const text = `Score: ${score}`;
    const padding = 10;

    this.drawText({
      ctx,
      strokeTextArgs: [ text, CONST.CANVAS_BASE_WIDTH/2, padding ],
      fillTextArgs: [ text, CONST.CANVAS_BASE_WIDTH/2, padding ],
    });
  }

  drawTimeLeft(
    {
      ctx,
      elapsedTimeSinceStart,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      elapsedTimeSinceStart: GameState['elapsedTimeSinceStart']
    }
  ) {
    const seconds = Math.floor(elapsedTimeSinceStart / 1000);
    const mseconds = elapsedTimeSinceStart % 1000;
    const pad = seconds < 10 ? '0' : '';
    const text = `00${seconds % 2 === 0 ? ':' : ' '}${pad}${seconds}.${mseconds.toString(10)[0]}`;
    const padding = 60;

    this.drawText({
      ctx,
      strokeTextArgs: [ text, CONST.CANVAS_BASE_WIDTH/2, padding ],
      fillTextArgs: [ text, CONST.CANVAS_BASE_WIDTH/2, padding ]
    });
  }

  drawGameOver(
    {
      ctx,
      score,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      score: GameState['score']
    }
  ) {
    this.drawText({
      ctx,
      canvasRenderingContext2DArgs: {
        textBaseline: 'middle',
        font: '60px averia-serif-libre',
        fillStyle: '#00000088',
      },
      strokeTextArgs: [ 'Game Over!', CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2 -30 ],
      fillTextArgs: [ 'Game Over!', CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2 -30 ],
    });

    this.drawText({
      ctx,
      canvasRenderingContext2DArgs: {
        textBaseline: 'middle',
        font: '40px averia-serif-libre',
        fillStyle: '#00000088',
      },
      strokeTextArgs: [ `Your score is: ${score}!`, CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2 + 20 ],
      fillTextArgs: [ `Your score is: ${score}!`, CONST.CANVAS_BASE_WIDTH/2, CONST.CANVAS_BASE_HEIGHT/2 + 20 ],
    });
  }

  drawBullet(
    {
      ctx,
      bullet,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      bullet: Bullet
    }
  ) {
    if (!ctx) {
      return;
    }

    if (bullet.isCollided) {
      drawCircle(ctx, bullet.x, bullet.y, bullet.radius*2, { fillStyle: '#f00' });
    }
    else {
      ctx.drawImage(this.images.seed, bullet.x - this.images.seed.width/2, bullet.y - this.images.seed.height/2);
      //Поворачиваем шлейф от снаряда по направлению полета
      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      ctx.rotate(-Math.atan2(bullet.vy, bullet.vx));
      ctx.drawImage(
        this.images.seedRays,
        5 - this.images.seed.width - this.images.seedRays.width/2,
        -this.images.seed.height/2
      );
      ctx.restore();
      // drawCircle(ctx, bullet.x, bullet.y, bullet.radius, { fillStyle: '#0000ff44' });//TODO debug only
    }
  }

  drawFruit(
    {
      ctx,
      fruit,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      fruit: Fruit
    }
  ) {
    if (!ctx) {
      return;
    }

    const img = this.images.fetuses[fruit.age];

    if (!img) {
      return;
    }

    ctx.drawImage(img, fruit.x - img.width/2, fruit.y);
    if (this.debug) {
      drawCircle(ctx, fruit.x, fruit.y + fruit.radius, fruit.radius, { fillStyle: 'yellow' });
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const score = fruit.age == FruitAge.Rotten ? -1 : fruit.age;

      ctx.fillText(score.toString(), fruit.x, fruit.y + fruit.radius);
    }
  }

  drawDebugInfo(
    {
      ctx,
      debugInfo,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      debugInfo: string
    }
  ) {
    const padding = 10;

    this.drawText({
      ctx,
      canvasRenderingContext2DArgs: {
        textBaseline: 'bottom',
        textAlign: 'right',
      },
      strokeTextArgs: [ debugInfo, CONST.CANVAS_BASE_WIDTH - padding, CONST.CANVAS_BASE_HEIGHT - padding ],
      fillTextArgs: [ debugInfo, CONST.CANVAS_BASE_WIDTH - padding, CONST.CANVAS_BASE_HEIGHT - padding ],
    });
  }

  drawTrajectory(
    {
      ctx,
      mouseState,
    }: {
      ctx?: CanvasRenderingContext2D | null,
      mouseState: GameState['mouseState']
    }
  ) {
    if (!ctx) {
      return;
    }

    const vx = Math.min((mouseState.pressX - mouseState.x) / 100, CONST.BULLET_SPEED_MAX);
    const vy = -Math.min((mouseState.pressY - mouseState.y) / 100, CONST.BULLET_SPEED_MAX);

    if (Math.abs(vx) < 0.1 || Math.abs(vy)  < 0.1) {
      return;
    }

    const now = performance.now();
    const dashWidth = 2;
    const dashEmptyWidth = 13;
    const dashOffset = -(dashWidth + dashEmptyWidth)*(now%1000)/1000;

    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.lineDashOffset = dashOffset;
    ctx.setLineDash([ dashWidth, dashEmptyWidth ]);
    ctx.beginPath();
    for (let time = 0; time < 500; time += 10) {
      const x = CONST.BULLET_START_X + vx * time;

      if (x > CONST.CANVAS_BASE_WIDTH / 2) {
        break;
      }

      const y = CONST.BULLET_START_Y - vy * time + CONST.g * time**2;

      if (time < 50) {
        ctx.moveTo(x, y);
      }
      else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.restore();
  }
}
