/* eslint-disable no-console */
import { FEATURE_A, isFeatureEnabled } from './features'

if (isFeatureEnabled(FEATURE_A)) {
  console.log('enabled')
} else {
  console.log('disabled')
}
