import { getElapsedTime } from '../components/game/utils/getElapsedTime';

test('getElapsedTime', () => {
  expect(getElapsedTime(100, 0, 50)).toBe(50);
})
