export default function PlaySounds(arr:Array<string>) {
  const pewsound = arr[Math.floor(Math.random()*arr.length)];
  const audioElement = new Audio('/' + pewsound + '.mp3');
  audioElement.play();
}