import { remove } from 'fs-extra'
import { OnDone, Plugin } from '../interfaces'
import { mark } from '../debug'

class CleanUpPlugin implements Plugin {
  constructor(public sources: string[]) {
    mark('CleanUpPlugin::constructor')
  }

  async onBeforeRun(done: OnDone) {
    mark('CleanUpPlugin::onAfterRun(start)')
    for (const source of this.sources) {
      await remove(source)
    }
    mark('CleanUpPlugin::onAfterRun(finish)')
    done()
  }
}

export function useCleanUpPlugin(sources: string[]): CleanUpPlugin {
  return new CleanUpPlugin(sources)
}
