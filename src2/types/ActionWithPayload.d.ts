type ActionWithPayload<T, K extends keyof T> = {
  type: K,
  payload: T[K],
}
