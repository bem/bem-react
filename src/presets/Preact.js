import { h, Component } from 'preact';

import naming from '@bem/sdk.naming.presets';
import Core from '../Core';

const { Bem, decl, declMod } = Core({
    preset : {
        Render : h,
        Base : Component,
        classAttribute : 'class',
        typeField : 'nodeName',
        attrsField : 'attributes'
    },
    naming : naming[process.env.BEM_NAMING || 'react']
});

export { Bem, decl, declMod };

