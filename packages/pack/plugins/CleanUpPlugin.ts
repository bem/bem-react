import { remove } from 'fs-extra'

import { OnDone, Plugin } from '../interfaces'

export class CleanUpPlugin implements Plugin {
  constructor(public sources: string[]) {}

  async onBeforeRun(done: OnDone) {
    for (const source of this.sources) {
      await remove(source)
    }
    done()
  }
}
