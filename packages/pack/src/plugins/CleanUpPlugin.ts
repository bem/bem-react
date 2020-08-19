import { remove } from 'fs-extra'
import { OnDone, Plugin } from '../interfaces'
import { mark } from '../debug'

/**
 * A list of directories which need to be cleaned.
 */
type Sources = string[]

class CleanUpPlugin implements Plugin {
  constructor(public sources: Sources) {
    mark('CleanUpPlugin::constructor')
  }

  async onBeforeRun(done: OnDone) {
    mark('CleanUpPlugin::onBeforeRun(start)')
    for (const source of this.sources) {
      await remove(source)
    }
    mark('CleanUpPlugin::onBeforeRun(finish)')
    done()
  }
}

export function useCleanUpPlugin(sources: Sources): CleanUpPlugin {
  return new CleanUpPlugin(sources)
}
