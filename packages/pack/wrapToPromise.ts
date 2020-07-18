export function wrapToPromise(fn: (resolve: any) => void): Promise<void> {
  return new Promise((resolve) => {
    fn(resolve)
  })
}
