import { react } from '@bem/sdk.naming.presets';
import { Component, createElement } from 'react';

import { declareBemCore } from './';

export const { Bem, Block, Elem } = declareBemCore({
    naming: react,
    Base: Component,
    render: createElement
});
