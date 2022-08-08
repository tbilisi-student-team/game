export function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, r: number) {//TODO fillStyle etc
  context.fillStyle = '#0077aa';
  context.strokeStyle = '#0077aa47';
  context.lineWidth = 2;

  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fill();
  context.stroke();
}
