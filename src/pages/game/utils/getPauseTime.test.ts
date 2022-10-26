import { getPauseTime } from './getPauseTime';

test('getPauseTime', () => {
  expect(getPauseTime(100, 0, 50)).toBe(50);
})
