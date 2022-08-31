import { getImage } from 'pages/Game/utils/getImage';
import buddyBackSrc from 'assets/buddy-1-back.png';
import buddyFrontSrc from 'assets/buddy-1-front.png';
import treeSrc from 'assets/tree.png';
import fetus1Src from 'assets/fetus-1.png';
import fetus2Src from 'assets/fetus-2.png';
import fetus3Src from 'assets/fetus-3.png';
import fetus4Src from 'assets/fetus-4.png';
import fetus5Src from 'assets/fetus-5.png';
import seedSrc from 'assets/seed.png';
import seedRaysSrc from 'assets/seed-rays.png';
import flowerSrc from 'assets/flower.png';

export function getGameImages() {
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
  const seed = getImage(seedSrc);
  const seedRays = getImage(seedRaysSrc);
  const flower = getImage(flowerSrc);
  
  return {
    buddyBack,
    buddyFront,
    tree,
    fetuses,
    seed,
    seedRays,
    flower,
  }
}
