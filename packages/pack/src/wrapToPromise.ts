export function wrapToPromise(
  fn: (resolve: any, payload: any) => void,
  payload: any,
): Promise<void> {
  return new Promise((resolve) => {
    fn(resolve, payload)
  })
}
