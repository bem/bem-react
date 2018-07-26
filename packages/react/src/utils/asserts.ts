import * as $invariant from 'invariant';
import * as $warning from 'warning';

// Use re-export because rollup cannot bundle this dependencies
export const invariant = $invariant;
export const warning = $warning;
