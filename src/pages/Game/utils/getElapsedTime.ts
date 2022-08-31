export function getElapsedTime (currentTime: number, startTime: number, pauseTime: number) {
  return (currentTime - startTime) - pauseTime;
}
