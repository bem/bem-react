/* eslint-disable no-console */
import { FEATURE_A, isEnabled } from './features'

if (isEnabled(FEATURE_A)) {
  console.log('enabled FEATURE_A')
}
