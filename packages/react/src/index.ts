import { Component, createElement } from 'react';

import { declareBemCore } from './core';

const { react } = require('@bem/sdk.naming.presets');

export const { Bem, Block, Elem } = declareBemCore({
    naming: react,
    Base: Component,
    render: createElement
});
