import { HookOutputFunction } from '../types';

export const withEqualValue =
  (fn: HookOutputFunction, equal: string): HookOutputFunction =>
  ({ value }) =>
    fn({ value, equal });
