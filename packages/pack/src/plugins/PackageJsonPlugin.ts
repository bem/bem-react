import { existsSync, writeFileSync } from 'fs-extra'
import { resolve } from 'path'
import { Plugin, OnDone, HookOptions } from '../interfaces'
import { mark } from '../debug'

type Overrides = Record<string, any>

export class PackageJsonPlugin implements Plugin {
  name = 'PackageJsonPlugin'

  constructor(private overrides: Overrides) {
    mark('PackageJsonPlugin::constructor')
  }

  async onFinish(done: OnDone, { context, output }: HookOptions) {
    mark('PackageJsonPlugin::onFinish(start)')
    if (!existsSync(resolve(context, 'package.json'))) {
      throw new Error('Cannot find package.json.')
    }
    const pkg = require(resolve(context, 'package.json'))
    Object.assign(pkg, this.overrides)
    writeFileSync(resolve(output, 'package.json'), JSON.stringify(pkg, null, 2))
    mark('PackageJsonPlugin::onFinish(finish)')
    done()
  }
}

export function usePackageJsonPlugin(overrides: Overrides): PackageJsonPlugin {
  return new PackageJsonPlugin(overrides)
}
