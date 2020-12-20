/* eslint-disable quotes */

import FeatureFlagsWebpackPlugin from '../src/index'
import { compile } from './internal/compiler'
import { getResult } from './internal/getResult'
import { FEATURE_A, FEATURE_B } from './fixtures/features'

describe('FeatureFlagsWebpackPlugin', () => {
  test('should compile code with disabled feature', async () => {
    const { compiler } = await compile('./component-a.js')
    expect(getResult(compiler)).toMatchInlineSnapshot(
      `"(()=>{\\"use strict\\";console.log(\\"disabled\\")})();"`,
    )
  })

  test('should compile code with enabled feature', async () => {
    const plugin = new FeatureFlagsWebpackPlugin({ flags: { FEATURE_A } })
    const { compiler } = await compile('./component-a.js', { plugins: [plugin] })
    expect(getResult(compiler)).toMatchInlineSnapshot(
      `"(()=>{\\"use strict\\";console.log(\\"enabled\\")})();"`,
    )
  })

  test('should compile code with two enabled features', async () => {
    const plugin = new FeatureFlagsWebpackPlugin({ flags: { FEATURE_A, FEATURE_B } })
    const { compiler } = await compile('./component-b.js', { plugins: [plugin] })
    expect(getResult(compiler)).toMatchInlineSnapshot(
      `"(()=>{\\"use strict\\";console.log(\\"enabled FEATURE_A\\"),console.log(\\"enabled FEATURE_B\\")})();"`,
    )
  })

  test('should compile code with enabled feature and custom feature name', async () => {
    const plugin = new FeatureFlagsWebpackPlugin({
      isFeatureEnabledFnName: 'isEnabled',
      flags: { FEATURE_A },
    })
    const { compiler } = await compile('./component-c.js', { plugins: [plugin] })
    expect(getResult(compiler)).toMatchInlineSnapshot(
      `"(()=>{\\"use strict\\";console.log(\\"enabled FEATURE_A\\")})();"`,
    )
  })
})
