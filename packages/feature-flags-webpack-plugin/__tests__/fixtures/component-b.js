/* eslint-disable no-console */
import { FEATURE_A, FEATURE_B, isFeatureEnabled } from './features'

if (isFeatureEnabled(FEATURE_A)) {
  console.log('enabled FEATURE_A')
}

if (isFeatureEnabled(FEATURE_B)) {
  console.log('enabled FEATURE_B')
}
