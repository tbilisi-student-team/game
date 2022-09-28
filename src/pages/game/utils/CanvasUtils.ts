type CircleProps = {
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
}

export function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, r: number, props: CircleProps = {}) {
  if (props.fillStyle) {
    context.fillStyle = props.fillStyle;
  }
  if (props.strokeStyle) {
    context.strokeStyle = props.strokeStyle;
  }
  if (props.lineWidth) {
    context.lineWidth = props.lineWidth;
  }

  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fill();
  context.stroke();
}
