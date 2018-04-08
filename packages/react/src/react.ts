import { react } from '@bem/sdk.naming.presets';
import * as React from 'react';

import { declareBemCore } from './';

const { Bem, Block, Elem, mod } = declareBemCore({
    naming: react,
    Base: React.PureComponent,
    render: React.createElement
});

export { Bem, Block, Elem, mod };
