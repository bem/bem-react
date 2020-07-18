import { remove } from 'fs-extra'

import { OnDone, Plugin } from '../interfaces'

class CleanUpPlugin implements Plugin {
  constructor(public sources: string[]) {}

  async onBeforeRun(done: OnDone) {
    for (const source of this.sources) {
      await remove(source)
    }
    done()
  }
}

export function useCleanUpPlugin(sources: string[]): CleanUpPlugin {
  return new CleanUpPlugin(sources)
}
