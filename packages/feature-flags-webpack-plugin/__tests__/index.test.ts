import FeatureFlagsWebpackPlugin from '../src/index'
import { compiler } from './__internal__/compiler'

test('yyy', async () => {
  const plugin = new FeatureFlagsWebpackPlugin()
  await compiler('', { plugins: [plugin] })

  expect(1).toBe(1)
})
