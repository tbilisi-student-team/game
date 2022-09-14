import { getImage } from './index';
import buddyBack from '@/public/buddy-1-back.png';
import buddyFront from '@/public/buddy-1-front.png';
import tree from '@/public/tree.png';
import fetus1 from '@/public/fetus-1.png';
import fetus2 from '@/public/fetus-2.png';
import fetus3 from '@/public/fetus-3.png';
import fetus4 from '@/public/fetus-4.png';
import fetus5 from '@/public/fetus-5.png';
import seed from '@/public/seed.png';
import seedRays from '@/public/seed-rays.png';
import flower from '@/public/flower.png';

type GameImages = {
  buddyBack: HTMLImageElement,
  buddyFront: HTMLImageElement,
  tree: HTMLImageElement,
  seed: HTMLImageElement,
  seedRays: HTMLImageElement,
  flower: HTMLImageElement,
  fetuses: HTMLImageElement[],
}

export function getGameImages(): GameImages | undefined {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return;
  }

  const buddyBackHTMLImageElement = getImage(buddyBack.src);
  const buddyFrontHTMLImageElement = getImage(buddyFront.src);
  const treeHTMLImageElement = getImage(tree.src);
  const fetusesHTMLImageElements = [
    getImage(fetus1.src),
    getImage(fetus2.src),
    getImage(fetus3.src),
    getImage(fetus4.src),
    getImage(fetus5.src),
  ];
  const seedHTMLImageElement = getImage(seed.src);
  const seedRaysHTMLImageElement = getImage(seedRays.src);
  const flowerHTMLImageElement = getImage(flower.src);

  return {
    buddyBack: buddyBackHTMLImageElement,
    buddyFront: buddyFrontHTMLImageElement,
    tree: treeHTMLImageElement,
    fetuses: fetusesHTMLImageElements,
    seed: seedHTMLImageElement,
    seedRays: seedRaysHTMLImageElement,
    flower: flowerHTMLImageElement,
  }
}
