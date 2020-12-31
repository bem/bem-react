import { performance } from 'perf_hooks'

export function measurePerf(): () => string {
  const start = performance.now()
  return () => {
    const end = performance.now()
    const time = `${((end - start) / 1000).toFixed(2)}s`
    return time
  }
}
