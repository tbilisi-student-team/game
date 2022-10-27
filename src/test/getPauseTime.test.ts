import { getPauseTime } from '../pages/game/utils/getPauseTime';

test('getPauseTime', () => {
  expect(getPauseTime(100, 0, 50)).toBe(50);
})
