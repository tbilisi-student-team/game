import { getElapsedTime } from './getElapsedTime';

test('getElapsedTime', () => {
  expect(getElapsedTime(100, 0, 50)).toBe(50);
})
