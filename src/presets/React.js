import React, { Component } from 'react';
import PropTypes from 'prop-types';

import naming from '@bem/sdk.naming.presets';
import Core from '../Core';

const { Bem, decl, declMod } = Core({
    preset : {
        Render : React.createElement.bind(React),
        Base : Component,
        classAttribute : 'className',
        typeField : 'type',
        attrsField : 'props',
        PropTypes
    },
    naming : naming[process.env.BEM_NAMING || 'react']
});

export { Bem, decl, declMod };

