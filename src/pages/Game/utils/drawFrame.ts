import { GameState } from '../types';
import * as CONST from '../consts';

/**
 * Главная функция, отвечающая за отрисовку состояния игры в кадре
 * @param state
 * @param ctx
 */
export function drawFrame(state: GameState, ctx: CanvasRenderingContext2D) {
  clearFrame(ctx);
}

function clearFrame(ctx: CanvasRenderingContext2D) {
  ctx.resetTransform();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.scale(ctx.canvas.width / CONST.CANVAS_BASE_WIDTH, ctx.canvas.height / CONST.CANVAS_BASE_HEIGHT);//TODO resize
}
