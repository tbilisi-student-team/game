export function getPauseTime (
  currentTime: number,
  startTime: number,
  elapsedTime: number
) {
  return (currentTime - startTime) - elapsedTime;
}
