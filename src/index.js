import naming from '@bem/sdk.naming.presets';
import Core from './Core';
import React from './presets/React';

const { Bem, decl, declMod } = Core({
    preset : React,
    naming : naming['react']
});

export default Bem;
export { decl, declMod };
