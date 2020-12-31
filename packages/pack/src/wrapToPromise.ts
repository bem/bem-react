// TODO: Remove this logic.
export function wrapToPromise(
  fn: (resolve: any, payload: any) => void,
  payload: any,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await fn(resolve, payload)
    } catch (error) {
      reject(error)
    }
  })
}
