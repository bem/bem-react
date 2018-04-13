import { configure } from 'enzyme';
import { createElement as render, PureComponent as Base } from 'react';

import { declareBemCore } from '../../src/core';

const Adapter = require('enzyme-adapter-react-16');
const { react: naming } = require('@bem/sdk.naming.presets');

configure({ adapter: new Adapter() });

const { Block, Elem, Bem, withMods } = declareBemCore({ render, naming, Base });

export { Block, Elem, Bem, withMods, render };
