type ActionTypeAndPayload<T extends { [index: string]: any }> = {
  [K in keyof T]: T[K] extends undefined ? ActionWithoutPayload<K> : ActionWithPayload<T, K>
}
