import { h, Component } from 'preact';
import PropTypes from 'proptypes';

import naming from '@bem/sdk.naming.presets';
import Core from '../Core';

const { Bem, decl, declMod } = Core({
    preset : {
        Render : h,
        Base : Component,
        classAttribute : 'class',
        PropTypes
    },
    naming : naming['react']
});

export default Bem;
export { decl, declMod };

